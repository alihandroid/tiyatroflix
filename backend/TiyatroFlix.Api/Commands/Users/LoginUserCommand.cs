using MediatR;

using TiyatroFlix.Domain.Entities;

namespace TiyatroFlix.Api.Commands.Users
{
    public class LoginUserCommand : IRequest<ApplicationUser>
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}