using GerenciadorFinanceiroResidencial.Domain.Entities;
using GerenciadorFinanceiroResidencial.Domain.Enums;

namespace GerenciadorFinanceiroResidencial.Application.Features.Transactions.Features.CreateTransaction;

public class CreateTransactionDto
{
    public Guid Id { get; set; }
    public string Description { get; set; } =  string.Empty;
    public decimal Amount { get; set; }
    public TransactionType TransactionType { get; set; }
    public Guid CategoryId { get; set; }
    public Guid PersonId { get; set; }
}