export type CategoryModel = {
    id: string;
    description: string;
    purpose: string;
}

export type CreateCategoryModel = {
    description: string;
    purpose: string;
}

export type PaginationMetadataModel = {
    totalItemCount: number;
    totalPageCount: number;
    pageSize: number;
    currentPage: number;
}

export type CategoryPaginatedResultModel = {
    categories: CategoryModel[];
    pagination: PaginationMetadataModel;
}