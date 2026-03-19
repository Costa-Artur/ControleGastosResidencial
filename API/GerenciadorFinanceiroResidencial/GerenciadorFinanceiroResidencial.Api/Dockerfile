FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["GerenciadorFinanceiroResidencial.Api/GerenciadorFinanceiroResidencial.Api.csproj", "GerenciadorFinanceiroResidencial.Api/"]
RUN dotnet restore "GerenciadorFinanceiroResidencial.Api/GerenciadorFinanceiroResidencial.Api.csproj"
COPY . .
WORKDIR "/src/GerenciadorFinanceiroResidencial.Api"
RUN dotnet build "GerenciadorFinanceiroResidencial.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "GerenciadorFinanceiroResidencial.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GerenciadorFinanceiroResidencial.Api.dll"]
