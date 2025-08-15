# Backend Dockerfile for TiyatroFlix API
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files
COPY ["TiyatroFlix.Api/TiyatroFlix.Api.csproj", "TiyatroFlix.Api/"]
COPY ["TiyatroFlix.Domain/TiyatroFlix.Domain.csproj", "TiyatroFlix.Domain/"]
COPY ["TiyatroFlix.Infrastructure/TiyatroFlix.Infrastructure.csproj", "TiyatroFlix.Infrastructure/"]

# Restore dependencies
RUN dotnet restore "TiyatroFlix.Api/TiyatroFlix.Api.csproj"

# Copy source code
COPY . .

# Build the application
WORKDIR "/src/TiyatroFlix.Api"
RUN dotnet build "TiyatroFlix.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TiyatroFlix.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create logs directory with proper permissions
RUN mkdir -p /app/logs && chmod 777 /app/logs

ENTRYPOINT ["dotnet", "TiyatroFlix.Api.dll"]