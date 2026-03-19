using GerenciadorFinanceiroResidencial.Application.Contracts;
using GerenciadorFinanceiroResidencial.Persistence.DbContexts;
using GerenciadorFinanceiroResidencial.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace GerenciadorFinanceiroResidencial.Persistence;

public static class PersistenceServiceRegistration
{
    public static void AddPersistenceServices(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<TransactionContext>(options =>
        {
            options.UseNpgsql(connectionString, npgsqlOptions =>
            {
                npgsqlOptions.MigrationsAssembly(typeof(TransactionContext).Assembly.GetName().Name);
                npgsqlOptions.EnableRetryOnFailure(5, TimeSpan.FromSeconds(10), null);
                npgsqlOptions.CommandTimeout(30);
            });
        });

        services.AddScoped<ITransactionRepository, TransactionRepository>();
    }
}

