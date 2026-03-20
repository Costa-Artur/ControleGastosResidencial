using AutoMapper;
using GerenciadorFinanceiroResidencial.Application.Features.Transactions.Queries.GetTransactionsDetail;
using GerenciadorFinanceiroResidencial.Domain.Entities;

namespace GerenciadorFinanceiroResidencial.Application.Profiles;

public class TransactionProfile : Profile
{
    public TransactionProfile()
    {
        CreateMap<Transaction, GetTransactionsDetailDto>();
    }
}