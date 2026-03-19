using FluentValidation;
using GerenciadorFinanceiroResidencial.Application.Features.Persons.Commands;

namespace GerenciadorFinanceiroResidencial.Extensions;

internal static class StartupHelperExtensions
{
    public static void AddFluentValidationServices(this WebApplicationBuilder builder)
    {
        builder.Services.AddScoped<IValidator<CreatePersonCommand>, CreatePersonCommandValidator>();
    }
}