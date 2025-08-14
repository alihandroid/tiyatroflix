using Microsoft.Extensions.DependencyInjection;

using TiyatroFlix.Domain.Entities;
using TiyatroFlix.Infrastructure.Persistence;

namespace TiyatroFlix.Infrastructure.Data;

public static class PlaySeeder
{
    public static void Seed(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var services = scope.ServiceProvider;
        var context = services.GetRequiredService<TiyatroFlixDbContext>();

        if (!context.Plays.Any())
        {
            var plays = new List<Play>
            {
                new Play
                {
                    Title = "Hamlet",
                    Director = "William Shakespeare",
                    Description = "The tragic story of Prince Hamlet.",
                    PosterImageUrl = "https://example.com/hamlet.jpg",
                    TrailerUrl = "https://example.com/hamlet-trailer.mp4",
                    VideoUrl = "https://example.com/hamlet-video.mp4"
                },
                new Play
                {
                    Title = "Romeo and Juliet",
                    Director = "William Shakespeare",
                    Description = "The tragic love story of Romeo and Juliet.",
                    PosterImageUrl = "https://example.com/romeo-juliet.jpg",
                    TrailerUrl = "https://example.com/romeo-juliet-trailer.mp4",
                    VideoUrl = "https://example.com/romeo-juliet-video.mp4"
                }
            };

            context.Plays.AddRange(plays);
            context.SaveChanges();
        }
    }
}