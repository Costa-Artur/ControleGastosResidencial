using GerenciadorFinanceiroResidencial.Domain.Enums;

namespace GerenciadorFinanceiroResidencial.Application.Models;

public class CategoryDto
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public string Description { get; set; } =  string.Empty;
    public CategoryType Purpose { get; set; }
}