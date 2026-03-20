using System.Text.Json;
using AutoMapper;
using GerenciadorFinanceiroResidencial.Application.Features.Persons.Commands;
using GerenciadorFinanceiroResidencial.Application.Features.Persons.Commands.UpdatePerson;
using GerenciadorFinanceiroResidencial.Application.Features.Persons.Queries.GetPersonsDetail;
using GerenciadorFinanceiroResidencial.Application.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace GerenciadorFinanceiroResidencial.Controllers;

[Route("api/persons")]
public class PersonController(IMapper mapper, IMediator mediator) : MainController
{
    /// <summary>
    /// Lista todas as pessoas.
    /// </summary>
    /// <param name="pageNumber">Número da página a ser buscada.</param>
    /// <param name="pageSize">Tamanho da página a ser buscada.</param>
    /// <response code="200">Retorna todas as pessoas.</response>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<GetPersonsDetailDto>>> GetAllPersons(int pageNumber = 1, int pageSize = 10)
    {
        //Limita paginação
        if(pageSize > maxPageSize) pageSize = maxPageSize;
        
        var getPersonsDetailQuery = new GetPersonsDetailQuery { PageNumber = pageNumber, PageSize = pageSize };
        
        var personsResponse = await mediator.Send(getPersonsDetailQuery);
        //Retorna erros
        if (!personsResponse.IsSuccess)
        {
            return CheckStatusCode(personsResponse);
        }
        
        //Adiciona paginção aos headers
        Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(personsResponse.paginationMetadata));
        
        return Ok(personsResponse.Persons);
    }
    
    /// <summary>
    /// Cria uma nova pessoa.
    /// </summary>
    /// <param name="personForCreationDto">Dados da pessoa a ser criada.</param>
    /// <returns>Categoria criada com sucesso.</returns>
    /// <response code="201">Pessoa criada.</response>
    /// <response code="422">Erro de validação nos dados enviados.</response>
    [HttpPost]
    public async Task<ActionResult<PersonDto>> CreatePerson(
        [FromBody] PersonForCreationDto personForCreationDto
    )
    {
        //Cria o command
        var createPersonCommand = mapper.Map<CreatePersonCommand>(personForCreationDto);
        
        //Aguarda a resposta
        var createPersonCommandResponse = await mediator.Send(createPersonCommand);
        
        //Preenche erros e retorna
        if (!createPersonCommandResponse.IsSuccess)
        {
            ConfigureModelState(createPersonCommandResponse.Errors);
            return ValidationProblem(ModelState);
        }

        //Retorna Created caso não haja erros
        return Created(
            $"/api/persons/{createPersonCommandResponse.Person.Id}",
            createPersonCommandResponse.Person);
    }
    /// <summary>
    /// Atualiza uma pessoa do banco.
    /// </summary>
    /// <param name="personForUpdateDto">Dados da pessoa a ser atualizada.</param>
    /// <returns>Pessoa atualizada com sucesso.</returns>
    /// <response code="204">Pessoa atualizada.</response>
    /// <response code="422">Erro de validação nos dados enviados.</response>
    [HttpPut("{personId}")]
    public async Task<ActionResult> UpdatePerson(Guid personId, [FromBody] PersonForUpdateDto personForUpdateDto)
    {
        var updatePersonCommand = mapper.Map<UpdatePersonCommand>(personForUpdateDto);
        
        var updatePersonCommandResponse = await mediator.Send(updatePersonCommand);
        
        if(!updatePersonCommandResponse.IsSuccess)
        {
            return CheckStatusCode(updatePersonCommandResponse);
        }
        
        return NoContent();
    }
}