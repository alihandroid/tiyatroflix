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
                    Description = "The tragic story of Prince Hamlet, a Danish prince who seeks revenge against his father's killer.",
                    PosterImageUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
                    TrailerUrl = "https://example.com/hamlet-trailer.mp4",
                    VideoUrl = "https://example.com/hamlet-video.mp4"
                },
                new Play
                {
                    Title = "Romeo and Juliet",
                    Director = "William Shakespeare",
                    Description = "The tragic love story of two young star-crossed lovers whose deaths unite their feuding families.",
                    PosterImageUrl = "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=600&fit=crop",
                    TrailerUrl = "https://example.com/romeo-juliet-trailer.mp4",
                    VideoUrl = "https://example.com/romeo-juliet-video.mp4"
                },
                new Play
                {
                    Title = "Macbeth",
                    Director = "William Shakespeare",
                    Description = "A Scottish general receives a prophecy from witches that he will become King of Scotland.",
                    PosterImageUrl = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
                    TrailerUrl = "https://example.com/macbeth-trailer.mp4",
                    VideoUrl = "https://example.com/macbeth-video.mp4"
                },
                new Play
                {
                    Title = "A Midsummer Night's Dream",
                    Director = "William Shakespeare",
                    Description = "A romantic comedy about the events surrounding the marriage of Theseus and Hippolyta.",
                    PosterImageUrl = "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=400&h=600&fit=crop",
                    TrailerUrl = "https://example.com/midsummer-trailer.mp4",
                    VideoUrl = "https://example.com/midsummer-video.mp4"
                },
                new Play
                {
                    Title = "Death of a Salesman",
                    Director = "Arthur Miller",
                    Description = "The story of Willy Loman, a failing salesman, and his family's struggles with the American Dream.",
                    PosterImageUrl = "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=600&fit=crop",
                    TrailerUrl = "https://example.com/salesman-trailer.mp4",
                    VideoUrl = "https://example.com/salesman-video.mp4"
                },
                new Play
                {
                    Title = "The Glass Menagerie",
                    Director = "Tennessee Williams",
                    Description = "A memory play about Tom Wingfield, his mother Amanda, and his fragile sister Laura.",
                    PosterImageUrl = "https://images.unsplash.com/photo-1578662015798-a04b1f7b7c8c?w=400&h=600&fit=crop",
                    TrailerUrl = "https://example.com/glass-menagerie-trailer.mp4",
                    VideoUrl = "https://example.com/glass-menagerie-video.mp4"
                },
                new Play
                {
                    Title = "The Crucible",
                    Director = "Arthur Miller",
                    Description = "A dramatized and partially fictionalized story of the Salem witch trials in Massachusetts.",
                    PosterImageUrl = "https://images.unsplash.com/photo-1551731409-43eb3e517a1a?w=400&h=600&fit=crop",
                    TrailerUrl = "https://example.com/crucible-trailer.mp4",
                    VideoUrl = "https://example.com/crucible-video.mp4"
                },
                new Play
                {
                    Title = "The Phantom of the Opera",
                    Director = "Andrew Lloyd Webber",
                    Description = "A musical about a mysterious phantom who haunts the Paris Opera House and becomes obsessed with Christine.",
                    PosterImageUrl = "https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=400&h=600&fit=crop",
                    TrailerUrl = "https://example.com/phantom-trailer.mp4",
                    VideoUrl = "https://example.com/phantom-video.mp4"
                },
                new Play
                {
                    Title = "Les Misérables",
                    Director = "Claude-Michel Schönberg",
                    Description = "A musical adaptation of Victor Hugo's novel about love, loss, and redemption in 19th-century France.",
                    PosterImageUrl = "https://images.unsplash.com/photo-1465664114139-ccc8e4afc9d9?w=400&h=600&fit=crop",
                    TrailerUrl = "https://example.com/les-miserables-trailer.mp4",
                    VideoUrl = "https://example.com/les-miserables-video.mp4"
                },
                new Play
                {
                    Title = "Chicago",
                    Director = "John Kander",
                    Description = "A satirical musical about crime, corruption, and celebrity in 1920s Chicago.",
                    PosterImageUrl = "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=600&fit=crop",
                    TrailerUrl = "https://example.com/chicago-trailer.mp4",
                    VideoUrl = "https://example.com/chicago-video.mp4"
                }
            };

            context.Plays.AddRange(plays);
            context.SaveChanges();
        }
    }
}