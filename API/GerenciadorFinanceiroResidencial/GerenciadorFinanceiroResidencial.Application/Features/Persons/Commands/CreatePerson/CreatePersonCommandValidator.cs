using FluentValidation;

namespace GerenciadorFinanceiroResidencial.Application.Features.Persons.Commands;

public class CreatePersonCommandValidator : AbstractValidator<CreatePersonCommand>
{
    public  CreatePersonCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("O nome é obrigatório.")
            .MaximumLength(200)
            .WithMessage("O nome deve ter no máximo 200 caracteres.");
        
        RuleFor(x => x.Age)
            .NotEmpty()
            .WithMessage("A idade é obrigatória.")
            .GreaterThan(0)
            .WithMessage("A idade deve ser maior que zero.");
    }
}