'use client';

import { categoryColumns } from "@/components/category/columns";
import { CreateCategoryDialog } from "@/components/category/create-category-dialog";
import { DataTable } from "@/components/category/data-table";
import MenuBar from "@/components/menu-bar";
import { Button } from "@/components/ui/button";
import { CategoryModel } from "@/models/category/category-model";
import { categoryRepository } from "@/repositories/category/json-category-repository";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {

}

export default function CategoriesPage(props: Props) {
    const [categories, setCategories] = useState<CategoryModel[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

      const handleGetAllCategories = async (pageNumber: number, currentPageSize: number) => {
        try {
          setLoading(true);
          setError(null);
          const data = await categoryRepository.getAll(pageNumber, currentPageSize);
          setCategories(data.categories);
          setCurrentPage(data.pagination.currentPage);
          setTotalPages(data.pagination.totalPageCount);
          setTotalItems(data.pagination.totalItemCount);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Erro desconhecido");
          console.error("Erro ao buscar categorias:", err);
        } finally {
          setLoading(false);
        }
      };

    useEffect(() => {
    void handleGetAllCategories(currentPage, pageSize);
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

            <CreateCategoryDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onCreated={() => {
                    void handleGetAllCategories(currentPage, pageSize);
                }}
            />

            <DataTable
                data={categories}
                columns={categoryColumns}
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={totalItems}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                loading={loading}
            />
        </div>
    )
}