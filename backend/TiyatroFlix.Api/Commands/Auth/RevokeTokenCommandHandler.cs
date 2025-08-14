using MediatR;

using TiyatroFlix.Api.Services;

namespace TiyatroFlix.Api.Commands.Auth;

public class RevokeTokenCommandHandler : IRequestHandler<RevokeTokenCommand>
{
    private readonly ITokenService _tokenService;

    public RevokeTokenCommandHandler(ITokenService tokenService)
    {
        _tokenService = tokenService;
    }

    public async Task Handle(RevokeTokenCommand request, CancellationToken cancellationToken)
    {
        await _tokenService.RevokeRefreshTokenAsync(request.RefreshToken);
    }
}