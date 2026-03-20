using System.Text.Json;
using AutoMapper;
using GerenciadorFinanceiroResidencial.Application.Features.Transactions.Features.CreateTransaction;
using GerenciadorFinanceiroResidencial.Application.Features.Transactions.Queries.GetTransactionsDetail;
using GerenciadorFinanceiroResidencial.Application.Models;
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

    /// <summary>
    /// Cria uma nova transação.
    /// </summary>
    /// <param name="transactionForCreationDto">Dados da transação a ser criada.</param>
    /// <returns>Transação criada com sucesso.</returns>
    /// <response code="201">Transação criada.</response>
    /// <response code="422">Erro de validação nos dados enviados.</response>
    [HttpPost]
    public async Task<ActionResult<CreateTransactionDto>> CreateTransaction(
        [FromBody] TransactionForCreationDto transactionForCreationDto
        )
    {
        var createTransactionCommand = mapper.Map<CreateTransactionCommand>(transactionForCreationDto);
        
        var createTransactionCommandResponse = await mediator.Send(createTransactionCommand);

        if (!createTransactionCommandResponse.IsSuccess)
        {
            ConfigureModelState(createTransactionCommandResponse.Errors);
            return CheckStatusCode(createTransactionCommandResponse);
        }

        return Created(
            $"/api/transactions/{createTransactionCommandResponse.Transaction.Id}",
            createTransactionCommandResponse.Transaction);
    }
    
}