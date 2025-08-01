using MediatR;

namespace TiyatroFlix.Api.Commands.Plays
{
    public class DeletePlayCommand : IRequest<bool>
    {
        public int Id { get; }

        public DeletePlayCommand(int id)
        {
            Id = id;
        }
    }
}