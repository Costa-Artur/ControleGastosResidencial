'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { personRepository } from "@/repositories/person/json-person-repository";
import { PersonModel } from "@/models/person/person-model";

export default function HomePage() {
  const [persons, setPersons] = useState<PersonModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetAllPersons = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await personRepository.getAll();
      setPersons(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      console.error("Erro ao buscar pessoas:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-6xl font-bold text-blue-500 hover:bg-blue-700 hover:cursor-pointer transition duration-300">
        Gerenciador Financeiro Residencial
      </h1>

      <Button 
        variant="outline" 
        size="default" 
        className="mt-4"
        onClick={handleGetAllPersons}
        disabled={loading}
      >
        {loading ? "Carregando..." : "Clique aqui"}
      </Button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">
          Erro: {error}
        </div>
      )}

      {persons.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Pessoas Carregadas:</h2>
          <ul className="space-y-2">
            {persons.map(person => (
              <li key={person.id} className="p-4 bg-gray-100 rounded">
                <p className="font-semibold">{person.name}</p>
                <p className="text-sm text-gray-600">ID: {person.id}</p>
                <p className="text-sm text-gray-600">Idade: {person.age}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
