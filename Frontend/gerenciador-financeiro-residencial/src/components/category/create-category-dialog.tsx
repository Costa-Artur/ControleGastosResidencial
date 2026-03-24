"use client";

import { categoryRepository } from "@/repositories/category/json-category-repository";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  createCategoryFormDefaultValues,
  createCategoryFormSchema,
  CreateCategoryFormInput,
  CreateCategoryFormOutput,
} from "./create-category-dialog.schema";
import { CreateCategoryDialogFields } from "./create-category-dialog-fields";

type CreateCategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
};

export function CreateCategoryDialog({
  open,
  onOpenChange,
  onCreated,
}: CreateCategoryDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<
    CreateCategoryFormInput,
    unknown,
    CreateCategoryFormOutput
  >({
    resolver: zodResolver(createCategoryFormSchema),
    defaultValues: createCategoryFormDefaultValues,
    mode: "onSubmit",
  });

  useEffect(() => {
    if (!open) {
      form.reset(createCategoryFormDefaultValues);
      setError(null);
      setLoading(false);
    }
  }, [open, form]);

  const onSubmit: SubmitHandler<CreateCategoryFormOutput> = async (data) => {
    setLoading(true);
    setError(null);

    try {
      await categoryRepository.create({
        description: data.description,
        purpose: data.purpose,
      });

      onOpenChange(false);
      onCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar categoria");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar categoria</DialogTitle>
          <DialogDescription>
            Informe os dados para cadastrar uma nova categoria.
          </DialogDescription>
        </DialogHeader>

        <form
          className="grid gap-4"
          id="category-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <CreateCategoryDialogFields form={form} loading={loading} />
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="hover: cursor-pointer"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
            form="category-form"
            className="hover: cursor-pointer"
          >
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
