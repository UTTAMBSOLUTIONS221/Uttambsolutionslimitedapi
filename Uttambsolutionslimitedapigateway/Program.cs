using Ocelot.DependencyInjection;
using Ocelot.Middleware;
var builder = WebApplication.CreateBuilder(args);

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Replace with your frontend's origin
              .AllowAnyHeader()                    // Allow all headers
              .AllowAnyMethod()                   // Allow all HTTP methods
              .AllowCredentials();               // Optional                 
    });
});

builder.Configuration.SetBasePath(builder.Environment.ContentRootPath)
    .AddJsonFile("uttambsolutionslimitedocelot.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();
builder.Services.AddOcelot(builder.Configuration);
var app = builder.Build();

// Use Ocelot
app.UseRouting();

// Enable the CORS policy
app.UseCors("AllowSpecificOrigin");
app.UseOcelot().Wait();

app.Run();