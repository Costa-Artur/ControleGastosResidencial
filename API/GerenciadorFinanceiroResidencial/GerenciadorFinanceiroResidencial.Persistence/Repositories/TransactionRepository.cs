using GerenciadorFinanceiroResidencial.Application.Contracts;
using GerenciadorFinanceiroResidencial.Application.Features.Common;
using GerenciadorFinanceiroResidencial.Domain.Entities;
using GerenciadorFinanceiroResidencial.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace GerenciadorFinanceiroResidencial.Persistence.Repositories;

public class TransactionRepository(TransactionContext context) : ITransactionRepository
{
    public void AddPerson(Person person)
    {
        context.Persons.Add(person);
    }
    
    public  async Task<bool> SaveChangesAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }

    public async Task<(IEnumerable<Person>, PaginationMetadata)> GetAllPersonsAsync(int pageNumber, int pageSize)
    {
        var collection = context.Persons.OrderBy(p => p.Id).AsQueryable();

        var totalItemCount = await collection.CountAsync();
        
        var paginationMetadata = new PaginationMetadata(totalItemCount, pageSize, pageNumber);
        
        var personsToReturn = await collection
            .OrderBy(p => p.Id)
            .Skip(pageSize * (pageNumber - 1))
            .Take(pageSize)
            .ToListAsync();
        
        return (personsToReturn, paginationMetadata);
    }
    
    public async Task<bool> PersonExistsAsync(Guid id)
    {
        return await context.Persons.AnyAsync(p => p.Id == id);
    }

    public async Task<Person?> GetPersonByIdAsync(Guid id)
    {
        return await context.Persons.FirstOrDefaultAsync(p => p.Id == id);
    }
}