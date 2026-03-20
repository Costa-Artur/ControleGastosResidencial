using AutoMapper;
using GerenciadorFinanceiroResidencial.Application.Features.Categories.Commands.CreateCategory;
using GerenciadorFinanceiroResidencial.Application.Features.Categories.Queries.GetCategoriesDetails;
using GerenciadorFinanceiroResidencial.Application.Models;
using GerenciadorFinanceiroResidencial.Domain.Entities;

namespace GerenciadorFinanceiroResidencial.Application.Profiles;

public class CategoryProfile : Profile
{
    public CategoryProfile()
    {
        CreateMap<Category, CategoryDto>();
        CreateMap<Category, CreateCategoryDto>();
        CreateMap<Category, GetCategoriesDetailDto>();
        CreateMap<CreateCategoryCommand, Category>().ReverseMap();
        CreateMap<CategoryForCreationDto, CreateCategoryCommand>();
    }
}