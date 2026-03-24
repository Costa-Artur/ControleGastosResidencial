export type PersonModel = {
    id: string;
    name: string;
    age: number;
}

export type CreatePersonModel = {
    name: string;
    age: number;
}

export type PersonWithTotalsModel = PersonModel & {
    totalIncome: number;
    totalExpense: number;
    balance: number;
}

export type PersonsTotalsModel = {
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
}

export type PaginationMetadataModel = {
    totalItemCount: number;
    totalPageCount: number;
    pageSize: number;
    currentPage: number;
}

export type PersonPaginatedResultModel = {
    persons: PersonWithTotalsModel[];
    totals: PersonsTotalsModel;
    pagination: PaginationMetadataModel;
}