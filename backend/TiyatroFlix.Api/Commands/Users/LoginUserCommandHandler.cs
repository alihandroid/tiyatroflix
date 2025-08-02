using MediatR;

using Microsoft.AspNetCore.Identity;

using TiyatroFlix.Domain.Entities;

namespace TiyatroFlix.Api.Commands.Users
{
    public class LoginUserCommandHandler : IRequestHandler<LoginUserCommand, string> // Consider returning a token or success status
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;

        public LoginUserCommandHandler(SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
        }

        public async Task<string> Handle(LoginUserCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                // User not found
                throw new Exception("Invalid login attempt.");
            }

            var result = await _signInManager.PasswordSignInAsync(user, request.Password, isPersistent: false, lockoutOnFailure: false);

            if (!result.Succeeded)
            {
                // Handle login failure (e.g., incorrect password)
                throw new Exception("Invalid login attempt.");
            }

            // TODO: Add logic to generate and return a token or access token
            return "Token";
        }
    }
}