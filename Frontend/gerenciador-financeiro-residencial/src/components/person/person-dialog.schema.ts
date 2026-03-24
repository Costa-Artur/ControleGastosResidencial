import * as z from "zod";

export const personFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Campo obrigatório")
    .max(200, "O nome deve ter no máximo 200 caracteres"),
  age: z.coerce
    .number({ message: "A idade deve ser um número inteiro positivo" })
    .int("A idade deve ser um número inteiro positivo")
    .positive("A idade deve ser um número inteiro positivo")
    .max(150, "A idade deve ser no máximo 150 anos"),
});

export type PersonFormInput = z.input<typeof personFormSchema>;
export type PersonFormOutput = z.output<typeof personFormSchema>;

export const personFormDefaultValues: PersonFormInput = {
  name: "",
  age: "",
};
