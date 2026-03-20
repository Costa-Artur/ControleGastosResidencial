using GerenciadorFinanceiroResidencial.Application.Features.Common;

namespace GerenciadorFinanceiroResidencial.Application.Features.Transactions.Queries.GetTransactionsDetail;

public class GetTransactionsDetailResponse : BaseResponse
{
    public IEnumerable<GetTransactionsDetailDto> Transactions { get; set; } = new List<GetTransactionsDetailDto>();
    public PaginationMetadata paginationMetadata = null!;
}