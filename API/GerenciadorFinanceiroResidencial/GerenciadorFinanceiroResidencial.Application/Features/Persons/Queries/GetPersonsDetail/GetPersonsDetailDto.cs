namespace GerenciadorFinanceiroResidencial.Application.Features.Persons.Queries.GetPersonsDetail;

public class GetPersonsDetailDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Age { get; set; }
}