using FluentValidation;

using TiyatroFlix.Api.Commands.Plays;

namespace TiyatroFlix.Api.Validators.Plays;

public class DeletePlayCommandValidator : AbstractValidator<DeletePlayCommand>
{
    public DeletePlayCommandValidator()
    {
        RuleFor(command => command.Id)
            .NotEmpty().WithMessage("Id is required.");
    }
}