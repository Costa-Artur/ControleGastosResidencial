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

    public void AddCategory(Category category)
    {
        context.Categories.Add(category);
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

    public async Task<(IEnumerable<Category>, PaginationMetadata)> GetAllCategoriesAsync(int pageNumber, int pageSize)
    {
        var collection = context.Categories.OrderBy(c => c.Id).AsQueryable();
        
        var totalItemCount = await collection.CountAsync();
        
        var paginationMetadata = new PaginationMetadata(totalItemCount, pageSize, pageNumber);
        
        var categories = await collection
            .OrderBy(c => c.Id)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        
        return (categories, paginationMetadata);
    }

    public async Task<(IEnumerable<Transaction>, PaginationMetadata)> GetAllTransactionsAsync(int pageNumber, int pageSize)
    {
        var collection  = context.Transactions.OrderBy(t => t.Id).AsQueryable();
        
        var totalItemCount  = collection.Count();
        
        var paginationMetadata = new PaginationMetadata(totalItemCount, pageSize, pageNumber);
        
        var transactions = await collection
            .OrderBy(t => t.Id)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Include(t => t.Category)
            .Include(t => t.Person)
            .ToListAsync();
        
        return (transactions, paginationMetadata);
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