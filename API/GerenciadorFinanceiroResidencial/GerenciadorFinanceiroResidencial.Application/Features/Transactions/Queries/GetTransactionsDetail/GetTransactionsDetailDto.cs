using GerenciadorFinanceiroResidencial.Application.Models;
using GerenciadorFinanceiroResidencial.Domain.Enums;

namespace GerenciadorFinanceiroResidencial.Application.Features.Transactions.Queries.GetTransactionsDetail;

public class GetTransactionsDetailDto
{
    public Guid Id { get; set; }
    public string Description { get; set; } =  string.Empty;
    public decimal Amount { get; set; }
    public TransactionType TransactionType { get; set; }
    public CategoryDto Category { get; set; } = new();
    public PersonDto Person { get; set; } = new();
    
}