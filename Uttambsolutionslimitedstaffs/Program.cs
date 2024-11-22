using Microsoft.EntityFrameworkCore;
using Uttambsolutionslimitedstaffs.DataContext;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

/* Database Context Dependency Injection */
var dbHost = Environment.GetEnvironmentVariable("DB_HOST");
var dbName = Environment.GetEnvironmentVariable("DB_NAME");
var dbUsername = Environment.GetEnvironmentVariable("DB_SA_USERNAME");
var dbPassword = Environment.GetEnvironmentVariable("DB_SA_PASSWORD");
var connectionString = $"Data Source={dbHost};Initial Catalog={dbName};User ID={dbUsername};Password={dbPassword}";
builder.Services.AddDbContext<UttambsolutionslimitedpermissionDbContext>(opt => opt.UseSqlServer(connectionString));
builder.Services.AddDbContext<UttambsolutionslimitedroleDbContext>(opt => opt.UseSqlServer(connectionString));
builder.Services.AddDbContext<UttambsolutionslimitedstaffDbContext>(opt => opt.UseSqlServer(connectionString));
/* ===================================== */

var app = builder.Build();

// Configure the HTTP request pipeline.
// Enable Swagger
app.UseSwagger();
app.UseSwaggerUI();
app.UseAuthorization();

app.MapControllers();

app.Run();