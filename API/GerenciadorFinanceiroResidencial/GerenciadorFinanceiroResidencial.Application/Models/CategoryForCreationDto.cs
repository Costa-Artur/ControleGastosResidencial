using GerenciadorFinanceiroResidencial.Domain.Enums;

namespace GerenciadorFinanceiroResidencial.Application.Models;

public class CategoryForCreationDto
{
    public string Description { get; set; } =  string.Empty;
    public string Purpose { get; set; } =  string.Empty;
}