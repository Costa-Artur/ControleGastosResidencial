using GerenciadorFinanceiroResidencial.Domain.Enums;
using MediatR;

namespace GerenciadorFinanceiroResidencial.Application.Features.Categories.Commands.CreateCategory;

public class CreateCategoryCommand : IRequest<CreateCategoryCommandResponse>
{
    public string Description { get; set; } =  string.Empty;
    public string Purpose { get; set; } =   string.Empty;
}