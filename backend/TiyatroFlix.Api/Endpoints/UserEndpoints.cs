using MediatR;

using TiyatroFlix.Api.Commands.Users;
using TiyatroFlix.Api.Services;

namespace TiyatroFlix.Api.Endpoints
{
    public static class UserEndpoints
    {
        public static void MapUserEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/users")
                .WithTags("Users")
                .WithOpenApi();

            group.MapPost("/register", async (
                IMediator mediator,
                ITokenService tokenService,
                RegisterUserCommand command) =>
            {
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
            })
            .WithName("RegisterUser")
            .Produces<AuthResponse>()
            .Produces(StatusCodes.Status400BadRequest);
        }
    }
}