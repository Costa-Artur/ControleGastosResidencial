using AutoMapper;
using FluentValidation;
using FluentValidation.Results;
using GerenciadorFinanceiroResidencial.Application.Contracts;
using GerenciadorFinanceiroResidencial.Application.Features.Common;
using MediatR;

namespace GerenciadorFinanceiroResidencial.Application.Features.Persons.Commands.UpdatePerson;

public class UpdatePersonCommandHandler(ITransactionRepository repository, IMapper mapper, IValidator<UpdatePersonCommand> validator) 
    : IRequestHandler<UpdatePersonCommand, UpdatePersonCommandResponse>
{
    public async Task<UpdatePersonCommandResponse> Handle(UpdatePersonCommand request,
        CancellationToken cancellationToken)
    {
        UpdatePersonCommandResponse response = new();
        ValidationResult validationResult = await validator.ValidateAsync(request, cancellationToken);
        
        if(!validationResult.IsValid)
        {
            response.FillErrors(validationResult);
            response.ErrorType = Error.ValidationProblem;
            return response;
        }

        if (!await repository.PersonExistsAsync(request.Id))
        {
            response.ErrorType = Error.NotFoundProblem;
            response.Errors.Add("Person", new string[] {"Pessoa nâo encontrada"});
            return response;
        }
        
        var personEntity = await repository.GetPersonByIdAsync(request.Id);

        if (personEntity == null)
        {
            response.ErrorType = Error.NotFoundProblem;
            response.Errors.Add("Person", new string[] {"Pessoa nâo encontrada"});
            return response;
        }
        
        mapper.Map(request, personEntity);
        return response;
    }
}