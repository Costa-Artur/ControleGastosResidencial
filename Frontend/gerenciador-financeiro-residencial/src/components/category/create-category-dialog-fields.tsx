import { Controller, UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  CreateCategoryFormInput,
  CreateCategoryFormOutput,
} from "./create-category-dialog.schema";

type CreateCategoryDialogFieldsProps = {
  form: UseFormReturn<CreateCategoryFormInput, unknown, CreateCategoryFormOutput>;
  loading: boolean;
};

export function CreateCategoryDialogFields({
  form,
  loading,
}: CreateCategoryDialogFieldsProps) {
  return (
    <FieldGroup>
      <Controller
        name="description"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="input-field-description">
              Descrição <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="input-field-description"
              type="text"
              placeholder="Digite a descrição"
              maxLength={400}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
              aria-invalid={fieldState.invalid}
              disabled={loading}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="purpose"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="input-field-purpose">
              Finalidade <span className="text-destructive">*</span>
            </FieldLabel>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={loading}
            >
              <SelectTrigger className="w-45">
                <SelectValue placeholder="Finalidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Receita">Receita</SelectItem>
                  <SelectItem value="Despesa">Despesa</SelectItem>
                  <SelectItem value="Ambas">Ambas</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
}
