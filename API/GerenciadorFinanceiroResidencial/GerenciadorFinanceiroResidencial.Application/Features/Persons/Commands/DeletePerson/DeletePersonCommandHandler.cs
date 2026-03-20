using FluentValidation;
using GerenciadorFinanceiroResidencial.Application.Contracts;
using GerenciadorFinanceiroResidencial.Application.Features.Common;
using MediatR;

namespace GerenciadorFinanceiroResidencial.Application.Features.Persons.Commands.DeletePerson;

public class DeletePersonCommandHandler(
    ITransactionRepository repository,
    IValidator<DeletePersonCommand> validator)
    : IRequestHandler<DeletePersonCommand, DeletePersonCommandResponse>
{
    public async Task<DeletePersonCommandResponse> Handle(DeletePersonCommand request,
        CancellationToken cancellationToken)
    {
        var response = new DeletePersonCommandResponse();

        var validationResult = await validator.ValidateAsync(request, cancellationToken);

        if (!validationResult.IsValid)
        {
            response.FillErrors(validationResult);
            response.ErrorType = Error.ValidationProblem;
            return response;
        }

        var deleted = await repository.DeletePersonAndTransactionsAsync(request.PersonId);

        if (!deleted)
        {
            response.ErrorType = Error.NotFoundProblem;
            response.Errors.Add("Person", ["Pessoa não encontrada"]);
            return response;
        }

        return response;
    }
}

