import { CreateTransactionModel, TransactionModel, TransactionPaginatedResultModel, TransactionPaginationMetadataModel } from "@/models/transaction/transaction-model";
import { TransactionRepository } from "./transaction-repository";

export class JsonTransactionRepository implements TransactionRepository {

    private readonly baseUrl = "http://localhost:8080/api/transactions";

    async getAll(pageNumber: number, pageSize: number): Promise<TransactionPaginatedResultModel> {
        const url = new URL(this.baseUrl);
        url.searchParams.set("pageNumber", String(pageNumber));
        url.searchParams.set("pageSize", String(pageSize));

        const response = await fetch(url.toString());

        if (!response.ok) {
            throw new Error(`Erro ao buscar transacoes: ${response.status}`);
        }

        const payload = await response.json() as unknown;
        const transactions = this.extractTransactions(payload);

        const paginationHeader = response.headers.get("X-Pagination");
        const pagination = this.parsePaginationHeader(paginationHeader, pageNumber, pageSize, transactions.length);

        return {
            transactions,
            pagination,
        };
    }

    async create(transaction: CreateTransactionModel): Promise<TransactionModel> {
        const response = await fetch(this.baseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                description: transaction.description,
                amount: transaction.amount,
                transactionType: transaction.transactionType,
                categoryId: transaction.categoryId,
                personId: transaction.personId,
            }),
        });

        if (!response.ok) {
            throw new Error(`Erro ao criar transacao: ${response.status}`);
        }

        return response.json() as Promise<TransactionModel>;
    }

    private parsePaginationHeader(
        headerValue: string | null,
        fallbackPageNumber: number,
        fallbackPageSize: number,
        fallbackItemCount: number,
    ): TransactionPaginationMetadataModel {
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

    private extractTransactions(payload: unknown): TransactionModel[] {
        if (Array.isArray(payload)) {
            return payload as TransactionModel[];
        }

        if (payload && typeof payload === "object") {
            const recordPayload = payload as Record<string, unknown>;
            const transactions = recordPayload.transactions ?? recordPayload.Transactions;

            if (Array.isArray(transactions)) {
                return transactions as TransactionModel[];
            }
        }

        return [];
    }
}

export const transactionRepository = new JsonTransactionRepository();
