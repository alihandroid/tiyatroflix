using Microsoft.EntityFrameworkCore;
using TiyatroFlix.Infrastructure.Data;
using TiyatroFlix.Infrastructure.Persistence;
using TiyatroFlix.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure Entity Framework with SQLite
builder.Services.AddDbContext<TiyatroFlixDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register MediatR
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblyContaining<Program>());

var app = builder.Build();

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
app.MapPlayEndpoints();

// Seed the database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        PlaySeeder.Seed(services);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred seeding the DB.");
    }
}

app.Run();