using MediatR;

namespace GerenciadorFinanceiroResidencial.Application.Features.Persons.Commands;

public class CreatePersonCommand : IRequest<CreatePersonCommandResponse>
{
    public string Name { get; set; } = string.Empty;
    public int Age { get; set; }
}