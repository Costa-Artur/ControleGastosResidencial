using FluentValidation;
using GerenciadorFinanceiroResidencial.Application.Features.Categories.Commands.CreateCategory;
using GerenciadorFinanceiroResidencial.Application.Features.Persons.Commands;
using GerenciadorFinanceiroResidencial.Application.Features.Persons.Commands.UpdatePerson;

namespace GerenciadorFinanceiroResidencial.Extensions;

internal static class StartupHelperExtensions
{
    public static void AddFluentValidationServices(this WebApplicationBuilder builder)
    {
        builder.Services.AddScoped<IValidator<CreatePersonCommand>, CreatePersonCommandValidator>();
        builder.Services.AddScoped<IValidator<UpdatePersonCommand>, UpdatePersonCommandValidator>();
        builder.Services.AddScoped<IValidator<CreateCategoryCommand>, CreateCategoryCommandValidator>();
    }
}