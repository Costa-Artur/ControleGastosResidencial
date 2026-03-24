"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { personRepository } from "@/repositories/person/json-person-repository";
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { PersonDialogFields } from "./person-dialog-fields";
import {
  personFormDefaultValues,
  personFormSchema,
  PersonFormInput,
  PersonFormOutput,
} from "./person-dialog.schema";

type CreatePersonDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
};

export function CreatePersonDialog({ open, onOpenChange, onCreated }: CreatePersonDialogProps) {
  const [loading, setLoading] = useState(false);
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
    }
  }, [open, form]);

  const onSubmit: SubmitHandler<PersonFormOutput> = async (data) => {
    setLoading(true);
    setError(null);

    try {
      await personRepository.create({
        name: data.name,
        age: data.age,
      });

      onOpenChange(false);
      onCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar pessoa");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar pessoa</DialogTitle>
          <DialogDescription>Informe os dados para cadastrar uma nova pessoa.</DialogDescription>
        </DialogHeader>

        <form className="grid gap-4" id="person-form" onSubmit={form.handleSubmit(onSubmit)}>
          <PersonDialogFields
            form={form}
            loading={loading}
            ids={{ name: "input-field-name", age: "person-age" }}
          />
        </form>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading} className="hover: cursor-pointer">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} form="person-form" className="hover: cursor-pointer">
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
