using GerenciadorFinanceiroResidencial.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GerenciadorFinanceiroResidencial.Persistence.Extensions;

internal static class TransactionContextExtensions
{
    private static readonly Guid JohnPersonId = Guid.Parse("d5f0f16c-5b4e-4902-a98f-c7df1db6f2d1");
    private static readonly Guid JanePersonId = Guid.Parse("0ce7f8c7-1ad7-4f70-a170-a2dd111f0c77");
    private static readonly Guid SalaryCategoryId = Guid.Parse("3f75cf24-63a9-4f40-b6d7-5ec3fbb4fd63");
    private static readonly Guid RentCategoryId = Guid.Parse("c0f3fd7a-f3a7-45aa-a6f1-94f690772f15");

    public static void TransactionInitFluentApi(this ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Person>(entity =>
        {
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Age).IsRequired();
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.Property(e => e.Description).IsRequired().HasMaxLength(400);
            entity.Property(e => e.Purpose).IsRequired();
        });

        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.Property(e => e.Description).IsRequired().HasMaxLength(400);
            entity.Property(e => e.Amount).IsRequired();
            entity.Property(e => e.TransactionType).IsRequired();

            entity.HasOne(e => e.Category)
                .WithMany()
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Person)
                .WithMany()
                .HasForeignKey(e => e.PersonId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    public static void TransactionContextSeedData(this ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Person>()
            .HasData(
                new Person()
                {
                    Id = JohnPersonId,
                    Name = "John Doe",
                    Age = 20
                },
                new Person()
                {
                    Id = JanePersonId,
                    Name = "Jane Doe",
                    Age = 21
                }
            );

        modelBuilder.Entity<Category>()
            .HasData(
                new Category()
                {
                    Id = SalaryCategoryId,
                    Description = "Salário",
                    Purpose = Domain.Enums.CategoryType.Income
                },
                new Category()
                {
                    Id = RentCategoryId,
                    Description = "Aluguel",
                    Purpose = Domain.Enums.CategoryType.Expense
                }
            );

        modelBuilder.Entity<Transaction>()
            .HasData(
                new Transaction()
                {
                    Id = Guid.NewGuid(),
                    Description = "Salário de Junho",
                    TransactionType = Domain.Enums.TransactionType.Income,
                    Amount = 5000m,
                    CategoryId = SalaryCategoryId,
                    PersonId = JohnPersonId
                },
                new Transaction()
                {
                    Id = Guid.NewGuid(),
                    Description = "Aluguel de Junho",
                    TransactionType = Domain.Enums.TransactionType.Expense,
                    Amount = 3000m,
                    CategoryId = RentCategoryId,
                    PersonId = JanePersonId
                }
            );
    }
}