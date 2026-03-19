using GerenciadorFinanceiroResidencial.Application.Features.Common;
using GerenciadorFinanceiroResidencial.Application.Features.Persons.Queries.GetPersonsDetail;
using GerenciadorFinanceiroResidencial.Domain.Entities;

namespace GerenciadorFinanceiroResidencial.Application.Contracts;

public interface ITransactionRepository
{
    void AddPerson(Person person);
    Task<(IEnumerable<Person>, PaginationMetadata)> GetAllPersonsAsync(int pageNumber, int pageSize);
    Task<bool> PersonExistsAsync(Guid id);
    Task<Person?> GetPersonByIdAsync(Guid id);

    Task<bool> SaveChangesAsync();
}