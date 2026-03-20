using GerenciadorFinanceiroResidencial.Application.Features.Common;

namespace GerenciadorFinanceiroResidencial.Application.Features.Persons.Queries.GetPersonsFinancialSummary;

public class GetPersonsFinancialSummaryResponse : BaseResponse
{
    public IEnumerable<PersonFinancialSummaryDto> Persons { get; set; } = new List<PersonFinancialSummaryDto>();
    public PersonsFinancialSummaryTotalDto Totals { get; set; } = new();
    public PaginationMetadata PaginationMetadata { get; set; } = null!;
}


