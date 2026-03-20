using AutoMapper;
using GerenciadorFinanceiroResidencial.Application.Features.Transactions.Features.CreateTransaction;
using GerenciadorFinanceiroResidencial.Application.Features.Transactions.Queries.GetTransactionsDetail;
using GerenciadorFinanceiroResidencial.Application.Models;
using GerenciadorFinanceiroResidencial.Domain.Entities;

namespace GerenciadorFinanceiroResidencial.Application.Profiles;

public class TransactionProfile : Profile
{
    public TransactionProfile()
    {
        CreateMap<Transaction, GetTransactionsDetailDto>();
        CreateMap<CreateTransactionCommand, Transaction>().ReverseMap();
        CreateMap<CreateTransactionCommand, Transaction>().ReverseMap();
        CreateMap<TransactionForCreationDto, CreateTransactionCommand>();
        CreateMap<Transaction, CreateTransactionDto>();
        
    }
}