using GerenciadorFinanceiroResidencial.Domain.Entities;
using GerenciadorFinanceiroResidencial.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;

namespace GerenciadorFinanceiroResidencial.Persistence.DbContexts;

public class TransactionContext(DbContextOptions<TransactionContext> options) : DbContext(options)
{
    public DbSet<Person> Persons { get; set; } = null!;
    public DbSet<Category> Categories { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.TransactionInitFluentApi();
        modelBuilder.TransactionContextSeedData();
        
        base.OnModelCreating(modelBuilder);
    }
}