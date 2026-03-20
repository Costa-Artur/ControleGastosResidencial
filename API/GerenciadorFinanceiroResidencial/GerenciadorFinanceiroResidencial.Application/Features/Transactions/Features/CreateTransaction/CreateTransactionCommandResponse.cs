using GerenciadorFinanceiroResidencial.Application.Features.Common;

namespace GerenciadorFinanceiroResidencial.Application.Features.Transactions.Features.CreateTransaction;

public class CreateTransactionCommandResponse : BaseResponse
{
    public CreateTransactionDto Transaction { get; set; } = null!;
}