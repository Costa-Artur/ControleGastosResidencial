"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { personRepository } from "@/repositories/person/json-person-repository";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import * as z from "zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().trim().min(1, "Campo obrigatório").max(200, "O nome deve ter no máximo 200 caracteres"),
  age: z.coerce
    .number({ message: "A idade deve ser um número inteiro positivo" })
    .int("A idade deve ser um número inteiro positivo")
    .positive("A idade deve ser um número inteiro positivo")
    .max(150, "A idade deve ser no máximo 150 anos"),
})

  type CreatePersonFormInput = z.input<typeof formSchema>;
  type CreatePersonFormOutput = z.output<typeof formSchema>;

type CreatePersonDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
};

export function CreatePersonDialog({ open, onOpenChange, onCreated }: CreatePersonDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreatePersonFormInput, unknown, CreatePersonFormOutput>({
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
    }
  }, [open, form]);

  const onSubmit: SubmitHandler<CreatePersonFormOutput> = async (data) => {
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
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({field, fieldState}) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="input-field-name">Nome <span className="text-destructive">*</span></FieldLabel>
                  <Input
                      id="input-field-name"
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
            >
              
            </Controller>
           
          <Controller
            name="age"
            control={form.control}
            render = {({field, fieldState}) => (
              <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="person-age">Idade <span className="text-destructive">*</span></FieldLabel>
                        <Input
                          id="person-age"
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
            )}>
           </Controller>
          
          </FieldGroup>
        </form>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} form="person-form">
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
