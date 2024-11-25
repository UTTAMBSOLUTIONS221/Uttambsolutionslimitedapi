using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Uttambsolutionslimitedvehicles.Models;

namespace Uttambsolutionslimitedvehicles.DataContext
{
    public class UttambsolutionslimitedvehicleDbContext : DbContext
    {
        public UttambsolutionslimitedvehicleDbContext(DbContextOptions<UttambsolutionslimitedvehicleDbContext> dbContextOptions) : base(dbContextOptions)
        {
            try
            {
                var databaseCreator = Database.GetService<IDatabaseCreator>() as RelationalDatabaseCreator;
                if (databaseCreator != null)
                {
                    // Check if the database can connect, and create it if it doesn't exist
                    if (!databaseCreator.CanConnect())
                    {
                        databaseCreator.Create();
                        Console.WriteLine("Database created successfully.");
                    }

                    // Check if the database has tables, and create them if they don't exist
                    if (!databaseCreator.HasTables())
                    {
                        databaseCreator.CreateTables();
                        Console.WriteLine("All tables created successfully.");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during database initialization: {ex.Message}");
            }
        }

        // DbSets for the entities
        public DbSet<Uttambsolutionslimitedvehiclemake> Uttambsolutionslimitedvehiclemakes { get; set; }
        public DbSet<Uttambsolutionslimitedvehiclemodel> Uttambsolutionslimitedvehiclemodels { get; set; }
    }
}