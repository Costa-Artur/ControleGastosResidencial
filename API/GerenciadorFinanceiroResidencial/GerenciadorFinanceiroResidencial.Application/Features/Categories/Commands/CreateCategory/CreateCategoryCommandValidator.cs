using FluentValidation;
using GerenciadorFinanceiroResidencial.Domain.Enums;

namespace GerenciadorFinanceiroResidencial.Application.Features.Categories.Commands.CreateCategory;

public class CreateCategoryCommandValidator : AbstractValidator<CreateCategoryCommand>
{
    public CreateCategoryCommandValidator()
    {
        RuleFor(c => c.Description)
            .MaximumLength(400)
            .WithMessage("Descrição não pode exceder 400 caracteres.")
            .NotEmpty()
            .WithMessage("Descrição deve ser preenchida.");

        RuleFor(c => c.Purpose)
            .NotEmpty()
            .WithMessage("Finalidade deve ser preenchida.")
            //Verifica se está incluido no enum
            .Must(value => Enum.TryParse<CategoryType>(value, true, out var parsed)
                           && Enum.IsDefined(parsed))
            .WithMessage(c => $"'{c.Purpose}' não está no enum {nameof(CategoryType)}.");
    }
}