using GerenciadorFinanceiroResidencial.Application.Features.Common;

namespace GerenciadorFinanceiroResidencial.Application.Features.Persons.Queries.GetPersonsDetail;

public class GetPersonsDetailResponse : BaseResponse
{
    public IEnumerable<GetPersonsDetailDto> Persons { get; set; } = new List<GetPersonsDetailDto>();
    public PaginationMetadata paginationMetadata = null!;
}