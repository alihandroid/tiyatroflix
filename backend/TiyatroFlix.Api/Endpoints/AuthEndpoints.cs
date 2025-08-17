using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

using TiyatroFlix.Api.Models;
using TiyatroFlix.Api.Services;
using TiyatroFlix.Domain.Entities;
using TiyatroFlix.Infrastructure.Persistence;

namespace TiyatroFlix.Api.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/auth")
            .WithTags("Authentication")
            .WithOpenApi();

        group.MapPost("/login", async ([FromBody] LoginRequest request, ITokenService tokenService, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager) =>
        {
            try
            {
                var user = await userManager.FindByEmailAsync(request.Email);
                if (user == null)
                {
                    return Results.BadRequest("Invalid login attempt.");
                }

                var result = await signInManager.PasswordSignInAsync(user, request.Password, isPersistent: false, lockoutOnFailure: false);

                if (!result.Succeeded)
                {
                    return Results.BadRequest("Invalid login attempt.");
                }

                var roles = await userManager.GetRolesAsync(user);
                var tokens = await tokenService.GenerateTokenAsync(user);
                return Results.Ok(new LoginResponse(new UserResponse(user.Id, user.Email, user.FirstName, user.LastName, [.. roles]), tokens));
            }
            catch (Exception ex)
            {
                return Results.BadRequest(ex.Message);
            }
        })
        .WithName("Login")
        .Produces<LoginResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest);


        group.MapGet("/validate", async ([FromHeader(Name = "Authorization")] string? authorization, ITokenService tokenService, TiyatroFlixDbContext context, UserManager<ApplicationUser> userManager) =>
        {
            try
            {
                if (string.IsNullOrEmpty(authorization))
                {
                    return Results.BadRequest();
                }

                if (!authorization.StartsWith("Bearer "))
                {
                    return Results.BadRequest();
                }

                if (!tokenService.ValidateToken(authorization[7..], out var userId))
                {
                    return Results.Forbid();
                }

                var user = context.Users.First(x => x.Id == userId);
                var roles = await userManager.GetRolesAsync(user);

                var response = new ValidateResponse(
                    true,
                    new UserResponse(user.Id, user.Email, user.FirstName, user.LastName, [.. roles]));

                return Results.Ok(response);
            }
            catch (ArgumentException)
            {
                return Results.BadRequest();
            }
            catch (UnauthorizedAccessException)
            {
                return Results.Forbid();
            }
            catch (Exception ex)
            {
                return Results.BadRequest(ex.Message);
            }
        })
        .WithName("ValidateToken")
        .Produces<ValidateResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status403Forbidden);
    }
}