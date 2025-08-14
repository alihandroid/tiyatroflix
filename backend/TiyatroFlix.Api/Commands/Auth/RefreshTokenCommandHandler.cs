using MediatR;

using Microsoft.IdentityModel.Tokens;

using TiyatroFlix.Api.Services;

namespace TiyatroFlix.Api.Commands.Auth;

public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, AuthResponse>
{
    private readonly ITokenService _tokenService;

    public RefreshTokenCommandHandler(ITokenService tokenService)
    {
        _tokenService = tokenService;
    }

    public async Task<AuthResponse> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        try
        {
            return await _tokenService.RefreshTokenAsync(request.AccessToken, request.RefreshToken);
        }
        catch (SecurityTokenException)
        {
            throw;
        }
    }
}