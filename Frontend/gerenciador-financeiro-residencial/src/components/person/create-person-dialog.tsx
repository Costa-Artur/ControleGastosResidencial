"use client";

import { SyntheticEvent, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { personRepository } from "@/repositories/person/json-person-repository";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

type CreatePersonDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
};

export function CreatePersonDialog({ open, onOpenChange, onCreated }: CreatePersonDialogProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; age?: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setName("");
      setAge(0);
      setFieldErrors({});
      setError(null);
      setLoading(false);
    }
  }, [open]);

  const validateFields = () => {
    const nextErrors: { name?: string; age?: string } = {};

    if (!name.trim()) {
      nextErrors.name = "Campo invalido.";
    }

    if (age <= 0) {
      nextErrors.age = "Campo invalido.";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!validateFields()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await personRepository.create({
        name: name.trim(),
        age,
      });

      onOpenChange(false);
      onCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar pessoa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar pessoa</DialogTitle>
          <DialogDescription>Informe os dados para cadastrar uma nova pessoa.</DialogDescription>
        </DialogHeader>

        <form className="grid gap-4" onSubmit={handleSubmit}>
           <Field data-invalid={Boolean(fieldErrors.name)}>
            <FieldLabel htmlFor="input-field-name">Nome <span className="text-destructive">*</span></FieldLabel>
            <Input
                id="input-field-name"
                type="text"
                placeholder="Digite o nome"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (fieldErrors.name) {
                    setFieldErrors((previous) => ({ ...previous, name: undefined }));
                  }
                }}
                aria-invalid={Boolean(fieldErrors.name)}
                disabled={loading}
                required
              />
              {fieldErrors.name && (
                <FieldDescription>
                  {fieldErrors.name}
                </FieldDescription>
              )}
          </Field>

          <Field data-invalid={Boolean(fieldErrors.age)}>
            <FieldLabel htmlFor="person-age">Idade <span className="text-destructive">*</span></FieldLabel>
            <Input
              id="person-age"
              type="number"
              min={1}
              value={age || ""}
              onChange={(event) => {
                setAge(Number(event.target.value));
                if (fieldErrors.age) {
                  setFieldErrors((previous) => ({ ...previous, age: undefined }));
                }
              }}
              aria-invalid={Boolean(fieldErrors.age)}
              placeholder="Ex.: 32"
              disabled={loading}
              required
            />
            {fieldErrors.age && (
              <FieldDescription>
                {fieldErrors.age}
              </FieldDescription>
            )}
          </Field>

          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
