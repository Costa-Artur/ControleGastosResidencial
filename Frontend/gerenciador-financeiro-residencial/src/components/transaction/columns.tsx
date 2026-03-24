import { TransactionModel } from "@/models/transaction/transaction-model";
import { ColumnDef } from "@tanstack/react-table";

export const transactionColumns: ColumnDef<TransactionModel>[] = [
    {
        accessorKey: "description",
        header: "Descricao",
        size: 35,
        cell: ({ row }) => {
            const description = String(row.getValue("description") ?? "");

            return (
                <div className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap" title={description}>
                    {description}
                </div>
            );
        },
    },
    {
        accessorKey: "transactionType",
        header: "Tipo",
        size: 12,
    },
    {
        id: "category",
        header: "Categoria",
        size: 20,
        accessorFn: (row) => row.category?.description ?? "-",
        cell: ({ row }) => {
            const category = row.original.category?.description ?? "-";
            return <span className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap" title={category}>{category}</span>;
        },
    },
    {
        id: "person",
        header: "Pessoa",
        size: 18,
        accessorFn: (row) => row.person?.name ?? "-",
        cell: ({ row }) => {
            const person = row.original.person?.name ?? "-";
            return <span className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap" title={person}>{person}</span>;
        },
    },
    {
        accessorKey: "amount",
        header: () => <div className="text-right">Valor</div>,
        size: 15,
        cell: ({ row }) => {
            const amount = Number(row.getValue("amount"));
            const type = String(row.getValue("transactionType") ?? "").toLowerCase();
            const colorClass = type.includes("despesa") || amount < 0 ? "text-red-600" : "text-green-600";

            return (
                <div className={`text-right font-medium ${colorClass}`}>
                    {amount.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    })}
                </div>
            );
        },
    },
];
