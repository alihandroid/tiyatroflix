using MediatR;

using TiyatroFlix.Api.Commands.Users;

namespace TiyatroFlix.Api.Endpoints
{
    public static class UserEndpoints
    {
        public static void MapUserEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/users")
                .WithTags("Users")
                .WithOpenApi();

            group.MapPost("/register", async (IMediator mediator, RegisterUserCommand command) =>
            {
                try
                {
                    await mediator.Send(command);
                    // Return a success status code, e.g., 201 Created
                    return Results.Created(); // Or Results.Ok() if not returning a location
                }
                catch (Exception ex)
                {
                    // Log the exception
                    // Return an appropriate error response
                    return Results.Problem(ex.Message, statusCode: StatusCodes.Status400BadRequest);
                }
            })
            .WithName("RegisterUser")
            .Produces(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status400BadRequest);

            group.MapPost("/login", async (IMediator mediator, LoginUserCommand command) =>
            {
                try
                {
                    await mediator.Send(command);
                    // On successful login, you would typically return a JWT token or similar.
                    // For now, we'll return Ok.
                    return Results.Ok();
                }
                catch (Exception ex)
                {
                    // Log the exception
                    // Return an appropriate error response
                    return Results.Problem(ex.Message, statusCode: StatusCodes.Status400BadRequest);
                }
            })
            .WithName("LoginUser")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest);
        }
    }
}