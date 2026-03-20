using GerenciadorFinanceiroResidencial.Domain.Enums;

namespace GerenciadorFinanceiroResidencial.Application.Features.Categories.Commands.CreateCategory;

public class CreateCategoryDto
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public string Description { get; set; } =  string.Empty;
    public CategoryType Purpose { get; set; }
}