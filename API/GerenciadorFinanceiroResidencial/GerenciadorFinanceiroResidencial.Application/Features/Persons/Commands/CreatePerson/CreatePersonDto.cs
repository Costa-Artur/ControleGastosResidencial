namespace GerenciadorFinanceiroResidencial.Application.Features.Persons.Commands;

public class CreatePersonDto
{
    public Guid Id { get; init; }
    public string Name { get; set; } = string.Empty;
    public int Age { get; set; }
}