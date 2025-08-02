using MediatR;

using TiyatroFlix.Domain.Entities;

namespace TiyatroFlix.Api.Queries.Plays
{
    public class GetAllPlaysQuery : IRequest<List<Play>>
    {
    }
}