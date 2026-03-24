import * as z from "zod";

export const createTransactionFormSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Campo obrigatório")
    .max(400, "A descrição deve ter no máximo 400 caracteres"),
  amount: z.coerce
    .number({ message: "Valor deve ser um número positivo" })
    .positive("Valor deve ser maior que 0"),
  personId: z.string().min(1, "Pessoa deve ser preenchida"),
  transactionType: z
    .string()
    .min(1, "Tipo deve ser preenchido")
    .refine((value) => value === "Receita" || value === "Despesa", {
      message: "Tipo deve ser Receita ou Despesa",
    }),
  categoryId: z.string().min(1, "Categoria deve ser preenchida"),
});

export type CreateTransactionFormInput = z.input<typeof createTransactionFormSchema>;
export type CreateTransactionFormOutput = z.output<typeof createTransactionFormSchema>;

export const createTransactionFormDefaultValues: CreateTransactionFormInput = {
  description: "",
  amount: "",
  personId: "",
  transactionType: "",
  categoryId: "",
};
