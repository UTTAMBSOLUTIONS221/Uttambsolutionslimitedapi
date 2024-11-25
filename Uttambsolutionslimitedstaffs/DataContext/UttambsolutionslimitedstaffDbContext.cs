using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Uttambsolutionslimitedstaffs.Models;

namespace Uttambsolutionslimitedstaffs.DataContext
{
    public class UttambsolutionslimitedstaffDbContext : DbContext
    {
        public UttambsolutionslimitedstaffDbContext(DbContextOptions<UttambsolutionslimitedstaffDbContext> dbContextOptions)
            : base(dbContextOptions)
        {
            try
            {
                // Automatically apply migrations if necessary
                var databaseCreator = Database.GetService<IDatabaseCreator>() as RelationalDatabaseCreator;

                if (databaseCreator != null)
                {
                    // Apply any pending migrations, which will update the database schema to match the model
                    if (!databaseCreator.CanConnect())
                    {
                        Console.WriteLine("Database connection could not be established.");
                    }
                    else
                    {
                        // Apply migrations to ensure the database schema is up-to-date
                        Database.Migrate();
                    }
                }
            }
            catch (Exception ex)
            {
                // You may want to log this exception in a production environment
                Console.WriteLine($"Error occurred while initializing the database: {ex.Message}");
                throw; // Re-throw to ensure the exception is not swallowed
            }
        }

        // DbSets for the entities
        public DbSet<Uttambsolutionslimitedpermission> Uttambsolutionslimitedpermissions { get; set; }
        public DbSet<Uttambsolutionslimitedrole> Uttambsolutionslimitedroles { get; set; }
        public DbSet<Uttambsolutionslimitedrolepermission> Uttambsolutionslimitedrolepermissions { get; set; }
        public DbSet<Uttambsolutionslimitedstaff> Uttambsolutionslimitedstaffs { get; set; }

        // Configure relationships using Fluent API if needed
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // You can define your entity relationships here
            modelBuilder.Entity<Uttambsolutionslimitedrolepermission>()
                .HasKey(rp => new { rp.Roleid, rp.Permissionid });

            modelBuilder.Entity<Uttambsolutionslimitedrolepermission>()
                .HasOne(rp => rp.Role)
                .WithMany(r => r.Rolepermissions)
                .HasForeignKey(rp => rp.Roleid);

            modelBuilder.Entity<Uttambsolutionslimitedrolepermission>()
                .HasOne(rp => rp.Permission)
                .WithMany()
                .HasForeignKey(rp => rp.Permissionid);

            // Add any additional configuration for the tables here
            modelBuilder.Entity<Uttambsolutionslimitedrole>()
                .ToTable("Uttambsolutionslimitedrole", schema: "dbo");

            modelBuilder.Entity<Uttambsolutionslimitedrolepermission>()
                .ToTable("Uttambsolutionslimitedrolepermission", schema: "dbo");

            modelBuilder.Entity<Uttambsolutionslimitedpermission>()
                .ToTable("Uttambsolutionslimitedpermission", schema: "dbo");

            modelBuilder.Entity<Uttambsolutionslimitedstaff>()
                .ToTable("Uttambsolutionslimitedstaff", schema: "dbo");
        }
    }
}
