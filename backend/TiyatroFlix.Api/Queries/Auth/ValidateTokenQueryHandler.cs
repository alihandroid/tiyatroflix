using MediatR;

using Microsoft.AspNetCore.Identity;

using TiyatroFlix.Api.Models;
using TiyatroFlix.Api.Services;
using TiyatroFlix.Domain.Entities;
using TiyatroFlix.Infrastructure.Persistence;

namespace TiyatroFlix.Api.Queries.Auth;

public class ValidateTokenQueryHandler : IRequestHandler<ValidateTokenQuery, ValidateResponse>
{
    private readonly ITokenService _tokenService;
    private readonly TiyatroFlixDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public ValidateTokenQueryHandler(
        ITokenService tokenService,
        TiyatroFlixDbContext context,
        UserManager<ApplicationUser> userManager)
    {
        _tokenService = tokenService;
        _context = context;
        _userManager = userManager;
    }

    public async Task<ValidateResponse> Handle(ValidateTokenQuery request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(request.Authorization))
        {
            throw new ArgumentException("Authorization header is required");
        }

        if (!request.Authorization.StartsWith("Bearer "))
        {
            throw new ArgumentException("Invalid authorization header format");
        }

        if (!_tokenService.ValidateToken(request.Authorization[7..], out var userId))
        {
            throw new UnauthorizedAccessException("Invalid token");
        }

        var user = _context.Users.First(x => x.Id == userId);
        var roles = await _userManager.GetRolesAsync(user);

        return new ValidateResponse(
            true,
            new UserResponse(user.Id, user.Email, user.FirstName, user.LastName, [.. roles]));
    }
}