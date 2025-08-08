using MediatR;

using Microsoft.AspNetCore.Authorization;

using TiyatroFlix.Api.Commands.Plays;
using TiyatroFlix.Api.Queries.Plays;
using TiyatroFlix.Domain.Entities;

namespace TiyatroFlix.Api.Endpoints
{
    public static class PlayEndpoints
    {
        public static void MapPlayEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/plays")
                .WithTags("Plays")
                .WithOpenApi();

            // GET all plays
            group.MapGet("/", async (IMediator mediator) =>
            {
                var plays = await mediator.Send(new GetAllPlaysQuery());
                return Results.Ok(plays);
            })
            .WithName("GetAllPlays")
            .Produces<List<Play>>(StatusCodes.Status200OK);

            // GET play by ID
            group.MapGet("/{id}", async (int id, IMediator mediator) =>
            {
                var play = await mediator.Send(new GetPlayByIdQuery(id));
                return play is not null ? Results.Ok(play) : Results.NotFound();
            })
            .WithName("GetPlayById")
            .Produces<Play>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);

            // POST create new play
            group.MapPost("/", async (CreatePlayCommand command, IMediator mediator) =>
            {
                var createdPlay = await mediator.Send(command);
                return Results.Created($"/api/plays/{createdPlay.Id}", createdPlay);
            })
            .WithName("CreatePlay")
            .RequireAuthorization("AdminOnly")
            .Produces<Play>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status400BadRequest);

            // PUT update existing play
            group.MapPut("/{id}", async (int id, UpdatePlayCommand command, IMediator mediator) =>
            {
                command.Id = id; // Ensure the ID from the route is used
                var result = await mediator.Send(command);
                return result ? Results.NoContent() : Results.NotFound();
            })
            .WithName("UpdatePlay")
            .RequireAuthorization("AdminOnly")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);

            // DELETE play
            group.MapDelete("/{id}", async (int id, IMediator mediator) =>
            {
                var result = await mediator.Send(new DeletePlayCommand(id));
                return result ? Results.NoContent() : Results.NotFound();
            })
            .WithName("DeletePlay")
            .RequireAuthorization("AdminOnly")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);
        }
    }
}