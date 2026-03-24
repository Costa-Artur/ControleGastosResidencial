'use client';

import { useEffect, useState } from "react";
import { personRepository } from "@/repositories/person/json-person-repository";
import { PersonsTotalsModel, PersonWithTotalsModel } from "@/models/person/person-model";
import MenuBar from "@/components/menu-bar";
import { DataTable } from "@/components/person/data-table";
import { personColumns } from "@/components/person/columns";
import { Item, ItemContent } from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreatePersonDialog } from "@/components/person/create-person-dialog";

export default function HomePage() {
  const [persons, setPersons] = useState<PersonWithTotalsModel[]>([]);
  const [totals, setTotals] = useState<PersonsTotalsModel>({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleGetAllPersons = async (pageNumber: number, currentPageSize: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await personRepository.getAll(pageNumber, currentPageSize);
      setPersons(data.persons);
      setTotals(data.totals);
      setCurrentPage(data.pagination.currentPage);
      setTotalPages(data.pagination.totalPageCount);
      setTotalItems(data.pagination.totalItemCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      console.error("Erro ao buscar pessoas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void handleGetAllPersons(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setCurrentPage(1);
    }
  };

  const formatValue = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const colorClass = totals.netBalance < 0 ? "text-red-600" : "text-green-600";

  return (
    <div className="p-8 flex flex-col gap-4">
      <MenuBar/>

      <div className="w-full flex justify-end">
        <Button onClick={() => setCreateDialogOpen(true)}>
          Adicionar
          <Plus/>
        </Button>
      </div>

      <CreatePersonDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreated={() => {
          void handleGetAllPersons(currentPage, pageSize);
        }}
      />

      <DataTable
        data={persons}
        columns={personColumns}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        loading={loading}
      />

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Erro: {error}
        </div>
      )}

      <Item variant="outline" >
        <ItemContent>
          <div className="flex flex-row justify-around p-5">
        <p className="text-sm">Receita total: {formatValue(totals.totalIncome)}</p>
        <p className="text-sm">Despesa total: {formatValue(totals.totalExpense)}</p>
        <p className="text-sm font-semibold">Saldo líquido: <span className={colorClass}>{formatValue(totals.netBalance)}</span></p>
          </div>
      </ItemContent>
      </Item>
    </div>
  );
}
