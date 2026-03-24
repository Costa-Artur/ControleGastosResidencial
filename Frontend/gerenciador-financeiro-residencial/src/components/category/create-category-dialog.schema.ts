import * as z from "zod";

export const createCategoryFormSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Campo obrigatório")
    .max(400, "A descrição deve ter no máximo 400 caracteres"),
  purpose: z.enum(["Receita", "Despesa", "Ambas"], {
    message: "Finalidade deve ser 'Receita', 'Despesa' ou 'Ambas'",
  }),
});

export type CreateCategoryFormInput = z.input<typeof createCategoryFormSchema>;
export type CreateCategoryFormOutput = z.output<typeof createCategoryFormSchema>;

export const createCategoryFormDefaultValues: CreateCategoryFormInput = {
  description: "",
  purpose: "Receita",
};
