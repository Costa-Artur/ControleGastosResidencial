import { CategoryPaginatedResultModel, CategoryModel, PaginationMetadataModel } from "@/models/category/category-model";
import { CategoryRepository } from "./category-repository";

export class JsonCategoryRepository implements CategoryRepository {

    private readonly baseUrl = "http://localhost:8080/api/categories";

    async getAll(pageNumber: number, pageSize: number, purpose?: string, searchTerm?: string): Promise<CategoryPaginatedResultModel> {
        const url = new URL(this.baseUrl);
        url.searchParams.set("pageNumber", String(pageNumber));
        url.searchParams.set("pageSize", String(pageSize));
        if (purpose) {
            url.searchParams.set("purpose", purpose);
        }

        if (searchTerm && searchTerm.trim().length > 0) {
            const normalizedSearch = searchTerm.trim();
            url.searchParams.set("search", normalizedSearch);
            url.searchParams.set("description", normalizedSearch);
        }

        const response = await fetch(url.toString());
        
        if (!response.ok) {
            throw new Error(`Erro ao buscar categorias: ${response.status}`);
        }

        const payload = await response.json() as unknown;
        const categories = this.extractCategories(payload);

        const paginationHeader = response.headers.get("X-Pagination");
        const pagination = this.parsePaginationHeader(paginationHeader, pageNumber, pageSize, categories.length);

        return {
            categories,
            pagination,
        };
    }

    async create(category: Omit<CategoryModel, "id">): Promise<CategoryModel> {
        const response = await fetch(this.baseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(category),
        });

        if (!response.ok) {
            throw new Error(`Erro ao criar categoria: ${response.status}`);
        }

        return response.json() as Promise<CategoryModel>;
    }

    private parsePaginationHeader(
            headerValue: string | null,
            fallbackPageNumber: number,
            fallbackPageSize: number,
            fallbackItemCount: number,
        ): PaginationMetadataModel {
            if (!headerValue) {
                return {
                    totalItemCount: fallbackItemCount,
                    totalPageCount: 1,
                    pageSize: fallbackPageSize,
                    currentPage: fallbackPageNumber,
                };
            }
    
            try {
                const parsed = JSON.parse(headerValue) as Record<string, number>;
    
                return {
                    totalItemCount: parsed.TotalItemCount ?? parsed.totalItemCount ?? fallbackItemCount,
                    totalPageCount: parsed.TotalPageCount ?? parsed.totalPageCount ?? 1,
                    pageSize: parsed.PageSize ?? parsed.pageSize ?? fallbackPageSize,
                    currentPage: parsed.CurrentPage ?? parsed.currentPage ?? fallbackPageNumber,
                };
            } catch {
                return {
                    totalItemCount: fallbackItemCount,
                    totalPageCount: 1,
                    pageSize: fallbackPageSize,
                    currentPage: fallbackPageNumber,
                };
            }
        }
    
        private extractCategories(payload: unknown): CategoryModel[] {
            if (Array.isArray(payload)) {
                return payload as CategoryModel[];
            }
    
            if (payload && typeof payload === "object") {
                const recordPayload = payload as Record<string, unknown>;
                const categories = recordPayload.categories ?? recordPayload.Categories;
    
                if (Array.isArray(categories)) {
                    return categories as CategoryModel[];
                }
            }
    
            return [];
        }
}

export const categoryRepository = new JsonCategoryRepository();