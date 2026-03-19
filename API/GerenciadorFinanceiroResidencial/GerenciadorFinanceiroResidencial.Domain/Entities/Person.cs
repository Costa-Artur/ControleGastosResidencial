namespace GerenciadorFinanceiroResidencial.Domain.Entities;

public class Person
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public string Name { get; set; } =  string.Empty;
    public int Age { get; set; }
}