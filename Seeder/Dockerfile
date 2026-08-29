FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Seeder/Seeder.csproj", "Seeder/"]
RUN dotnet restore "Seeder/Seeder.csproj"
COPY . .
WORKDIR "/src/Seeder"
RUN dotnet build "Seeder.csproj" -c Release -o /app/build
RUN dotnet publish "Seeder.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/runtime:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
# The Program.cs expects Data at ../../../Data relative to AppContext.BaseDirectory
# In docker, AppContext.BaseDirectory is /app, so ../../../ resolves to /
# Therefore, we place the Data folder at /Data
COPY ["Seeder/Data/", "/Data/"]

ENTRYPOINT ["dotnet", "Seeder.dll"]
