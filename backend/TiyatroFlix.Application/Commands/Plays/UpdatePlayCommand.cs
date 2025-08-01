using MediatR;

namespace TiyatroFlix.Application.Commands.Plays
{
    public class UpdatePlayCommand : IRequest<bool>
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required string Director { get; set; }
        public required string PosterImageUrl { get; set; }
        public required string TrailerUrl { get; set; }
        public required string VideoUrl { get; set; }
    }
}