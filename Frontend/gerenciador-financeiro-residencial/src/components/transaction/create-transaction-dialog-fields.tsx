import { CategoryModel } from "@/models/category/category-model";
import { PersonModel } from "@/models/person/person-model";
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
  CreateTransactionFormInput,
  CreateTransactionFormOutput,
} from "./create-transaction-dialog.schema";

type CreateTransactionDialogFieldsProps = {
  form: UseFormReturn<
    CreateTransactionFormInput,
    unknown,
    CreateTransactionFormOutput
  >;
  loading: boolean;
  persons: PersonModel[];
  categories: CategoryModel[];
  personsLoading: boolean;
  categoriesLoading: boolean;
  canChooseType: boolean;
  canChooseCategory: boolean;
  availableTransactionTypes: string[];
  onPersonChange: (personId: string) => void;
  onTypeChange: (type: string) => void;
};

export function CreateTransactionDialogFields({
  form,
  loading,
  persons,
  categories,
  personsLoading,
  categoriesLoading,
  canChooseType,
  canChooseCategory,
  availableTransactionTypes,
  onPersonChange,
  onTypeChange,
}: CreateTransactionDialogFieldsProps) {
  return (
    <FieldGroup>
      <Controller
        name="description"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="transaction-description">
              Descrição <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="transaction-description"
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
        name="amount"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="transaction-amount">
              Valor <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="transaction-amount"
              type="number"
              min={0}
              step="0.01"
              placeholder="Ex.: 150.90"
              value={typeof field.value === "number" || typeof field.value === "string" ? field.value : ""}
              onChange={(event) => field.onChange(event.target.value)}
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
        name="personId"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>
              Pessoa <span className="text-destructive">*</span>
            </FieldLabel>
            <Select
              value={field.value ?? ""}
              onValueChange={(value) => {
                field.onChange(value);
                onPersonChange(value);
              }}
              disabled={loading}
            >
              <SelectTrigger className="w-full max-w-130">
                <SelectValue placeholder="Selecione a pessoa" />
              </SelectTrigger>
              <SelectContent className="max-h-72 max-w-130">
                <SelectGroup>
                  {persons.map((person) => (
                    <SelectItem key={person.id} value={person.id}>
                      <span className="block max-w-117.5 truncate" title={`${person.name} (${person.age} anos)`}>
                        {person.name} ({person.age} anos)
                      </span>
                    </SelectItem>
                  ))}
                  {personsLoading && (
                    <div className="px-2 py-2 text-xs text-muted-foreground">
                      Carregando pessoas...
                    </div>
                  )}
                  {!personsLoading && persons.length === 0 && (
                    <div className="px-2 py-2 text-xs text-muted-foreground">
                      Nenhuma pessoa encontrada.
                    </div>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="transactionType"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>
              Tipo <span className="text-destructive">*</span>
            </FieldLabel>
            <Select
              value={field.value ?? ""}
              onValueChange={(value) => {
                field.onChange(value);
                onTypeChange(value);
              }}
              disabled={loading || !canChooseType}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    canChooseType ? "Selecione o tipo" : "Selecione uma pessoa antes"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {availableTransactionTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="categoryId"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>
              Categoria <span className="text-destructive">*</span>
            </FieldLabel>
            <Select
              value={field.value ?? ""}
              onValueChange={field.onChange}
              disabled={loading || !canChooseCategory}
            >
              <SelectTrigger className="w-full max-w-130">
                <SelectValue
                  placeholder={
                    canChooseCategory ? "Selecione a categoria" : "Selecione o tipo antes"
                  }
                />
              </SelectTrigger>
              <SelectContent className="max-h-72 max-w-130">
                <SelectGroup>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <span className="block max-w-117.5 truncate" title={category.description}>
                        {category.description}
                      </span>
                    </SelectItem>
                  ))}
                  {categoriesLoading && (
                    <div className="px-2 py-2 text-xs text-muted-foreground">
                      Carregando categorias...
                    </div>
                  )}
                  {!categoriesLoading && canChooseCategory && categories.length === 0 && (
                    <div className="px-2 py-2 text-xs text-muted-foreground">
                      Nenhuma categoria encontrada.
                    </div>
                  )}
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
