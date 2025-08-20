using System.ComponentModel.DataAnnotations;

namespace TiyatroFlix.Api.Models;

public record CreatePlayRequest(
    [Required] string Title,
    [Required] string Description,
    [Required] string PosterImageUrl,
    [Required] string TrailerUrl,
    [Required] string VideoUrl
);

public record UpdatePlayRequest(
    [Required] string Title,
    [Required] string Description,
    [Required] string PosterImageUrl,
    [Required] string TrailerUrl,
    [Required] string VideoUrl
);