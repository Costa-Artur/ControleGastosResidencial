using System.Text.Json;
using AutoMapper;
using GerenciadorFinanceiroResidencial.Application.Features.Categories.Commands.CreateCategory;
using GerenciadorFinanceiroResidencial.Application.Features.Categories.Queries.GetCategoriesDetails;
using GerenciadorFinanceiroResidencial.Application.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace GerenciadorFinanceiroResidencial.Controllers;

[Route("api/categories")]
public class CategoryController(IMapper mapper, IMediator mediator) : MainController
{
    /// <summary>
    /// Cria uma nova categoria.
    /// </summary>
    /// <param name="categoryforCreationDto">Dados da categoria a ser criada.</param>
    /// <returns>Categoria criada com sucesso.</returns>
    /// <response code="201">Categoria criada.</response>
    /// <response code="422">Erro de validação nos dados enviados.</response>
    [HttpPost]
    public async Task<ActionResult<CategoryDto>> CreateCategory(
        [FromBody] CategoryForCreationDto? categoryforCreationDto
    )
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        if (categoryforCreationDto is null)
        {
            ModelState.AddModelError("Category", "O corpo da requisição é obrigatório.");
            return ValidationProblem(ModelState);
        }

        //Cria o command
        var createCategoryCommand = mapper.Map<CreateCategoryCommand>(categoryforCreationDto);

        if (createCategoryCommand is null)
        {
            ModelState.AddModelError("Category", "Não foi possível mapear os dados da categoria.");
            return ValidationProblem(ModelState);
        }
        
        //Aguarda a resposta
        var createCategoryResponse = await mediator.Send(createCategoryCommand);
        
        //Preenche erros e retorna
        if (!createCategoryResponse.IsSuccess)
        {
            ConfigureModelState(createCategoryResponse.Errors);
            return ValidationProblem(ModelState);
        }
        
        //Retorna Created caso não haja erros
        return Created(
            $"/api/categories/{createCategoryResponse.Category.Id}",
            createCategoryResponse.Category);
    }
    
    /// <summary>
    /// Lista todas as categorias.
    /// </summary>
    /// <param name="pageNumber">Número da página a ser buscada.</param>
    /// <param name="pageSize">Tamanho da página a ser buscada.</param>
    /// <response code="200">Retorna todas as categorias.</response>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<GetCategoriesDetailDto>>> GetAllCategories(int pageNumber = 1,
        int pageSize = 10)
    {
        //Limita paginação
        if (pageSize > maxPageSize) pageSize = maxPageSize;
        
        var getCategoriesDetailQuery = new GetCategoriesDetailQuery() { PageNumber = pageNumber, PageSize = pageSize };
        
        var categoriesResponse = await mediator.Send(getCategoriesDetailQuery);
        
        //Retorna erros
        if(!categoriesResponse.IsSuccess)
        {
            return CheckStatusCode(categoriesResponse);
        }
        
        //Adiciona paginção aos headers
        Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(categoriesResponse.paginationMetadata));

        return Ok(categoriesResponse.Categories);
    }
}