using System.Text.Json;
using AutoMapper;
using GerenciadorFinanceiroResidencial.Application.Features.Persons.Commands;
using GerenciadorFinanceiroResidencial.Application.Features.Persons.Queries.GetPersonsDetail;
using GerenciadorFinanceiroResidencial.Application.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace GerenciadorFinanceiroResidencial.Controllers;

[Route("api/persons")]
public class PersonController(IMapper mapper, IMediator mediator) : MainController
{
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<GetPersonsDetailDto>>> GetAllPersons(int pageNumber = 1, int pageSize = 10)
    {
        if(pageSize > maxPageSize) pageSize = maxPageSize;
        
        var getPersonsDetailQuery = new GetPersonsDetailQuery { PageNumber = pageNumber, PageSize = pageSize };
        
        var personsResponse = await mediator.Send(getPersonsDetailQuery);

        if (!personsResponse.IsSuccess)
        {
            return CheckStatusCode(personsResponse);
        }
        
        
        Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(personsResponse.paginationMetadata));
        
        return Ok(personsResponse.Persons);
    }

    [HttpPost]
    public async Task<ActionResult<PersonDto>> CreatePerson(
        [FromBody] PersonForCreationDto personForCreationDto
    )
    {
        var createPersonCommand = mapper.Map<CreatePersonCommand>(personForCreationDto);
        
        var createPersonCommandResponse = await mediator.Send(createPersonCommand);

        if (!createPersonCommandResponse.IsSuccess)
        {
            ConfigureModelState(createPersonCommandResponse.Errors);
            return ValidationProblem(ModelState);
        }

        return Created(
            $"/api/persons/{createPersonCommandResponse.Person.Id}",
            createPersonCommandResponse.Person);
    }
}