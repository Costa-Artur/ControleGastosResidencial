using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using GerenciadorFinanceiroResidencial.Application;
using GerenciadorFinanceiroResidencial.Extensions;
using GerenciadorFinanceiroResidencial.Persistence;
using GerenciadorFinanceiroResidencial.Persistence.DbContexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAutoMapper(_ => {}, AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddControllers()
    .AddJsonOptions(opt =>
    {
        opt.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        opt.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter((JsonNamingPolicy?)null, allowIntegerValues: false));
    })
    .ConfigureApiBehaviorOptions(setupAction =>
    {
        setupAction.SuppressModelStateInvalidFilter = true;
        setupAction.InvalidModelStateResponseFactory = context =>
        {
            // Cria a fábrica de um objeto de detalhes de problema de validação
            var problemDetailsFactory = context.HttpContext.RequestServices
                .GetRequiredService<ProblemDetailsFactory>();

            // Cria um objeto de detalhes de problema de validação
            var validationProblemDetails = problemDetailsFactory
                .CreateValidationProblemDetails(
                    context.HttpContext,
                    context.ModelState);

            // Adiciona informações adicionais não adicionadas por padrão
            validationProblemDetails.Detail =
                "See the errors field for details.";
            validationProblemDetails.Instance =
                context.HttpContext.Request.Path;

            // Relata respostas do estado de modelo inválido como problemas de validação
            validationProblemDetails.Type =
                "https://gerenciadorfinanceiro.com/modelvalidationproblem";
            validationProblemDetails.Status =
                StatusCodes.Status422UnprocessableEntity;
            validationProblemDetails.Title =
                "One or more validation errors occurred.";

            return new UnprocessableEntityObjectResult(
                validationProblemDetails)
            {
                ContentTypes = { "application/problem+json" }
            };
        };
    });

builder.Services.AddApplicationServices();

builder.AddFluentValidationServices();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Host=postgres;Database=gerenciador-financeiro;Username=postgres;Password=postgres";

builder.Services.AddPersistenceServices(connectionString);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    //mostrar enums no swagger
    options.SchemaFilter<EnumAsStringSchemaFilter>();

    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);

    if (File.Exists(xmlPath))
    {
        options.IncludeXmlComments(xmlPath);
    }
});

var app = builder.Build();

await ApplyMigrationsWithRetryAsync(app);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthorization();

app.MapControllers();

app.Run();

//Aplicar migrations ao iniciar docker
static async Task ApplyMigrationsWithRetryAsync(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var logger = scope.ServiceProvider
        .GetRequiredService<ILoggerFactory>()
        .CreateLogger("DatabaseMigration");
    var dbContext = scope.ServiceProvider.GetRequiredService<TransactionContext>();

    const int maxAttempts = 8;

    for (var attempt = 1; attempt <= maxAttempts; attempt++)
    {
        try
        {
            await dbContext.Database.MigrateAsync();
            logger.LogInformation("Database migration applied successfully.");
            return;
        }
        catch (Exception ex) when (attempt < maxAttempts)
        {
            logger.LogWarning(ex,
                "Migration attempt {Attempt}/{MaxAttempts} failed. Retrying...",
                attempt,
                maxAttempts);
            await Task.Delay(TimeSpan.FromSeconds(5));
        }
    }

    await dbContext.Database.MigrateAsync();
}
