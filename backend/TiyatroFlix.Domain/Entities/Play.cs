namespace TiyatroFlix.Domain.Entities;

public class Play
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required string PosterImageUrl { get; set; }
    public required string TrailerUrl { get; set; }
    public required string VideoUrl { get; set; }
}