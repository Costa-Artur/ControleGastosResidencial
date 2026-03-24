"use client";

import { useEffect, useState } from "react";
import { transactionColumns } from "@/components/transaction/columns";
import { CreateTransactionDialog } from "@/components/transaction/create-transaction-dialog";
import { DataTable } from "@/components/transaction/data-table";
import MenuBar from "@/components/menu-bar"
import { Button } from "@/components/ui/button";
import { TransactionModel } from "@/models/transaction/transaction-model";
import { transactionRepository } from "@/repositories/transaction/json-transaction-repository";
import { Plus } from "lucide-react";

type Props = {

}

export default function TransactionsPage(props: Props) {
    const [transactions, setTransactions] = useState<TransactionModel[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const handleGetAllTransactions = async (pageNumber: number, currentPageSize: number) => {
        try {
            setLoading(true);
            setError(null);
            const data = await transactionRepository.getAll(pageNumber, currentPageSize);
            setTransactions(data.transactions);
            setCurrentPage(data.pagination.currentPage);
            setTotalPages(data.pagination.totalPageCount);
            setTotalItems(data.pagination.totalItemCount);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro desconhecido");
            console.error("Erro ao buscar transacoes:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void handleGetAllTransactions(currentPage, pageSize);
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

    return (
        <div className="p-8 flex flex-col gap-4">
            <MenuBar/>

            <div className="w-full flex justify-end">
                <Button onClick={() => setCreateDialogOpen(true)} className="hover: cursor-pointer">
                    Adicionar
                    <Plus/>
                </Button>
            </div>

            <CreateTransactionDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onCreated={() => {
                    void handleGetAllTransactions(currentPage, pageSize);
                }}
            />

            <DataTable
                data={transactions}
                columns={transactionColumns}
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
        </div>
    )
}
