using MediatR;

using TiyatroFlix.Infrastructure.Persistence;

namespace TiyatroFlix.Api.Commands.Plays
{
    public class UpdatePlayCommandHandler : IRequestHandler<UpdatePlayCommand, bool>
    {
        private readonly TiyatroFlixDbContext _context;

        public UpdatePlayCommandHandler(TiyatroFlixDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(UpdatePlayCommand request, CancellationToken cancellationToken)
        {
            var play = await _context.Plays.FindAsync(request.Id, cancellationToken);

            if (play is null)
            {
                return false;
            }

            play.Title = request.Title;
            play.Description = request.Description;
            play.Director = request.Director;
            play.PosterImageUrl = request.PosterImageUrl;
            play.TrailerUrl = request.TrailerUrl;
            play.VideoUrl = request.VideoUrl;

            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}