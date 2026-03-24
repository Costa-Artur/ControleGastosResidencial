import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Item, ItemContent } from "../ui/item";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "../ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    onPageChange,
    onPageSizeChange,
    loading = false,
}: DataTableProps<TData, TValue>) {

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const pageSizeOptions = [5, 10, 20, 50];

  return (
    <div>
      <div className="rounded-md border">
        <Table className="table-fixed w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const width = header.column.columnDef.size;

                  return (
                    <TableHead
                      key={header.id}
                      className={header.id === "actions" ? "w-0 px-1" : undefined}
                      style={width ? { width: `${width}%` } : undefined}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => {
                    const width = cell.column.columnDef.size;

                    return (
                    <TableCell
                      key={cell.id}
                      className={cell.column.id === "actions" ? "w-0 px-1" : undefined}
                      style={width ? { width: `${width}%` } : undefined}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Item variant="outline" className=" mt-4">
        <ItemContent>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-muted-foreground">
              Total de itens: {totalItems}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <label className="text-sm text-muted-foreground" htmlFor="transaction-page-size-select">
                Itens por pagina
              </label>
              <select
                id="transaction-page-size-select"
                className="h-8 rounded-md border bg-background px-2 text-sm"
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                disabled={loading}
              >
                {pageSizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <label className="text-sm text-muted-foreground" htmlFor="transaction-page-select">
                Pagina
              </label>
              <select
                id="transaction-page-select"
                className="h-8 rounded-md border bg-background px-2 text-sm"
                value={currentPage}
                onChange={(e) => onPageChange(Number(e.target.value))}
                disabled={loading || totalPages === 0}
              >
                {Array.from({ length: Math.max(totalPages, 1) }, (_, index) => {
                  const page = index + 1;

                  return (
                    <option key={page} value={page}>
                      {page}
                    </option>
                  );
                })}
              </select>

              <span className="text-sm text-muted-foreground">
                de {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={loading || currentPage <= 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={loading || currentPage >= totalPages}
              >
                Proxima
              </Button>
            </div>
          </div>
        </ItemContent>
      </Item>
    </div>
  );
}
