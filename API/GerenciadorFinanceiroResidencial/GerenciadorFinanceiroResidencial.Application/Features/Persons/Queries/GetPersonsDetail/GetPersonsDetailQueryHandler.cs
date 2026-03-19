using AutoMapper;
using GerenciadorFinanceiroResidencial.Application.Contracts;
using MediatR;

namespace GerenciadorFinanceiroResidencial.Application.Features.Persons.Queries.GetPersonsDetail;

public class GetPersonsDetailQueryHandler(ITransactionRepository transactionRepository, IMapper mapper) : IRequestHandler<GetPersonsDetailQuery, GetPersonsDetailResponse>
{
    public async Task<GetPersonsDetailResponse> Handle(GetPersonsDetailQuery request,
        CancellationToken cancellationToken)
    {
        GetPersonsDetailResponse getPersonsDetailResponse = new ();
        
        var (personsFromDatabase, paginationMetadata) = await transactionRepository.GetAllPersonsAsync(request.PageNumber, request.PageSize);

        getPersonsDetailResponse.Persons = mapper.Map<List<GetPersonsDetailDto>>(personsFromDatabase);
        getPersonsDetailResponse.paginationMetadata = paginationMetadata;
        
        return getPersonsDetailResponse;
    }
}