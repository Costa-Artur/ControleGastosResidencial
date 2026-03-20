using MediatR;

namespace GerenciadorFinanceiroResidencial.Application.Features.Persons.Commands.DeletePerson;

public class DeletePersonCommand : IRequest<DeletePersonCommandResponse>
{
    public Guid PersonId { get; set; }
}

