FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["CloudService.WebApi/CloudService.WebApi.csproj", "CloudService.WebApi/"]
COPY ["CloudService.Application/CloudService.Application.csproj", "CloudService.Application/"]
COPY ["CloudService.Domain/CloudService.Domain.csproj", "CloudService.Domain/"]
COPY ["CloudService.Infrastructure/CloudService.Infrastructure.csproj", "CloudService.Infrastructure/"]
RUN dotnet restore "CloudService.WebApi/CloudService.WebApi.csproj"
COPY . .
WORKDIR "/src/CloudService.WebApi"
RUN dotnet build "CloudService.WebApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CloudService.WebApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
# Copy seed SQL files from build context root to /app
COPY --from=build /src/seed_data_database_script_1.sql ./
COPY --from=build /src/update_categories.sql ./
ENTRYPOINT ["dotnet", "CloudService.WebApi.dll"]
