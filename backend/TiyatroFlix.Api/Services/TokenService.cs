using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

using TiyatroFlix.Domain.Entities;

namespace TiyatroFlix.Api.Services;

public interface ITokenService
{
    Task<AuthResponse> GenerateTokenAsync(ApplicationUser user);
    bool ValidateToken(string accessToken, out string userId);
}

public class TokenService : ITokenService
{
    private readonly JwtOptions _jwtOptions;
    private readonly UserManager<ApplicationUser> _userManager;

    public TokenService(
        IOptions<JwtOptions> jwtOptions,
        UserManager<ApplicationUser> userManager)
    {
        _jwtOptions = jwtOptions.Value;
        _userManager = userManager;
    }

    public async Task<AuthResponse> GenerateTokenAsync(ApplicationUser user)
    {
        var accessToken = await GenerateAccessToken(user);

        return new AuthResponse
        {
            AccessToken = accessToken
        };
    }


    public bool ValidateToken(string accessToken, out string userId)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var validationParameters = new TokenValidationParameters
        {
            ValidateAudience = true,
            ValidateIssuer = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(_jwtOptions.Secret)),
            ValidIssuer = _jwtOptions.Issuer,
            ValidAudience = _jwtOptions.Audience,
        };

        var claimsPrincipal = tokenHandler.ValidateToken(accessToken, validationParameters, out var token);
        userId = claimsPrincipal.Claims.First(c => c.Type == "uid").Value;
        return true;
    }

    private async Task<string> GenerateAccessToken(ApplicationUser user)
    {
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserName ?? ""),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email ?? ""),
            new Claim("uid", user.Id)
        };

        // Add role claims
        var roles = await _userManager.GetRolesAsync(user);
        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.Secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _jwtOptions.Issuer,
            audience: _jwtOptions.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(_jwtOptions.AccessTokenExpirationDays),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

}

public class AuthResponse
{
    public string AccessToken { get; set; } = string.Empty;
}