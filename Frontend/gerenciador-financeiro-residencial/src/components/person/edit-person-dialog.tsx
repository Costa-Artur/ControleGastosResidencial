"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { personRepository } from "@/repositories/person/json-person-repository";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import * as z from "zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PersonWithTotalsModel } from "@/models/person/person-model";

const formSchema = z.object({
  name: z.string().trim().min(1, "Campo obrigatório").max(200, "O nome deve ter no máximo 200 caracteres"),
  age: z.coerce
    .number({ message: "A idade deve ser um número inteiro positivo" })
    .int("A idade deve ser um número inteiro positivo")
    .positive("A idade deve ser um número inteiro positivo")
    .max(150, "A idade deve ser no máximo 150 anos"),
});

type EditPersonFormInput = z.input<typeof formSchema>;
type EditPersonFormOutput = z.output<typeof formSchema>;

type EditPersonDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  person: PersonWithTotalsModel | null;
  onUpdated?: () => void;
};

export function EditPersonDialog({ open, onOpenChange, person, onUpdated }: EditPersonDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<EditPersonFormInput, unknown, EditPersonFormOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: "",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (!open) {
      form.reset({ name: "", age: "" });
      setError(null);
      setLoading(false);
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

  const onSubmit: SubmitHandler<EditPersonFormOutput> = async (data) => {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar pessoa</DialogTitle>
          <DialogDescription>Atualize os dados da pessoa selecionada.</DialogDescription>
        </DialogHeader>

        <form className="grid gap-4" id="edit-person-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-person-name">Nome <span className="text-destructive">*</span></FieldLabel>
                  <Input
                    id="edit-person-name"
                    type="text"
                    placeholder="Digite o nome"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    aria-invalid={fieldState.invalid}
                    disabled={loading}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="age"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-person-age">Idade <span className="text-destructive">*</span></FieldLabel>
                  <Input
                    id="edit-person-age"
                    type="number"
                    min={1}
                    value={typeof field.value === "number" || typeof field.value === "string" ? field.value : ""}
                    onChange={(event) => field.onChange(event.target.value)}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    aria-invalid={fieldState.invalid}
                    placeholder="Ex.: 32"
                    disabled={loading}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        {error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading || !person} form="edit-person-form">
            {loading ? "Salvando..." : "Salvar alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
