using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

using Sentry;

public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        SentrySdk.ConfigureScope(scope =>
        {
            scope.SetTag("handler", "GlobalExceptionHandler");
            scope.SetExtra("requestPath", httpContext.Request.Path.Value);
            scope.SetExtra("method", httpContext.Request.Method);
            scope.SetExtra("userAgent", httpContext.Request.Headers.UserAgent.ToString());
        });

        SentrySdk.CaptureException(exception);

        var problemDetails = new ProblemDetails
        {
            Instance = httpContext.Request.Path,
            Title = "An error occurred",
            Detail = exception.Message,
            Status = httpContext.Response.StatusCode
        };

        logger.LogError(exception, "Unhandled exception occurred: {Message}", exception.Message);

        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken).ConfigureAwait(false);
        return true;
    }
}