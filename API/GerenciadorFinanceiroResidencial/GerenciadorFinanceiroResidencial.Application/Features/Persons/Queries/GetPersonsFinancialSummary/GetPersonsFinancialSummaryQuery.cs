using MediatR;

namespace GerenciadorFinanceiroResidencial.Application.Features.Persons.Queries.GetPersonsFinancialSummary;

public class GetPersonsFinancialSummaryQuery : IRequest<GetPersonsFinancialSummaryResponse>
{
	public int PageNumber { get; set; }
	public int PageSize { get; set; }
}


