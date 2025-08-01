using MediatR;
using TiyatroFlix.Domain.Entities;

namespace TiyatroFlix.Api.Queries.Plays
{
    public class GetPlayByIdQuery : IRequest<Play?>
    {
        public int Id { get; }

        public GetPlayByIdQuery(int id)
        {
            Id = id;
        }
    }
}