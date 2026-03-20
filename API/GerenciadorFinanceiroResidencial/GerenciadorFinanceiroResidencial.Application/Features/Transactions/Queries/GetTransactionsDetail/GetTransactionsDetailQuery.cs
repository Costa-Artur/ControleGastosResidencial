using MediatR;

namespace GerenciadorFinanceiroResidencial.Application.Features.Transactions.Queries.GetTransactionsDetail;

public class GetTransactionsDetailQuery : IRequest<GetTransactionsDetailResponse>
{
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
}