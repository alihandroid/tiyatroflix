using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

using TiyatroFlix.Api.Models;
using TiyatroFlix.Domain.Entities;
using TiyatroFlix.Infrastructure.Persistence;

namespace TiyatroFlix.Api.Endpoints;

public static class PlayEndpoints
{
    public static void MapPlayEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/plays")
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

        // GET plays count - MUST be before /{id} route
        group.MapGet("/count", async (TiyatroFlixDbContext context) =>
        {
            var count = await context.Plays.CountAsync();
            return Results.Ok(new { count });
        })
        .WithName("GetPlaysCount")
        .Produces<object>(StatusCodes.Status200OK);

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
        group.MapPost("/", async (CreatePlayRequest request, TiyatroFlixDbContext context) =>
        {
            var play = new Play
            {
                Title = request.Title,
                Description = request.Description,
                PosterImageUrl = request.PosterImageUrl,
                TrailerUrl = request.TrailerUrl,
                VideoUrl = request.VideoUrl
            };

            context.Plays.Add(play);
            await context.SaveChangesAsync();

            return Results.Created($"/api/plays/{play.Id}", play);
        })
        .WithName("CreatePlay")
        .RequireAuthorization("AdminOnly")
        .Produces<Play>(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status400BadRequest);

        // PUT update existing play
        group.MapPut("/{id}", async (int id, UpdatePlayRequest request, TiyatroFlixDbContext context) =>
        {
            var play = await context.Plays.FindAsync(id);

            if (play is null)
            {
                return Results.NotFound();
            }

            play.Title = request.Title;
            play.Description = request.Description;
            play.PosterImageUrl = request.PosterImageUrl;
            play.TrailerUrl = request.TrailerUrl;
            play.VideoUrl = request.VideoUrl;

            await context.SaveChangesAsync();

            return Results.NoContent();
        })
        .WithName("UpdatePlay")
        .RequireAuthorization("AdminOnly")
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
        .RequireAuthorization("AdminOnly")
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status404NotFound);
    }
}