using MediatR;

using TiyatroFlix.Domain.Entities;

namespace TiyatroFlix.Api.Commands.Users
{
    public class RegisterUserCommand : IRequest<ApplicationUser>
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
    }
}