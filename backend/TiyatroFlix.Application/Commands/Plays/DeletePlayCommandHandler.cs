using MediatR;
using TiyatroFlix.Infrastructure.Persistence;

namespace TiyatroFlix.Application.Commands.Plays
{
    public class DeletePlayCommandHandler : IRequestHandler<DeletePlayCommand, bool>
    {
        private readonly TiyatroFlixDbContext _context;

        public DeletePlayCommandHandler(TiyatroFlixDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(DeletePlayCommand request, CancellationToken cancellationToken)
        {
            var play = await _context.Plays.FindAsync(request.Id, cancellationToken);

            if (play is null)
            {
                return false;
            }

            _context.Plays.Remove(play);
            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}