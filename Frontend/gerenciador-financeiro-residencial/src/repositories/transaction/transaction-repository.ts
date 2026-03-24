import { CreateTransactionModel, TransactionModel, TransactionPaginatedResultModel } from "@/models/transaction/transaction-model";

export interface TransactionRepository {
    getAll(pageNumber: number, pageSize: number): Promise<TransactionPaginatedResultModel>;
    create(transaction: CreateTransactionModel): Promise<TransactionModel>;
}
