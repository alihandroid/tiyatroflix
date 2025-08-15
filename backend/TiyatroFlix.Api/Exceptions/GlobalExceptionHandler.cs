using System.Security.Authentication;
using System.Text.Json;

using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        var (statusCode, title, detail, logLevel) = GetExceptionDetails(exception, httpContext);

        var problemDetails = new ProblemDetails
        {
            Instance = httpContext.Request.Path,
            Title = title,
            Detail = detail,
            Status = statusCode,
            Type = $"https://httpstatuses.com/{statusCode}"
        };

        // Add correlation ID for debugging
        var correlationId = Guid.NewGuid().ToString();
        problemDetails.Extensions["correlationId"] = correlationId;

        // Log with structured data
        using (logger.BeginScope(new Dictionary<string, object>
        {
            ["CorrelationId"] = correlationId,
            ["StatusCode"] = statusCode,
            ["ExceptionType"] = exception.GetType().Name,
            ["RequestPath"] = httpContext.Request.Path.Value ?? string.Empty,
            ["Method"] = httpContext.Request.Method,
            ["UserAgent"] = httpContext.Request.Headers.UserAgent.ToString(),
            ["UserId"] = httpContext.User.FindFirst("uid")?.Value ?? string.Empty,
        }))
        {
            logger.Log(logLevel, exception, "Exception handled: {ExceptionType} - {Message}",
                exception.GetType().Name, exception.Message);
        }

        httpContext.Response.StatusCode = statusCode;
        httpContext.Response.ContentType = "application/json";

        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        await httpContext.Response.WriteAsync(JsonSerializer.Serialize(problemDetails, options), cancellationToken);

        return true;
    }

    private static (int StatusCode, string Title, string Detail, LogLevel LogLevel) GetExceptionDetails(Exception exception, HttpContext httpContext)
    {
        var isDevelopment = httpContext.RequestServices.GetRequiredService<IWebHostEnvironment>().IsDevelopment();

        return exception switch
        {
            ArgumentNullException => (400, "Bad Request", isDevelopment ? exception.Message : "Missing required parameters.", LogLevel.Warning),
            ArgumentException => (400, "Bad Request", isDevelopment ? exception.Message : "Invalid request parameters.", LogLevel.Warning),
            UnauthorizedAccessException => (401, "Unauthorized", "Access denied.", LogLevel.Warning),
            AuthenticationException => (401, "Authentication Failed", "Authentication is required.", LogLevel.Warning),
            KeyNotFoundException => (404, "Not Found", isDevelopment ? exception.Message : "The requested resource was not found.", LogLevel.Information),
            NotSupportedException => (405, "Method Not Allowed", isDevelopment ? exception.Message : "The requested operation is not supported.", LogLevel.Warning),
            InvalidOperationException => (409, "Conflict", isDevelopment ? exception.Message : "The operation cannot be completed due to a conflict.", LogLevel.Warning),
            TimeoutException => (408, "Request Timeout", "The request took too long to process.", LogLevel.Warning),
            _ => (500, "Internal Server Error", isDevelopment ? exception.Message : "An internal server error occurred.", LogLevel.Error)
        };
    }
}