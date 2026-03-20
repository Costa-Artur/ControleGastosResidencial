namespace GerenciadorFinanceiroResidencial.Application.Models;

public class TransactionForCreationDto
{
    public string Description { get; set; } =  string.Empty;
    public decimal Amount { get; set; }
    public string TransactionType { get; set; } =  string.Empty;
    public Guid CategoryId { get; set; } = Guid.Empty;
    public Guid PersonId { get; set; } = Guid.Empty;
}