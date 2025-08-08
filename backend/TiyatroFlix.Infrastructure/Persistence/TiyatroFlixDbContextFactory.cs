using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace TiyatroFlix.Infrastructure.Persistence;

public class TiyatroFlixDbContextFactory : IDesignTimeDbContextFactory<TiyatroFlixDbContext>
{
    public TiyatroFlixDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<TiyatroFlixDbContext>();
        optionsBuilder.UseSqlite("Data Source=tiyatroflix.db");

        return new TiyatroFlixDbContext(optionsBuilder.Options);
    }
}