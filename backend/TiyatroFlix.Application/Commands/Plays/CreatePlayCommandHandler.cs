using MediatR;
using TiyatroFlix.Domain.Entities;
using TiyatroFlix.Infrastructure.Persistence;

namespace TiyatroFlix.Application.Commands.Plays
{
    public class CreatePlayCommandHandler : IRequestHandler<CreatePlayCommand, Play>
    {
        private readonly TiyatroFlixDbContext _context;

        public CreatePlayCommandHandler(TiyatroFlixDbContext context)
        {
            _context = context;
        }

        public async Task<Play> Handle(CreatePlayCommand request, CancellationToken cancellationToken)
        {
            var play = new Play
            {
                Title = request.Title,
                Description = request.Description,
                Director = request.Director,
                PosterImageUrl = request.PosterImageUrl,
                TrailerUrl = request.TrailerUrl,
                VideoUrl = request.VideoUrl
            };

            _context.Plays.Add(play);
            await _context.SaveChangesAsync(cancellationToken);

            return play;
        }
    }
}