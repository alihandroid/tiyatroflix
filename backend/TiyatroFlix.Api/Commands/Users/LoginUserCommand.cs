using MediatR;

namespace TiyatroFlix.Api.Commands.Users
{
    public class LoginUserCommand : IRequest<string>
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}