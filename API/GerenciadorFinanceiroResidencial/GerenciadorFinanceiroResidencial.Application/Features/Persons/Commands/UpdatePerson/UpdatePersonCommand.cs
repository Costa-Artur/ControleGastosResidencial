using MediatR;

namespace GerenciadorFinanceiroResidencial.Application.Features.Persons.Commands.UpdatePerson;

public class UpdatePersonCommand : IRequest<UpdatePersonCommandResponse>
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Age { get; set; }
}