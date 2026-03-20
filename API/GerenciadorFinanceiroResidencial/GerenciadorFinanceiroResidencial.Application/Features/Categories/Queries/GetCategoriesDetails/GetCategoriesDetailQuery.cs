using MediatR;

namespace GerenciadorFinanceiroResidencial.Application.Features.Categories.Queries.GetCategoriesDetails;

public class GetCategoriesDetailQuery: IRequest<GetCategoriesDetailResponse>
{
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
}