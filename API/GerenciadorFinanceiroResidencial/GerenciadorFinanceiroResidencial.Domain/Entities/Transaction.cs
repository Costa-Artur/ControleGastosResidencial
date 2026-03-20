using GerenciadorFinanceiroResidencial.Domain.Enums;

namespace GerenciadorFinanceiroResidencial.Domain.Entities;

public class Transaction
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public TransactionType TransactionType { get; set; }
    public Guid CategoryId { get; set; }
    public Category Category { get; set; } = null!;
    public Guid PersonId { get; set; }
    public Person Person { get; set; } = null!;
}