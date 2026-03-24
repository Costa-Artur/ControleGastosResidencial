import { PersonWithTotalsModel } from "@/models/person/person-model";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";

export function getPersonColumns(
    onEdit: (person: PersonWithTotalsModel) => void,
): ColumnDef<PersonWithTotalsModel>[] {
    return [
    {
        accessorKey: "name",
        header: "Nome",
    },
    {
        accessorKey: "age",
        header: "Idade",
    },
    {
        accessorKey: "totalIncome",
        header: () => <div className="text-right">Receita</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("totalIncome"));
            return (
                <div className="text-right">
                    {amount.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    })}
                </div>
            );
        }
    },
    {
        accessorKey: "totalExpense",
        header: () => <div className="text-right">Despesa</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("totalExpense"));
            return (
                <div className="text-right">
                    {amount.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    })}
                </div>
            );
        }
    },
    {
        accessorKey: "balance",
        header: () => <div className="text-right">Saldo</div>,
        cell: ({ row }) => {
            const amount = Number(row.getValue("balance"));
            const colorClass = amount < 0 ? "text-red-600" : "text-green-600";
            return (
                <div className={`text-right font-medium ${colorClass}`}>
                    {amount.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    })}
                </div>
            );
        }
    },
    {
        id: "actions",
        header: () => <span className="sr-only">Ações</span>,
        cell: ({ row }) => {
            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover: cursor-pointer"
                        aria-label="Editar pessoa"
                        onClick={() => onEdit(row.original)}
                    >
                        <Pencil className="size-4" />
                    </Button>
                </div>
            );
        },
        size: 40,
        minSize: 40,
        maxSize: 40,
        enableSorting: false,
        enableHiding: false,
    }
]
}