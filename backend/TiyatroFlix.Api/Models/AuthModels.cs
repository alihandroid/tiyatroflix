using System.ComponentModel.DataAnnotations;

namespace TiyatroFlix.Api.Models;

public record UserResponse(
    [Required] string Id,
    [Required] string? Email,
    [Required] string FirstName,
    [Required] string LastName,
    [Required] string[] Roles
);

public record LoginResponse(
    [Required] UserResponse User,
    [Required] Services.AuthResponse Tokens
);

public record RefreshRequest(
    [Required] string AccessToken,
    [Required] string RefreshToken);

public record RevokeRequest([Required] string RefreshToken);

public record ValidateResponse(
    [Required] bool Valid,
    [Required] UserResponse User
);