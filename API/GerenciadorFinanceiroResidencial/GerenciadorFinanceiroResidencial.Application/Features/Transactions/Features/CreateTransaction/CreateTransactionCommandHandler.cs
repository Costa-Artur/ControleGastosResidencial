using AutoMapper;
using FluentValidation;
using GerenciadorFinanceiroResidencial.Application.Contracts;
using GerenciadorFinanceiroResidencial.Application.Features.Common;
using GerenciadorFinanceiroResidencial.Domain.Entities;
using MediatR;

namespace GerenciadorFinanceiroResidencial.Application.Features.Transactions.Features.CreateTransaction;

public class CreateTransactionCommandHandler(
    ITransactionRepository transactionRepository,
    IMapper mapper,
    IValidator<CreateTransactionCommand> validator)
    : IRequestHandler<CreateTransactionCommand, CreateTransactionCommandResponse>
{
    public async Task<CreateTransactionCommandResponse> Handle(CreateTransactionCommand request,
        CancellationToken cancellationToken)
    {
        CreateTransactionCommandResponse createTransactionCommandResponse = new();
        var validationResult = await validator.ValidateAsync(request, cancellationToken);

        if (!validationResult.IsValid)
        {
            createTransactionCommandResponse.FillErrors(validationResult);
            createTransactionCommandResponse.ErrorType = Error.ValidationProblem;
            return createTransactionCommandResponse;
        }
        
        var transactionEntity = mapper.Map<Transaction>(request);

        transactionRepository.AddTransaction(transactionEntity);
        await transactionRepository.SaveChangesAsync();
        
        createTransactionCommandResponse.Transaction = mapper.Map<CreateTransactionDto>(transactionEntity);
        return createTransactionCommandResponse;
    }
    
}