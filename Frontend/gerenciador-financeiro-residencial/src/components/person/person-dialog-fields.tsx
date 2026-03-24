import { Controller, UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { PersonFormInput, PersonFormOutput } from "./person-dialog.schema";

type PersonDialogFieldsProps = {
  form: UseFormReturn<PersonFormInput, unknown, PersonFormOutput>;
  loading: boolean;
  ids?: {
    name: string;
    age: string;
  };
};

const defaultIds = {
  name: "person-name",
  age: "person-age",
};

export function PersonDialogFields({ form, loading, ids = defaultIds }: PersonDialogFieldsProps) {
  return (
    <FieldGroup>
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={ids.name}>
              Nome <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id={ids.name}
              type="text"
              placeholder="Digite o nome"
              maxLength={200}
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
        name="age"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={ids.age}>
              Idade <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id={ids.age}
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
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
}
