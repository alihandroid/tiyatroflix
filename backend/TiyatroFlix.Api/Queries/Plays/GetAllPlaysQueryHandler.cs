using MediatR;

using Microsoft.EntityFrameworkCore;

using TiyatroFlix.Domain.Entities;
using TiyatroFlix.Infrastructure.Persistence;

namespace TiyatroFlix.Api.Queries.Plays
{
    public class GetAllPlaysQueryHandler : IRequestHandler<GetAllPlaysQuery, List<Play>>
    {
        private readonly TiyatroFlixDbContext _context;

        public GetAllPlaysQueryHandler(TiyatroFlixDbContext context)
        {
            _context = context;
        }

        public async Task<List<Play>> Handle(GetAllPlaysQuery request, CancellationToken cancellationToken)
        {
            return await _context.Plays.ToListAsync(cancellationToken);
        }
    }
}