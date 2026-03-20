using GerenciadorFinanceiroResidencial.Application.Features.Common;

namespace GerenciadorFinanceiroResidencial.Application.Features.Categories.Queries.GetCategoriesDetails;

public class GetCategoriesDetailResponse : BaseResponse
{
    public IEnumerable<GetCategoriesDetailDto> Categories { get; set; } = new  List<GetCategoriesDetailDto>();
    public PaginationMetadata paginationMetadata = null!;
}