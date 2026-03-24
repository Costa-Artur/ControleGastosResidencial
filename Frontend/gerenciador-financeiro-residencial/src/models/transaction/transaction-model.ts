export type TransactionCategoryModel = {
    id: string;
    description: string;
    purpose: string;
}

export type TransactionPersonModel = {
    id: string;
    name: string;
    age: number;
}

export type TransactionModel = {
    id: string;
    description: string;
    amount: number;
    transactionType: "Receita" | "Despesa" | string;
    category: TransactionCategoryModel;
    person: TransactionPersonModel;
}

export type CreateTransactionModel = {
    description: string;
    amount: number;
    transactionType: "Receita" | "Despesa";
    categoryId: string;
    personId: string;
}

export type TransactionPaginationMetadataModel = {
    totalItemCount: number;
    totalPageCount: number;
    pageSize: number;
    currentPage: number;
}

export type TransactionPaginatedResultModel = {
    transactions: TransactionModel[];
    pagination: TransactionPaginationMetadataModel;
}
