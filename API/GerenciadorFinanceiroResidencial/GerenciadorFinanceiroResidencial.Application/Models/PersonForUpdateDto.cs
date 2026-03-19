namespace GerenciadorFinanceiroResidencial.Application.Models;

public class PersonForUpdateDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Age { get; set; }
}