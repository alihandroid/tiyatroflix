using Microsoft.AspNetCore.Identity;

using TiyatroFlix.Api.Models;
using TiyatroFlix.Api.Services;
using TiyatroFlix.Domain.Entities;

namespace TiyatroFlix.Api.Endpoints;

public static class UserEndpoints
{
    public static void MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/users")
            .WithTags("Users")
            .WithOpenApi();

        group.MapPost("/register", async (
            UserManager<ApplicationUser> userManager,
            ITokenService tokenService,
            RegisterRequest request) =>
        {
            try
            {
                var user = new ApplicationUser
                {
                    UserName = request.Email,
                    Email = request.Email,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    CreatedAt = DateTime.UtcNow
                };

                var result = await userManager.CreateAsync(user, request.Password);

                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    return Results.BadRequest($"User registration failed: {errors}");
                }

                var authResponse = await tokenService.GenerateTokensAsync(user);
                return Results.Ok(authResponse);
            }
            catch (Exception ex)
            {
                return Results.BadRequest(ex.Message);
            }
        })
        .WithName("RegisterUser")
        .Produces<AuthResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest);
    }
}