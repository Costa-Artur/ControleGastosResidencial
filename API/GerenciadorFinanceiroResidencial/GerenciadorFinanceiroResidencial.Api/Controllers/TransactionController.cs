using System.Text.Json;
using AutoMapper;
using GerenciadorFinanceiroResidencial.Application.Features.Transactions.Queries.GetTransactionsDetail;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace GerenciadorFinanceiroResidencial.Controllers;

[Route("api/transactions")]
public class TransactionController(IMapper mapper, IMediator mediator) : MainController
{
    /// <summary>
    /// Lista todas as transações.
    /// </summary>
    /// <param name="pageNumber">Número da página a ser buscada.</param>
    /// <param name="pageSize">Tamanho da página a ser buscada.</param>
    /// <response code="200">Retorna todas as transações.</response>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<GetTransactionsDetailDto>>> GetAllTransactions(int pageNumber = 1,
        int pageSize = 10)
    {
        //Limita paginação
        if (pageSize > maxPageSize) pageSize = maxPageSize;
        
        var getTransactionsDetailQuery = new GetTransactionsDetailQuery() { PageNumber = pageNumber, PageSize = pageSize };
        
        var transactionsResponse = await mediator.Send(getTransactionsDetailQuery);
        
        //Retorna erros
        if(!transactionsResponse.IsSuccess)
        {
            return CheckStatusCode(transactionsResponse);
        }
        
        //Adiciona paginção aos headers
        Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(transactionsResponse.paginationMetadata));

        return Ok(transactionsResponse.Transactions);
    }
}