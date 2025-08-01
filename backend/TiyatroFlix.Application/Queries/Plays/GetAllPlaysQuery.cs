using MediatR;
using TiyatroFlix.Domain.Entities;

namespace TiyatroFlix.Application.Queries.Plays
{
    public class GetAllPlaysQuery : IRequest<List<Play>>
    {
    }
}