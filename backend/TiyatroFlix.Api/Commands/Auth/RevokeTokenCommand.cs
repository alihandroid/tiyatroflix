using MediatR;

namespace TiyatroFlix.Api.Commands.Auth;

public record RevokeTokenCommand(string RefreshToken) : IRequest;