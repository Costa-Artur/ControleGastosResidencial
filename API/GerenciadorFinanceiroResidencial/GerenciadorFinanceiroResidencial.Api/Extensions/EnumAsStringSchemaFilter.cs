using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace GerenciadorFinanceiroResidencial.Extensions;

public class EnumAsStringSchemaFilter : ISchemaFilter
{
    public void Apply(OpenApiSchema schema, SchemaFilterContext context)
    {
        //Cast de enum para string, para que o swagger mostre os tipos do enum
        var enumType = Nullable.GetUnderlyingType(context.Type) ?? context.Type;

        if (!enumType.IsEnum)
        {
            return;
        }

        schema.Type = "string";
        schema.Format = null;
        schema.Enum = Enum.GetValues(enumType)
            .Cast<object>()
            .Select(value => Enum.GetName(enumType, value))
            .Where(name => !string.IsNullOrWhiteSpace(name))
            .Distinct(StringComparer.Ordinal)
            .Select(name => (IOpenApiAny)new OpenApiString(name!))
            .ToList();
    }
}

