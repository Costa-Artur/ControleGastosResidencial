namespace GerenciadorFinanceiroResidencial.Application.Features.Persons.Queries.GetPersonsFinancialSummary;

public class PersonsFinancialSummaryDto
{
    public IEnumerable<PersonFinancialSummaryDto> Persons { get; set; } = new List<PersonFinancialSummaryDto>();
    public PersonsFinancialSummaryTotalDto Totals { get; set; } = new();
}

