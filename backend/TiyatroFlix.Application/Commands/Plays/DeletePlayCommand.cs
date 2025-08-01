using MediatR;

namespace TiyatroFlix.Application.Commands.Plays
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