using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;

using MediatR;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

using TiyatroFlix.Api.Commands.Users;
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

        group.MapPost("/login", Login)
            .Produces<LoginResponse>()
            .Produces(400);

        group.MapPost("/refresh", RefreshToken)
            .Produces<AuthResponse>()
            .Produces(400);

        group.MapPost("/revoke", RevokeToken)
            .Produces(204)
            .Produces(400);

        group.MapGet("/validate", ValidateToken)
            .Produces<ValidateResponse>()
            .Produces(400);
    }

    public record LoginRequest(
        [Required] string Email,
        [Required] string Password);

    public record UserResponse(
        [Required] string Id,
        [Required] string? Email,
        [Required] string FirstName,
        [Required] string LastName,
        [Required] string[] Roles
        );

    public record LoginResponse(
        [Required] UserResponse User,
        [Required] AuthResponse Tokens
    );

    private static async Task<IResult> Login(
        [FromBody] LoginRequest request,
        [FromServices] IMediator mediator,
        [FromServices] ITokenService tokenService,
        [FromServices] UserManager<ApplicationUser> userManager)
    {
        var command = new LoginUserCommand
        {
            Email = request.Email,
            Password = request.Password
        };

        try
        {
            var user = await mediator.Send(command);
            var roles = await userManager.GetRolesAsync(user);
            var tokens = await tokenService.GenerateTokensAsync(user);
            return Results.Ok(new LoginResponse(new UserResponse(user.Id, user.Email, user.FirstName, user.LastName, [.. roles]), tokens));
        }
        catch (Exception ex)
        {
            return Results.BadRequest(ex.Message);
        }
    }

    public record RefreshRequest(
        [Required] string AccessToken,
        [Required] string RefreshToken);

    private static async Task<IResult> RefreshToken(
        [FromBody] RefreshRequest request,
        [FromServices] ITokenService tokenService)
    {
        try
        {
            var tokens = await tokenService.RefreshTokenAsync(
                request.AccessToken,
                request.RefreshToken);

            return Results.Ok(tokens);
        }
        catch (SecurityTokenException ex)
        {
            return Results.BadRequest(ex.Message);
        }
    }

    public record RevokeRequest([Required] string RefreshToken);

    private static async Task<IResult> RevokeToken(
        [FromBody] RevokeRequest request,
        [FromServices] ITokenService tokenService)
    {
        try
        {
            await tokenService.RevokeRefreshTokenAsync(request.RefreshToken);
            return Results.NoContent();
        }
        catch (Exception ex)
        {
            return Results.BadRequest(ex.Message);
        }
    }

    public record ValidateResponse(
        [Required] bool Valid,
        [Required] UserResponse User
    );

    private async static Task<IResult> ValidateToken(
        [FromHeader(Name = "Authorization")] string? authorization,
        [FromServices] ITokenService tokenService,
        [FromServices] TiyatroFlixDbContext context,
        [FromServices] UserManager<ApplicationUser> userManager)
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

            return Results.Ok(new ValidateResponse(true, new UserResponse(user.Id, user.Email, user.FirstName, user.LastName, [.. roles])));
        }
        catch (Exception ex)
        {
            return Results.BadRequest(ex.Message);
        }
    }
}