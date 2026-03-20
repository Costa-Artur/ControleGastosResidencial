using GerenciadorFinanceiroResidencial.Domain.Enums;

namespace GerenciadorFinanceiroResidencial.Domain.Entities;

public class Category
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public string Description { get; set; } =  string.Empty;
    public CategoryType Purpose { get; set; }
}