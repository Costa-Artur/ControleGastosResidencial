"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { personRepository } from "@/repositories/person/json-person-repository";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PersonWithTotalsModel } from "@/models/person/person-model";
import { PersonDialogFields } from "./person-dialog-fields";
import {
  personFormDefaultValues,
  personFormSchema,
  PersonFormInput,
  PersonFormOutput,
} from "./person-dialog.schema";

type EditPersonDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  person: PersonWithTotalsModel | null;
  onUpdated?: () => void;
};

export function EditPersonDialog({ open, onOpenChange, person, onUpdated }: EditPersonDialogProps) {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<PersonFormInput, unknown, PersonFormOutput>({
    resolver: zodResolver(personFormSchema),
    defaultValues: personFormDefaultValues,
    mode: "onSubmit",
  });

  useEffect(() => {
    if (!open) {
      form.reset(personFormDefaultValues);
      setError(null);
      setLoading(false);
      setDeleting(false);
      return;
    }

    if (person) {
      form.reset({
        name: person.name,
        age: String(person.age),
      });
      setError(null);
    }
  }, [open, person, form]);

  const onSubmit: SubmitHandler<PersonFormOutput> = async (data) => {
    if (!person) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updated = await personRepository.update(person.id, {
        name: data.name,
        age: data.age,
      });

      if (!updated) {
        setError("Pessoa não encontrada para atualização.");
        return;
      }

      onOpenChange(false);
      onUpdated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar pessoa");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!person) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      await personRepository.delete(person.id);
      onOpenChange(false);
      onUpdated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao remover pessoa");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar pessoa</DialogTitle>
          <DialogDescription>Atualize os dados da pessoa selecionada.</DialogDescription>
        </DialogHeader>

        <form className="grid gap-4" id="edit-person-form" onSubmit={form.handleSubmit(onSubmit)}>
          <PersonDialogFields
            form={form}
            loading={loading}
            ids={{ name: "edit-person-name", age: "edit-person-age" }}
          />
        </form>

        {error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <DialogFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="destructive"
                disabled={loading || deleting || !person}
                className="hover: cursor-pointer mr-auto"
              >
                {deleting ? "Excluindo..." : "Excluir"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir esta pessoa? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  disabled={deleting}
                  onClick={async () => {
                    await handleDelete();
                  }}
                >
                  {deleting ? "Excluindo..." : "Confirmar exclusão"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading || deleting}
            className="hover: cursor-pointer"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading || deleting || !person}
            form="edit-person-form"
            className="hover: cursor-pointer"
          >
            {loading ? "Salvando..." : "Salvar alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
