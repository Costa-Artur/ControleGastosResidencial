import { PersonModel, PersonPaginatedResultModel, PersonWithTotalsModel } from "@//models/person/person-model";

export interface PersonRepository {
    getAll(pageNumber: number, pageSize: number): Promise<PersonPaginatedResultModel>;
    getAllPersonsWithTotals(): Promise<PersonWithTotalsModel[]>;
    create(person: Omit<PersonModel, 'id'>): Promise<PersonModel>;
    update(id: string, person: Omit<PersonModel, 'id'>): Promise<PersonModel | null>;
    delete(id: string): Promise<void>;
}