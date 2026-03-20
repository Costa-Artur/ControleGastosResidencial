using FluentValidation;

namespace GerenciadorFinanceiroResidencial.Application.Features.Persons.Commands.UpdatePerson;

public class UpdatePersonCommandValidator : AbstractValidator<UpdatePersonCommand>
{
    public UpdatePersonCommandValidator()
    {
        RuleFor(p => p.Id)
            .NotEmpty()
            .WithMessage("É necessário preencher um Id");
        
        RuleFor(p => p.Name)
            .MaximumLength(200)
            .WithMessage("O nome deve conter no máximo 200 caracteres");
        
        RuleFor(p => p.Age)
            .GreaterThan(0)
            .WithMessage("A idade deve ser maior que 0");
    }
}