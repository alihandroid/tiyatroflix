using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

using TiyatroFlix.Domain.Entities;
using TiyatroFlix.Infrastructure.Persistence;

namespace TiyatroFlix.Infrastructure.Data
{
    public static class AdminRoleMigration
    {
        public static void SeedAdminRole(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var services = scope.ServiceProvider;
            var context = services.GetRequiredService<TiyatroFlixDbContext>();
            var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
            var config = services.GetRequiredService<IConfiguration>();

            try
            {
                // Ensure database is created
                context.Database.EnsureCreated();

                // Create Admin role if not exists
                if (!roleManager.RoleExistsAsync("Admin").Result)
                {
                    roleManager.CreateAsync(new IdentityRole("Admin")).Wait();
                }

                // Get admin email from configuration
                var adminEmail = "admin@tiyatroflix.com";

                // Find or create admin user
                var adminUser = userManager.FindByEmailAsync(adminEmail).Result;
                if (adminUser == null)
                {
                    adminUser = new ApplicationUser
                    {
                        UserName = adminEmail,
                        Email = adminEmail,
                        FirstName = "Admin",
                        LastName = "User"
                    };
                    var result = userManager.CreateAsync(adminUser, "TempPassword123!").Result;
                    if (!result.Succeeded)
                    {
                        throw new Exception($"Failed to create admin user: {string.Join(", ", result.Errors)}");
                    }
                }

                // Assign admin role if not already assigned
                if (!userManager.IsInRoleAsync(adminUser, "Admin").Result)
                {
                    userManager.AddToRoleAsync(adminUser, "Admin").Wait();
                }
            }
            catch (Exception ex)
            {
                var logger = services.GetRequiredService<ILogger>();
                logger.LogError(ex, "An error occurred seeding admin role and user.");
                throw;
            }
        }
    }
}