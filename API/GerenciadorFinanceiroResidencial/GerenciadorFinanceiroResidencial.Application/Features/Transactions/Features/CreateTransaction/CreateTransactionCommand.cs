using GerenciadorFinanceiroResidencial.Application.Features.Categories.Commands.CreateCategory;
using MediatR;

namespace GerenciadorFinanceiroResidencial.Application.Features.Transactions.Features.CreateTransaction;

public class CreateTransactionCommand : IRequest<CreateTransactionCommandResponse>
{
    public string Description { get; set; } =  string.Empty;
    public decimal Amount { get; set; }
    public string TransactionType { get; set; } =  string.Empty;
    public Guid CategoryId { get; set; } = Guid.Empty;
    public Guid PersonId { get; set; } = Guid.Empty;
}