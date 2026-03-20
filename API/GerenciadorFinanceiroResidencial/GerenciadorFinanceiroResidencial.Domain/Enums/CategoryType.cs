namespace GerenciadorFinanceiroResidencial.Domain.Enums;

public enum CategoryType
{
    Receita = 1,
    Despesa = 2,
    Ambas = 3,
    
    Income = Receita,
    Expense = Despesa,
    Both = Ambas,
}