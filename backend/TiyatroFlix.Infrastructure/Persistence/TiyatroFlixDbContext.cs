using Microsoft.EntityFrameworkCore;
using TiyatroFlix.Domain.Entities;

namespace TiyatroFlix.Infrastructure.Persistence
{
    public class TiyatroFlixDbContext : DbContext
    {
        public TiyatroFlixDbContext(DbContextOptions<TiyatroFlixDbContext> options) : base(options)
        {
        }

        public DbSet<Play> Plays { get; set; }
    }
}