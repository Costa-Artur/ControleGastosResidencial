using GerenciadorFinanceiroResidencial.Application.Contracts;
using GerenciadorFinanceiroResidencial.Application.Features.Common;
using GerenciadorFinanceiroResidencial.Domain.Entities;
using GerenciadorFinanceiroResidencial.Application.Features.Persons.Queries.GetPersonsFinancialSummary;
using GerenciadorFinanceiroResidencial.Domain.Enums;
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

    public void AddTransaction(Transaction transaction)
    {
        context.Transactions.Add(transaction);
    }

    public void UpdatePerson(Person person)
    {
        var trackedPerson = context.Persons.Local.FirstOrDefault(p => p.Id == person.Id);

        if (trackedPerson is not null)
        {
            context.Entry(trackedPerson).CurrentValues.SetValues(person);
            return;
        }

        context.Persons.Update(person);
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

    public async Task<(IEnumerable<PersonFinancialSummaryDto> Persons, PersonsFinancialSummaryTotalDto Totals, PaginationMetadata PaginationMetadata)> GetPersonsFinancialSummaryAsync(int pageNumber, int pageSize)
    {
        var baseQuery = context.Persons
            .AsNoTracking()
            .GroupJoin(
                context.Transactions.AsNoTracking(),
                person => person.Id,
                transaction => transaction.PersonId,
                (person, transactions) => new PersonFinancialSummaryDto
                {
                    Id = person.Id,
                    Name = person.Name,
                    Age = person.Age,
                    TotalIncome = transactions
                        .Where(transaction => transaction.TransactionType == TransactionType.Receita)
                        .Sum(transaction => (decimal?)transaction.Amount) ?? 0m,
                    TotalExpense = transactions
                        .Where(transaction => transaction.TransactionType == TransactionType.Despesa)
                        .Sum(transaction => (decimal?)transaction.Amount) ?? 0m
                });

        var totalItemCount = await baseQuery.CountAsync();
        var paginationMetadata = new PaginationMetadata(totalItemCount, pageSize, pageNumber);

        var personsSummary = await baseQuery
            .OrderBy(person => person.Name)
            .Skip(pageSize * (pageNumber - 1))
            .Take(pageSize)
            .ToListAsync();

        foreach (var person in personsSummary)
        {
            person.Balance = person.TotalIncome - person.TotalExpense;
        }

        var totals = await context.Transactions
            .AsNoTracking()
            .GroupBy(_ => 1)
            .Select(group => new PersonsFinancialSummaryTotalDto
            {
                TotalIncome = group
                    .Where(transaction => transaction.TransactionType == TransactionType.Receita)
                    .Sum(transaction => (decimal?)transaction.Amount) ?? 0m,
                TotalExpense = group
                    .Where(transaction => transaction.TransactionType == TransactionType.Despesa)
                    .Sum(transaction => (decimal?)transaction.Amount) ?? 0m
            })
            .FirstOrDefaultAsync() ?? new PersonsFinancialSummaryTotalDto();

        totals.NetBalance = totals.TotalIncome - totals.TotalExpense;

        return (personsSummary, totals, paginationMetadata);
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

    public async Task<Category?> GetCategoryByIdAsync(Guid id)
    {
        return await context.Categories.FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<bool> DeletePersonAndTransactionsAsync(Guid personId)
    {
        var person = await context.Persons.FirstOrDefaultAsync(p => p.Id == personId);

        if (person == null)
        {
            return false;
        }

        var transactions = await context.Transactions
            .Where(t => t.PersonId == personId)
            .ToListAsync();

        if (transactions.Count > 0)
        {
            context.Transactions.RemoveRange(transactions);
        }

        context.Persons.Remove(person);

        await context.SaveChangesAsync();
        return true;
    }
}