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
        app.MapPost("/auth/login", Login)
            .Produces<AuthResponse>()
            .Produces(400)
            .WithTags("Authentication");

        app.MapPost("/auth/refresh", RefreshToken)
            .Produces<AuthResponse>()
            .Produces(400)
            .WithTags("Authentication");

        app.MapPost("/auth/revoke", RevokeToken)
            .Produces(204)
            .Produces(400)
            .WithTags("Authentication");
    }

    public record LoginRequest(
        [Required] string Email,
        [Required] string Password);

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
            var authResponse = await tokenService.GenerateTokensAsync(user);
            return Results.Ok(authResponse);
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
}