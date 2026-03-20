using FluentValidation;

namespace GerenciadorFinanceiroResidencial.Application.Features.Persons.Commands.DeletePerson;

public class DeletePersonCommandValidator : AbstractValidator<DeletePersonCommand>
{
    public DeletePersonCommandValidator()
    {
        RuleFor(p => p.PersonId)
            .NotEmpty()
            .WithMessage("É necessário preencher um Id");
    }
}

