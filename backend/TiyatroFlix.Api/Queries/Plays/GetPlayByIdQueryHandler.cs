using MediatR;

using TiyatroFlix.Domain.Entities;
using TiyatroFlix.Infrastructure.Persistence;

namespace TiyatroFlix.Api.Queries.Plays
{
    public class GetPlayByIdQueryHandler : IRequestHandler<GetPlayByIdQuery, Play?>
    {
        private readonly TiyatroFlixDbContext _context;

        public GetPlayByIdQueryHandler(TiyatroFlixDbContext context)
        {
            _context = context;
        }

        public async Task<Play?> Handle(GetPlayByIdQuery request, CancellationToken cancellationToken)
        {
            return await _context.Plays.FindAsync(request.Id, cancellationToken);
        }
    }
}