using MediatR;

using Microsoft.AspNetCore.Identity;

using TiyatroFlix.Domain.Entities;
using TiyatroFlix.Infrastructure.Persistence;

namespace TiyatroFlix.Api.Commands.Users
{
    public class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, Unit>
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public RegisterUserCommandHandler(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<Unit> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
        {
            var user = new ApplicationUser
            {
                UserName = request.Email, // Use email as username
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                CreatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                // Handle errors - for now, let's throw an exception or return a result indicating failure
                // In a real application, you'd want more robust error handling and logging
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new Exception($"User registration failed: {errors}");
            }

            // Optionally, you might want to assign roles or perform other actions here.
            // For now, we'll just return Unit.Value to indicate success.

            return Unit.Value;
        }
    }
}