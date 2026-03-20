using AutoMapper;
using GerenciadorFinanceiroResidencial.Application.Contracts;
using MediatR;

namespace GerenciadorFinanceiroResidencial.Application.Features.Categories.Queries.GetCategoriesDetails;

public class GetCategoriesDetailQueryHandler(ITransactionRepository transactionRepository, IMapper mapper)
    : IRequestHandler<GetCategoriesDetailQuery, GetCategoriesDetailResponse>
{
    public async Task<GetCategoriesDetailResponse> Handle(GetCategoriesDetailQuery request, 
        CancellationToken cancellationToken)
    {
        GetCategoriesDetailResponse getCategoriesDetailResponse = new();
        
        var (categoriesFromDatabase, paginationMetadata) = await transactionRepository.GetAllCategoriesAsync(request.PageNumber, request.PageSize);

        getCategoriesDetailResponse.Categories = mapper.Map<List<GetCategoriesDetailDto>>(categoriesFromDatabase);
        getCategoriesDetailResponse.paginationMetadata = paginationMetadata;
        
        return getCategoriesDetailResponse;
    }
}