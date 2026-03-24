using GerenciadorFinanceiroResidencial.Application.Features.Common;
using GerenciadorFinanceiroResidencial.Application.Features.Persons.Queries.GetPersonsDetail;
using GerenciadorFinanceiroResidencial.Application.Features.Persons.Queries.GetPersonsFinancialSummary;
using GerenciadorFinanceiroResidencial.Domain.Entities;

namespace GerenciadorFinanceiroResidencial.Application.Contracts;

public interface ITransactionRepository
{
    void AddPerson(Person person);
    void AddCategory(Category category);
    void AddTransaction(Transaction transaction);
    Task<(IEnumerable<Person>, PaginationMetadata)> GetAllPersonsAsync(int pageNumber, int pageSize);
    Task<(IEnumerable<PersonFinancialSummaryDto> Persons, PersonsFinancialSummaryTotalDto Totals, PaginationMetadata PaginationMetadata)> GetPersonsFinancialSummaryAsync(int pageNumber, int pageSize);
    Task<(IEnumerable<Category>, PaginationMetadata)> GetAllCategoriesAsync(int pageNumber, int pageSize);
    Task<(IEnumerable<Transaction>, PaginationMetadata)> GetAllTransactionsAsync(int pageNumber, int pageSize);
    Task<bool> PersonExistsAsync(Guid id);
    Task<Person?> GetPersonByIdAsync(Guid id);
    Task<Category?> GetCategoryByIdAsync(Guid id);
    Task<bool> DeletePersonAndTransactionsAsync(Guid personId);
    void UpdatePerson(Person person);

    Task<bool> SaveChangesAsync();
}