using FluentValidation;
using GerenciadorFinanceiroResidencial.Domain.Enums;
using GerenciadorFinanceiroResidencial.Application.Contracts;

namespace GerenciadorFinanceiroResidencial.Application.Features.Transactions.Features.CreateTransaction;

public class CreateTransactionCommandValidator : AbstractValidator<CreateTransactionCommand>
{
    private readonly ITransactionRepository _transactionRepository;

    public CreateTransactionCommandValidator(ITransactionRepository transactionRepository)
    {
        _transactionRepository = transactionRepository;

        RuleFor(x => x.Description)
            .NotEmpty()
            .WithMessage("Descrição deve ser preenchida")
            .MaximumLength(400)
            .WithMessage("Descrição deve conter no máximo 400 caracteres");
        
        RuleFor(x => x.Amount)
            .NotEmpty()
            .WithMessage("Valor deve ser preenchido")
            .GreaterThan(0)
            .WithMessage("Valor deve ser maior que 0");
        
        RuleFor(x => x.TransactionType)
            .NotEmpty()
            .WithMessage("Finalidade deve ser preenchida.")
            .Must(value => Enum.TryParse<TransactionType>(value, true, out var parsed)
                           && Enum.IsDefined(parsed))
            .WithMessage(x => $"'{x.TransactionType}' não está no enum {nameof(TransactionType)}.");

        RuleFor(x => x.CategoryId)
            .NotEmpty()
            .WithMessage("Categoria deve ser preenchida.")
            .MustAsync(CategoryExists)
            .WithMessage("Categoria não encontrada.")
            .MustAsync(CategoryMatchesTransactionType)
            .WithMessage("A categoria selecionada não é compatível com o tipo de transação.");
        
        RuleFor(x => x.PersonId)
            .NotEmpty()
            .WithMessage("Pessoa deve ser preenchida.")
            .MustAsync(PersonExists)
            .WithMessage("Pessoa não encontrada.");

        RuleFor(x => x)
            .MustAsync(MinorCanOnlyCreateExpense)
            .WithMessage("Para menor de idade, apenas transações do tipo Despesa são permitidas.");
    }

    private async Task<bool> CategoryExists(Guid categoryId, CancellationToken cancellationToken)
    {
        if (categoryId == Guid.Empty)
            return false;

        var category = await _transactionRepository.GetCategoryByIdAsync(categoryId);
        return category != null;
    }

    private async Task<bool> PersonExists(Guid personId, CancellationToken cancellationToken)
    {
        if (personId == Guid.Empty)
            return false;
        
        var person = await _transactionRepository.GetPersonByIdAsync(personId);
        return person != null;
    }

    private async Task<bool> CategoryMatchesTransactionType(
        CreateTransactionCommand command, 
        Guid categoryId, 
        CancellationToken cancellationToken)
    {
        if (categoryId == Guid.Empty || string.IsNullOrEmpty(command.TransactionType))
            return false;

        var category = await _transactionRepository.GetCategoryByIdAsync(categoryId);
        if (category == null)
            return false;

        if (!Enum.TryParse<TransactionType>(command.TransactionType, true, out var transactionType))
            return false;

        // Receita (Income) = 1, Despesa (Expense) = 2, Ambas (Both) = 3
        return transactionType switch
        {
            TransactionType.Receita => 
                category.Purpose == CategoryType.Receita || category.Purpose == CategoryType.Ambas,
            TransactionType.Despesa => 
                category.Purpose == CategoryType.Despesa || category.Purpose == CategoryType.Ambas,
            _ => false
        };
        
    }

    private async Task<bool> MinorCanOnlyCreateExpense(
        CreateTransactionCommand command,
        CancellationToken cancellationToken)
    {
        if (command.PersonId == Guid.Empty || string.IsNullOrWhiteSpace(command.TransactionType))
            return true;

        if (!Enum.TryParse<TransactionType>(command.TransactionType, true, out var transactionType))
            return true;

        var person = await _transactionRepository.GetPersonByIdAsync(command.PersonId);
        if (person == null)
            return true;

        if (person.Age >= 18)
            return true;

        return transactionType == TransactionType.Despesa;
    }
}