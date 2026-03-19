using GerenciadorFinanceiroResidencial.Application.Features.Common;

namespace GerenciadorFinanceiroResidencial.Application.Features.Persons.Commands;

public class CreatePersonCommandResponse : BaseResponse
{
    public CreatePersonDto Person { get; set; } = null!;
}