import { CategoryModel } from "@/models/category/category-model";
import { ColumnDef } from "@tanstack/react-table";

export const categoryColumns: ColumnDef<CategoryModel>[] = [
    {
        accessorKey: "description",
        header: "Descrição",
        size: 80,
        cell: ({ row }) => {
            const description = String(row.getValue("description") ?? "");

            return (
                <div
                    className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
                    title={description}
                >
                    {description}
                </div>
            );
        },
    },
    {
        accessorKey: "purpose",
        header: "Finalidade",
        size: 20,
    }
];