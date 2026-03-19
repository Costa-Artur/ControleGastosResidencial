using GerenciadorFinanceiroResidencial.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GerenciadorFinanceiroResidencial.Persistence.Extensions;

internal static class TransactionContextExtensions
{
    public static void TransactionInitFluentApi(this ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Person>(entity =>
        {
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Age).IsRequired();
        });
    }

    public static void TransactionContextSeedData(this ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Person>()
            .HasData(
                new Person()
                {
                    Id = Guid.NewGuid(),
                    Name = "John Doe",
                    Age = 20
                },
                new Person()
                {
                    Id = Guid.NewGuid(),
                    Name = "Jane Doe",
                    Age = 21
                }
            );
    }
}