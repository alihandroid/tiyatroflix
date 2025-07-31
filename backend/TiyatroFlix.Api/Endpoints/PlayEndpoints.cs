using Microsoft.EntityFrameworkCore;
using TiyatroFlix.Domain.Entities;
using TiyatroFlix.Infrastructure.Persistence;

namespace TiyatroFlix.Api.Endpoints
{
    public static class PlayEndpoints
    {
        public static void MapPlayEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/api/plays")
                .WithTags("Plays")
                .WithOpenApi();

            // GET all plays
            group.MapGet("/", async (TiyatroFlixDbContext context) =>
            {
                var plays = await context.Plays.ToListAsync();
                return Results.Ok(plays);
            })
            .WithName("GetAllPlays")
            .Produces<List<Play>>(StatusCodes.Status200OK);

            // GET play by ID
            group.MapGet("/{id}", async (int id, TiyatroFlixDbContext context) =>
            {
                var play = await context.Plays.FindAsync(id);
                return play is not null ? Results.Ok(play) : Results.NotFound();
            })
            .WithName("GetPlayById")
            .Produces<Play>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);

            // POST create new play
            group.MapPost("/", async (Play play, TiyatroFlixDbContext context) =>
            {
                context.Plays.Add(play);
                await context.SaveChangesAsync();
                return Results.Created($"/api/plays/{play.Id}", play);
            })
            .WithName("CreatePlay")
            .Produces<Play>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status400BadRequest);

            // PUT update existing play
            group.MapPut("/{id}", async (int id, Play updatedPlay, TiyatroFlixDbContext context) =>
            {
                var existingPlay = await context.Plays.FindAsync(id);
                if (existingPlay is null)
                {
                    return Results.NotFound();
                }

                existingPlay.Title = updatedPlay.Title;
                existingPlay.Description = updatedPlay.Description;
                existingPlay.Director = updatedPlay.Director;
                existingPlay.PosterImageUrl = updatedPlay.PosterImageUrl;
                existingPlay.TrailerUrl = updatedPlay.TrailerUrl;
                existingPlay.VideoUrl = updatedPlay.VideoUrl;

                await context.SaveChangesAsync();
                return Results.NoContent();
            })
            .WithName("UpdatePlay")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);

            // DELETE play
            group.MapDelete("/{id}", async (int id, TiyatroFlixDbContext context) =>
            {
                var play = await context.Plays.FindAsync(id);
                if (play is null)
                {
                    return Results.NotFound();
                }

                context.Plays.Remove(play);
                await context.SaveChangesAsync();
                return Results.NoContent();
            })
            .WithName("DeletePlay")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);
        }
    }
}