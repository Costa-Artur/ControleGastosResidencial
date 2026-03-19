using FluentValidation;

namespace GerenciadorFinanceiroResidencial.Application.Features.Persons.Commands.UpdatePerson;

public class UpdatePersonCommandValidator : AbstractValidator<UpdatePersonCommand>
{
    public UpdatePersonCommandValidator()
    {
        RuleFor(p => p.Id)
            .NotEmpty()
            .WithMessage("É necessário preencher um Id");
    }
}