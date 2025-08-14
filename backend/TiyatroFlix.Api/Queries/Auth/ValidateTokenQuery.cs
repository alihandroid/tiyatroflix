using MediatR;

using TiyatroFlix.Api.Models;

namespace TiyatroFlix.Api.Queries.Auth;

public record ValidateTokenQuery(string Authorization) : IRequest<ValidateResponse>;