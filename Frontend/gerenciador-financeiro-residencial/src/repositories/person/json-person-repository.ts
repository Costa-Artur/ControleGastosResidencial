import { PersonModel, PersonWithTotalsModel } from "@//models/person/person-model";
import { PersonRepository } from "./person-repository";
import { log } from "console";

export class JsonPersonRepository implements PersonRepository {

    private readonly baseUrl = "http://localhost:8080/api/persons";

    async getAll(): Promise<PersonModel[]> {
        const response = await fetch(this.baseUrl);
        
        if (!response.ok) {
            throw new Error(`Erro ao buscar pessoas: ${response.status}`);
        }
        
        return response.json();
    }

    async getAllPersonsWithTotals(): Promise<PersonWithTotalsModel[]> {
        const response = await fetch(this.baseUrl);
        
        if (!response.ok) {
            throw new Error(`Erro ao buscar pessoas: ${response.status}`);
        }
        
        return response.json();
    }
    create(person: Omit<PersonModel, "id">): Promise<PersonModel> {
        throw new Error("Method not implemented.");
    }
    update(id: string, person: Omit<PersonModel, "id">): Promise<PersonModel | null> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

}

export const personRepository = new JsonPersonRepository();
