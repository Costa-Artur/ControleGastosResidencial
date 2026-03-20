using GerenciadorFinanceiroResidencial.Domain.Enums;

namespace GerenciadorFinanceiroResidencial.Application.Features.Categories.Queries.GetCategoriesDetails;

public class GetCategoriesDetailDto
{
    public Guid Id { get; set; }
    public string Description { get; set; } =  string.Empty;
    public CategoryType Purpose { get; set; }
}