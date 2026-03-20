using GerenciadorFinanceiroResidencial.Application.Contracts;
using MediatR;

namespace GerenciadorFinanceiroResidencial.Application.Features.Persons.Queries.GetPersonsFinancialSummary;

public class GetPersonsFinancialSummaryQueryHandler(ITransactionRepository transactionRepository)
    : IRequestHandler<GetPersonsFinancialSummaryQuery, GetPersonsFinancialSummaryResponse>
{
    public async Task<GetPersonsFinancialSummaryResponse> Handle(GetPersonsFinancialSummaryQuery request,
        CancellationToken cancellationToken)
    {
        var response = new GetPersonsFinancialSummaryResponse();

        var (persons, totals, paginationMetadata) = await transactionRepository
            .GetPersonsFinancialSummaryAsync(request.PageNumber, request.PageSize);

        response.Persons = persons;
        response.Totals = totals;
        response.PaginationMetadata = paginationMetadata;

        return response;
    }
}


