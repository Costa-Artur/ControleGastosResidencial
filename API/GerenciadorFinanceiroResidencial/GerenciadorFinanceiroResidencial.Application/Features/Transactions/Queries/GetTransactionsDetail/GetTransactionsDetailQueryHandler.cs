using AutoMapper;
using GerenciadorFinanceiroResidencial.Application.Contracts;
using MediatR;

namespace GerenciadorFinanceiroResidencial.Application.Features.Transactions.Queries.GetTransactionsDetail;

public class GetTransactionsDetailQueryHandler(ITransactionRepository transactionRepository, IMapper mapper)
: IRequestHandler<GetTransactionsDetailQuery, GetTransactionsDetailResponse>
{
    public async Task<GetTransactionsDetailResponse> Handle(GetTransactionsDetailQuery request,
        CancellationToken cancellationToken)
    {
        GetTransactionsDetailResponse getTransactionsDetailResponse = new();
        
        var (transactionsFromDatabase, paginationMetadata) = await transactionRepository
            .GetAllTransactionsAsync(request.PageNumber, request.PageSize);

        getTransactionsDetailResponse.Transactions = mapper.Map<List<GetTransactionsDetailDto>>(transactionsFromDatabase);
        getTransactionsDetailResponse.paginationMetadata = paginationMetadata;

        return getTransactionsDetailResponse;
    }
}