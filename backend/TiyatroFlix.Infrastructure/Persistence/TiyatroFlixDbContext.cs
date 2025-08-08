using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

using TiyatroFlix.Domain.Entities;

namespace TiyatroFlix.Infrastructure.Persistence
{
    public class TiyatroFlixDbContext : IdentityDbContext<ApplicationUser>
    {
        public TiyatroFlixDbContext(DbContextOptions<TiyatroFlixDbContext> options) : base(options)
        {
        }

        public DbSet<Play> Plays { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<RefreshToken>()
                .HasOne(rt => rt.User)
                .WithMany(u => u.RefreshTokens)
                .HasForeignKey(rt => rt.UserId);
        }
    }
}