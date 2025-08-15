using System.Text;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

using TiyatroFlix.Api.Endpoints;
using TiyatroFlix.Api.Services;
using TiyatroFlix.Domain.Entities;
using TiyatroFlix.Infrastructure.Data;
using TiyatroFlix.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables();

// Configure Sentry
builder.WebHost.UseSentry(options =>
{
    options.Dsn = builder.Configuration["Sentry:Dsn"];
    options.TracesSampleRate = 1.0;
    options.Environment = builder.Environment.EnvironmentName;
    options.Debug = builder.Environment.IsDevelopment();
    options.SendDefaultPii = false;
    options.CaptureFailedRequests = true;
});

builder.Logging.AddSentry();

// Add services to the container.
builder.Services.AddCors();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SupportNonNullableReferenceTypes();

    // Add JWT bearer auth support
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your valid token.\n\nExample: \"Bearer eyJhbGciOiJI...\""
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Configure Entity Framework with SQLite
builder.Services.AddDbContext<TiyatroFlixDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure Identity Services
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<TiyatroFlixDbContext>();

// Configure JWT Authentication
builder.Services.Configure<JwtOptions>(
    builder.Configuration.GetSection("JwtSettings"));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
        ValidAudience = builder.Configuration["JwtSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Secret"] ?? throw new InvalidOperationException("JwtSettings:Secret is missing")))
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy =>
        policy.RequireRole("Admin"));
});

// Register TokenService
builder.Services.AddScoped<ITokenService, TokenService>();


// Add exception handling
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

var app = builder.Build();

app.UseSentryTracing();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
// TODO: Remove after the prototype is done
app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());

// Register modular endpoints
app.UseAuthentication();
app.UseAuthorization();

// Map endpoints
app.MapPlayEndpoints();
app.MapUserEndpoints();
app.MapAuthEndpoints();

// Register global exception handler
app.UseExceptionHandler();

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
var logger = app.Services.GetRequiredService<ILogger<Program>>();

// Ensure database is created and migrations are applied
try
{
    logger.LogInformation("Applying database migrations...");
    var context = services.GetRequiredService<TiyatroFlixDbContext>();
    context.Database.Migrate();
    logger.LogInformation("Database migrations applied successfully");

    // Seed the database after migration
    logger.LogInformation("Seeding database...");
    PlaySeeder.Seed(services);
    AdminRoleMigration.SeedAdminRole(services);
    logger.LogInformation("Database seeding completed successfully");
}
catch (Exception ex)
{
    logger.LogError(ex, "An error occurred during database initialization or seeding.");
    throw;
}

// Start the application
try
{
    logger.LogInformation("Starting TiyatroFlix API with Sentry observability");
    app.Run();
}
catch (Exception ex)
{
    logger.LogCritical(ex, "Application terminated unexpectedly");
    throw;
}
