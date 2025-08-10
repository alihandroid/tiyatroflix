using System.ComponentModel.DataAnnotations;

using MediatR;

using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

using TiyatroFlix.Api.Commands.Users;
using TiyatroFlix.Api.Services;

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

        group.MapPost("/validate", ValidateToken)
            .Produces(204)
            .Produces(400);

    }

    public record LoginRequest(
        [Required] string Email,
        [Required] string Password);

    public record LoginResponse(
        [Required] string Id,
        [Required] string? Email,
        [Required] string FirstName,
        [Required] string LastName,
        [Required] AuthResponse Tokens
    );

    private static async Task<IResult> Login(
        [FromBody] LoginRequest request,
        [FromServices] IMediator mediator,
        [FromServices] ITokenService tokenService)
    {
        var command = new LoginUserCommand
        {
            Email = request.Email,
            Password = request.Password
        };

        try
        {
            var user = await mediator.Send(command);
            var tokens = await tokenService.GenerateTokensAsync(user);
            return Results.Ok(new LoginResponse(user.Id, user.Email, user.FirstName, user.LastName, tokens));
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

    private static IResult ValidateToken(
        [FromHeader(Name = "Authorization")] string? authorization,
        [FromServices] ITokenService tokenService)
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

            tokenService.ValidateToken(authorization[7..]);

            return Results.NoContent();
        }
        catch (Exception ex)
        {
            return Results.BadRequest(ex.Message);
        }
    }
}