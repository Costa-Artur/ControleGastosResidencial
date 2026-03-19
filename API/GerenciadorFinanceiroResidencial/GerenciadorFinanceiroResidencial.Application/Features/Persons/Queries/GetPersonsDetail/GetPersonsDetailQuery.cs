using MediatR;

namespace GerenciadorFinanceiroResidencial.Application.Features.Persons.Queries.GetPersonsDetail;

public class GetPersonsDetailQuery : IRequest<GetPersonsDetailResponse>
{
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
}