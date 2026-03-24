import { CategoryModel, CategoryPaginatedResultModel } from "@/models/category/category-model";

export interface CategoryRepository {
    getAll(pageNumber: number, pageSize: number, purpose?: string, searchTerm?: string): Promise<CategoryPaginatedResultModel>;
    create(category: Omit<CategoryModel, 'id'>): Promise<CategoryModel>;
}