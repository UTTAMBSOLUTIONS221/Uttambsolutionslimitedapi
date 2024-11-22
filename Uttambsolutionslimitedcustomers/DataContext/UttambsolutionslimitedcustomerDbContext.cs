using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Uttambsolutionslimitedcustomers.Models;

namespace Uttambsolutionslimitedcustomers.DataContext
{
    public class UttambsolutionslimitedcustomerDbContext : DbContext
    {
        public UttambsolutionslimitedcustomerDbContext(DbContextOptions<UttambsolutionslimitedcustomerDbContext> dbContextOptions) : base(dbContextOptions)
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

        public DbSet<Uttambsolutionslimitedcustomer> Uttambsolutionslimitedcustomers { get; set; }
    }
}
