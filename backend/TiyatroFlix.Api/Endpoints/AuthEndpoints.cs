using MediatR;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

using TiyatroFlix.Api.Commands.Auth;
using TiyatroFlix.Api.Models;
using TiyatroFlix.Api.Queries.Auth;
using TiyatroFlix.Api.Services;
using TiyatroFlix.Domain.Entities;

namespace TiyatroFlix.Api.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/auth")
            .WithTags("Authentication")
            .WithOpenApi();

        group.MapPost("/login", async ([FromBody] LoginCommand command, IMediator mediator, ITokenService tokenService, UserManager<ApplicationUser> userManager) =>
        {
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
        })
        .WithName("Login")
        .Produces<LoginResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest);

        group.MapPost("/refresh", async ([FromBody] RefreshRequest request, IMediator mediator) =>
        {
            try
            {
                var tokens = await mediator.Send(new RefreshTokenCommand(request.AccessToken, request.RefreshToken));
                return Results.Ok(tokens);
            }
            catch (SecurityTokenException ex)
            {
                return Results.BadRequest(ex.Message);
            }
        })
        .WithName("RefreshToken")
        .Produces<AuthResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest);

        group.MapPost("/revoke", async ([FromBody] RevokeRequest request, IMediator mediator) =>
        {
            try
            {
                await mediator.Send(new RevokeTokenCommand(request.RefreshToken));
                return Results.NoContent();
            }
            catch (Exception ex)
            {
                return Results.BadRequest(ex.Message);
            }
        })
        .WithName("RevokeToken")
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status400BadRequest);

        group.MapGet("/validate", async ([FromHeader(Name = "Authorization")] string? authorization, IMediator mediator) =>
        {
            try
            {
                if (string.IsNullOrEmpty(authorization))
                {
                    return Results.BadRequest();
                }

                var response = await mediator.Send(new ValidateTokenQuery(authorization));
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