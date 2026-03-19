using AutoMapper;
using FluentValidation;
using GerenciadorFinanceiroResidencial.Application.Contracts;
using GerenciadorFinanceiroResidencial.Domain.Entities;
using MediatR;

namespace GerenciadorFinanceiroResidencial.Application.Features.Persons.Commands;

public class CreatePersonCommandHandler(
    ITransactionRepository transactionRepository,
    IMapper mapper,
    IValidator<CreatePersonCommand> validator)
    : IRequestHandler<CreatePersonCommand, CreatePersonCommandResponse>
{
    public async Task<CreatePersonCommandResponse> Handle(CreatePersonCommand request,
        CancellationToken cancellationToken)
    {
        CreatePersonCommandResponse createPersonCommandResponse = new();
        var validationResult = validator.Validate(request);

        if (!validationResult.IsValid)
        {
            createPersonCommandResponse.FillErrors(validationResult);
            return createPersonCommandResponse;
        }
        
        var personEntity = mapper.Map<Person>(request);
        
        transactionRepository.AddPerson(personEntity);
        await transactionRepository.SaveChangesAsync();
        
        createPersonCommandResponse.Person = mapper.Map<CreatePersonDto>(personEntity);
        return createPersonCommandResponse;
    }
}