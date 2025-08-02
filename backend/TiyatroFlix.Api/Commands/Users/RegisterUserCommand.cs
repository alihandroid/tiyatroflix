using MediatR;

namespace TiyatroFlix.Api.Commands.Users
{
    public class RegisterUserCommand : IRequest<Unit>
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
    }
}