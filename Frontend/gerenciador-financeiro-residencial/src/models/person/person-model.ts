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