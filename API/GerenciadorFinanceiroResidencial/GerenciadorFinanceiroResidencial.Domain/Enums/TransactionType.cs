namespace GerenciadorFinanceiroResidencial.Domain.Enums;

public enum TransactionType
{
    Receita = 1,
    Despesa = 2,
    
    Income = Receita,
    Expense = Despesa,
}