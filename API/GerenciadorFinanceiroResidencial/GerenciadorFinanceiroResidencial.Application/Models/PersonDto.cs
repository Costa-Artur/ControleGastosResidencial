namespace GerenciadorFinanceiroResidencial.Application.Models;

public class PersonDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Age { get; set; }
}