using MediatR;
using TiyatroFlix.Domain.Entities;

namespace TiyatroFlix.Application.Commands.Plays
{
    public class CreatePlayCommand : IRequest<Play>
    {
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required string Director { get; set; }
        public required string PosterImageUrl { get; set; }
        public required string TrailerUrl { get; set; }
        public required string VideoUrl { get; set; }
    }
}