"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { categoryRepository } from "@/repositories/category/json-category-repository";
import { personRepository } from "@/repositories/person/json-person-repository";
import { transactionRepository } from "@/repositories/transaction/json-transaction-repository";
import { CategoryModel } from "@/models/category/category-model";
import { PersonModel } from "@/models/person/person-model";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { CreateTransactionDialogFields } from "./create-transaction-dialog-fields";
import {
	createTransactionFormDefaultValues,
	createTransactionFormSchema,
	CreateTransactionFormInput,
	CreateTransactionFormOutput,
} from "./create-transaction-dialog.schema";

type CreateTransactionDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onCreated?: () => void;
};

export function CreateTransactionDialog({
	open,
	onOpenChange,
	onCreated,
}: CreateTransactionDialogProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [persons, setPersons] = useState<PersonModel[]>([]);
	const [personsLoading, setPersonsLoading] = useState(false);

	const [categories, setCategories] = useState<CategoryModel[]>([]);
	const [categoriesLoading, setCategoriesLoading] = useState(false);

	const personRequestIdRef = useRef(0);
	const categoryRequestIdRef = useRef(0);

	const form = useForm<
		CreateTransactionFormInput,
		unknown,
		CreateTransactionFormOutput
	>({
		resolver: zodResolver(createTransactionFormSchema),
		defaultValues: createTransactionFormDefaultValues,
		mode: "onSubmit",
	});

	const selectedPersonId = useWatch({ control: form.control, name: "personId" });
	const selectedTransactionType = useWatch({
		control: form.control,
		name: "transactionType",
	});

	const selectedPerson = useMemo(
		() => persons.find((person) => person.id === selectedPersonId) ?? null,
		[persons, selectedPersonId],
	);

	const canChooseType = Boolean(selectedPersonId);
	const canChooseCategory = Boolean(selectedTransactionType);

	const availableTransactionTypes =
		selectedPerson && selectedPerson.age < 18 ? ["Despesa"] : ["Receita", "Despesa"];

	const loadAllPersons = async () => {
		if (personsLoading || !open) {
			return;
		}

		const requestId = ++personRequestIdRef.current;

		try {
			setPersonsLoading(true);
			let currentPage = 1;
			let totalPages = 1;
			const aggregated: PersonModel[] = [];

			do {
				const data = await personRepository.getAllList(currentPage, 10);

				if (requestId !== personRequestIdRef.current) {
					return;
				}

				aggregated.push(...data.persons);
				totalPages = Math.max(data.pagination.totalPageCount, currentPage);

				if (data.persons.length < 10 && data.pagination.totalPageCount <= currentPage) {
					break;
				}

				currentPage += 1;
			} while (currentPage <= totalPages);

			setPersons(
				aggregated.filter(
					(person, index, self) => self.findIndex((item) => item.id === person.id) === index,
				),
			);
		} catch (err) {
			if (requestId === personRequestIdRef.current) {
				setError(err instanceof Error ? err.message : "Erro ao carregar pessoas");
			}
		} finally {
			if (requestId === personRequestIdRef.current) {
				setPersonsLoading(false);
			}
		}
	};

	const loadAllCategories = async () => {
		if (categoriesLoading || !open || !selectedTransactionType) {
			return;
		}

		const requestId = ++categoryRequestIdRef.current;

		try {
			setCategoriesLoading(true);
			let currentPage = 1;
			let totalPages = 1;
			const aggregated: CategoryModel[] = [];

			do {
				const data = await categoryRepository.getAll(currentPage, 10, selectedTransactionType);

				if (requestId !== categoryRequestIdRef.current) {
					return;
				}

				aggregated.push(...data.categories);
				totalPages = Math.max(data.pagination.totalPageCount, currentPage);

				if (data.categories.length < 10 && data.pagination.totalPageCount <= currentPage) {
					break;
				}

				currentPage += 1;
			} while (currentPage <= totalPages);

			setCategories(
				aggregated.filter(
					(category, index, self) =>
						self.findIndex((item) => item.id === category.id) === index,
				),
			);
		} catch (err) {
			if (requestId === categoryRequestIdRef.current) {
				setError(err instanceof Error ? err.message : "Erro ao carregar categorias");
			}
		} finally {
			if (requestId === categoryRequestIdRef.current) {
				setCategoriesLoading(false);
			}
		}
	};

	useEffect(() => {
		if (!open) {
			form.reset(createTransactionFormDefaultValues);

			setError(null);
			setLoading(false);

			setPersons([]);

			setCategories([]);

			return;
		}

		void loadAllPersons();
	}, [open, form]);

	useEffect(() => {
		form.setValue("categoryId", "");
		setCategories([]);

		if (open && selectedTransactionType) {
			void loadAllCategories();
		}
	}, [selectedTransactionType, form, open]);

	const onSubmit: SubmitHandler<CreateTransactionFormOutput> = async (data) => {
		if (selectedPerson && selectedPerson.age < 18 && data.transactionType !== "Despesa") {
			form.setError("transactionType", {
				type: "manual",
				message: "Para menor de idade, apenas despesas sao permitidas",
			});
			return;
		}

		setLoading(true);
		setError(null);

		try {
			await transactionRepository.create({
				description: data.description,
				amount: data.amount,
				transactionType: data.transactionType as "Receita" | "Despesa",
				categoryId: data.categoryId,
				personId: data.personId,
			});

			onOpenChange(false);
			onCreated?.();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erro ao criar transacao");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Adicionar transação</DialogTitle>
					<DialogDescription>
						Preencha os campos na ordem: descricao e valor, depois pessoa, tipo e categoria.
					</DialogDescription>
				</DialogHeader>

				<form
					className="grid gap-4"
					id="transaction-form"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<CreateTransactionDialogFields
						form={form}
						loading={loading}
						persons={persons}
						categories={categories}
						personsLoading={personsLoading}
						categoriesLoading={categoriesLoading}
						canChooseType={canChooseType}
						canChooseCategory={canChooseCategory}
						availableTransactionTypes={availableTransactionTypes}
						onPersonChange={() => {
							form.setValue("transactionType", "");
							form.setValue("categoryId", "");
						}}
						onTypeChange={() => {
							form.setValue("categoryId", "");
						}}
					/>

					{error && (
						<div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">
							{error}
						</div>
					)}
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
						form="transaction-form"
						className="hover: cursor-pointer"
					>
						{loading ? "Salvando..." : "Salvar"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
