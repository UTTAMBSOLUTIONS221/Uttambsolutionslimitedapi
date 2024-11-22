using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Uttambsolutionslimitedstaffs.Models;

namespace Uttambsolutionslimitedstaffs.DataContext
{
    public class UttambsolutionslimitedroleDbContext : DbContext
    {
        public UttambsolutionslimitedroleDbContext(DbContextOptions<UttambsolutionslimitedstaffDbContext> dbContextOptions) : base(dbContextOptions)
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

        public DbSet<Uttambsolutionslimitedrole> Uttambsolutionslimitedroles { get; set; }
    }
}
