import { PaginationMetadataModel, PersonModel, PersonPaginatedResultModel, PersonsTotalsModel, PersonWithTotalsModel } from "@//models/person/person-model";
import { PersonRepository } from "./person-repository";

export class JsonPersonRepository implements PersonRepository {

    private readonly baseUrl = "http://localhost:8080/api/persons/financial-summary";
    private readonly personsBaseUrl = "http://localhost:8080/api/persons";

    async getAll(pageNumber: number, pageSize: number): Promise<PersonPaginatedResultModel> {
        const url = new URL(this.baseUrl);
        url.searchParams.set("pageNumber", String(pageNumber));
        url.searchParams.set("pageSize", String(pageSize));

        const response = await fetch(url.toString());
        
        if (!response.ok) {
            throw new Error(`Erro ao buscar pessoas: ${response.status}`);
        }

        const payload = await response.json() as unknown;
        const persons = this.extractPersons(payload);
        const totals = this.extractTotals(payload);

        const paginationHeader = response.headers.get("X-Pagination");
        const pagination = this.parsePaginationHeader(paginationHeader, pageNumber, pageSize, persons.length);

        return {
            persons,
            totals,
            pagination,
        };
    }

    async getAllPersonsWithTotals(): Promise<PersonWithTotalsModel[]> {
        const response = await fetch(this.baseUrl);
        
        if (!response.ok) {
            throw new Error(`Erro ao buscar pessoas: ${response.status}`);
        }

        const payload = await response.json() as unknown;
        return this.extractPersons(payload);
    }
    async create(person: Omit<PersonModel, "id">): Promise<PersonModel> {
        const response = await fetch(this.personsBaseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(person),
        });

        if (!response.ok) {
            throw new Error(`Erro ao criar pessoa: ${response.status}`);
        }

        return response.json() as Promise<PersonModel>;
    }
    update(id: string, person: Omit<PersonModel, "id">): Promise<PersonModel | null> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
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

    private extractPersons(payload: unknown): PersonWithTotalsModel[] {
        if (Array.isArray(payload)) {
            return payload as PersonWithTotalsModel[];
        }

        if (payload && typeof payload === "object") {
            const recordPayload = payload as Record<string, unknown>;
            const persons = recordPayload.persons ?? recordPayload.Persons;

            if (Array.isArray(persons)) {
                return persons as PersonWithTotalsModel[];
            }
        }

        return [];
    }

    private extractTotals(payload: unknown): PersonsTotalsModel {
        const fallbackTotals: PersonsTotalsModel = {
            totalIncome: 0,
            totalExpense: 0,
            netBalance: 0,
        };

        if (!payload || typeof payload !== "object") {
            return fallbackTotals;
        }

        const recordPayload = payload as Record<string, unknown>;
        const totals = recordPayload.totals ?? recordPayload.Totals;

        if (!totals || typeof totals !== "object") {
            return fallbackTotals;
        }

        const recordTotals = totals as Record<string, number>;

        return {
            totalIncome: recordTotals.totalIncome ?? recordTotals.TotalIncome ?? 0,
            totalExpense: recordTotals.totalExpense ?? recordTotals.TotalExpense ?? 0,
            netBalance: recordTotals.netBalance ?? recordTotals.NetBalance ?? 0,
        };
    }

}

export const personRepository = new JsonPersonRepository();
