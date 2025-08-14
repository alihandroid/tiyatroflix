using MediatR;

using TiyatroFlix.Api.Services;

namespace TiyatroFlix.Api.Commands.Auth;

public record RefreshTokenCommand(string AccessToken, string RefreshToken) : IRequest<AuthResponse>;