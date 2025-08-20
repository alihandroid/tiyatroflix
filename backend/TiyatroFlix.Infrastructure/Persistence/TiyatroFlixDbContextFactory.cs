using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace TiyatroFlix.Infrastructure.Persistence;

public class TiyatroFlixDbContextFactory : IDesignTimeDbContextFactory<TiyatroFlixDbContext>
{
    public TiyatroFlixDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<TiyatroFlixDbContext>();

        var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .AddJsonFile($"appsettings.Development.json", optional: true)
            .Build();

        var connectionString = configuration.GetConnectionString("DefaultConnection");
        optionsBuilder.UseSqlite(connectionString);

        return new TiyatroFlixDbContext(optionsBuilder.Options);
    }
}