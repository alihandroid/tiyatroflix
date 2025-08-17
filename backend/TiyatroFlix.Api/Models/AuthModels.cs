using System.ComponentModel.DataAnnotations;

namespace TiyatroFlix.Api.Models;

public record LoginRequest(
    [Required] string Email,
    [Required] string Password
);

public record RegisterRequest(
    [Required] string Email,
    [Required] string Password,
    [Required] string FirstName,
    [Required] string LastName
);

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


public record ValidateResponse(
    [Required] bool Valid,
    [Required] UserResponse User
);