using FluentValidation;
using GerenciadorFinanceiroResidencial.Application.Features.Categories.Commands.CreateCategory;
using GerenciadorFinanceiroResidencial.Application.Features.Persons.Commands.DeletePerson;
using GerenciadorFinanceiroResidencial.Application.Features.Persons.Commands;
using GerenciadorFinanceiroResidencial.Application.Features.Persons.Commands.UpdatePerson;
using GerenciadorFinanceiroResidencial.Application.Features.Transactions.Features.CreateTransaction;

namespace GerenciadorFinanceiroResidencial.Extensions;

internal static class StartupHelperExtensions
{
    public static void AddFluentValidationServices(this WebApplicationBuilder builder)
    {
        builder.Services.AddScoped<IValidator<CreatePersonCommand>, CreatePersonCommandValidator>();
        builder.Services.AddScoped<IValidator<DeletePersonCommand>, DeletePersonCommandValidator>();
        builder.Services.AddScoped<IValidator<UpdatePersonCommand>, UpdatePersonCommandValidator>();
        builder.Services.AddScoped<IValidator<CreateCategoryCommand>, CreateCategoryCommandValidator>();
        builder.Services.AddScoped<IValidator<CreateTransactionCommand>, CreateTransactionCommandValidator>();
    }
}