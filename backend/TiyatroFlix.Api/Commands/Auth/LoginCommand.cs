using MediatR;

using TiyatroFlix.Domain.Entities;

namespace TiyatroFlix.Api.Commands.Auth;

public class LoginCommand : IRequest<ApplicationUser>
{
    public required string Email { get; set; }
    public required string Password { get; set; }
}