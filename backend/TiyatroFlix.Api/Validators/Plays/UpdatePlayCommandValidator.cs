using FluentValidation;

using TiyatroFlix.Api.Commands.Plays;

namespace TiyatroFlix.Api.Validators.Plays;

public class UpdatePlayCommandValidator : AbstractValidator<UpdatePlayCommand>
{
    public UpdatePlayCommandValidator()
    {
        RuleFor(command => command.Id)
            .NotEmpty().WithMessage("Id is required.");

        RuleFor(command => command.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(200).WithMessage("Title must not exceed 200 characters.");

        RuleFor(command => command.Description)
            .NotEmpty().WithMessage("Description is required.")
            .MaximumLength(2000).WithMessage("Description must not exceed 2000 characters.");

        RuleFor(command => command.Director)
            .NotEmpty().WithMessage("Director is required.")
            .MaximumLength(100).WithMessage("Director must not exceed 100 characters.");

        RuleFor(command => command.PosterImageUrl)
            .NotEmpty().WithMessage("Poster image URL is required.")
            .MaximumLength(500).WithMessage("Poster image URL must not exceed 500 characters.");

        RuleFor(command => command.TrailerUrl)
            .MaximumLength(500).WithMessage("Trailer URL must not exceed 500 characters.");

        RuleFor(command => command.VideoUrl)
            .NotEmpty().WithMessage("Video URL is required.")
            .MaximumLength(500).WithMessage("Video URL must not exceed 500 characters.");
    }
}