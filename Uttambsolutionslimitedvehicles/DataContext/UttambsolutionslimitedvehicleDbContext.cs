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
                    if (!databaseCreator.CanConnect()) databaseCreator.Create();
                    if (!databaseCreator.HasTables()) databaseCreator.CreateTables();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        // DbSets for the entities
        public DbSet<Uttambsolutionslimitedvehiclemake> Uttambsolutionslimitedvehiclemakes { get; set; }
    }
}
