using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Uttambsolutionslimitedstaffs.Helpers;
using Uttambsolutionslimitedstaffs.Models;

namespace Uttambsolutionslimitedstaffs.DataContext
{
    public class UttambsolutionslimitedstaffDbContext : DbContext
    {
        public UttambsolutionslimitedstaffDbContext(DbContextOptions<UttambsolutionslimitedstaffDbContext> dbContextOptions) : base(dbContextOptions)
        {
            try
            {
                var databaseCreator = Database.GetService<IDatabaseCreator>() as RelationalDatabaseCreator;
                if (databaseCreator != null)
                {
                    if (!databaseCreator.CanConnect()) databaseCreator.Create();
                    if (!databaseCreator.HasTables()) databaseCreator.CreateTables();

                    // Seed the database with default data after tables are created
                    SeedData();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        // DbSets for the entities
        public DbSet<Uttambsolutionslimitedpermission> Uttambsolutionslimitedpermissions { get; set; }
        public DbSet<Uttambsolutionslimitedrole> Uttambsolutionslimitedroles { get; set; }
        public DbSet<Uttambsolutionslimitedrolepermission> Uttambsolutionslimitedrolepermissions { get; set; }
        public DbSet<Uttambsolutionslimitedstaff> Uttambsolutionslimitedstaffs { get; set; }

        // Method to seed default roles, permissions, and staff
        private void SeedData()
        {
            if (!Uttambsolutionslimitedpermissions.Any())
            {
                // Add default permissions
                Uttambsolutionslimitedpermissions.Add(new Uttambsolutionslimitedpermission { Permissionname = "CAN_ACCESS_PORTAL", Permissionadmin = true, Isactive = true, Isdeleted = false });
                Uttambsolutionslimitedpermissions.Add(new Uttambsolutionslimitedpermission { Permissionname = "CAN_MANAGE_STAFFS", Permissionadmin = true, Isactive = true, Isdeleted = false });
                Uttambsolutionslimitedpermissions.Add(new Uttambsolutionslimitedpermission { Permissionname = "CAN_ADD_STAFFS", Permissionadmin = true, Isactive = true, Isdeleted = false });

                // Add other default permissions here
                SaveChanges();
            }

            if (!Uttambsolutionslimitedroles.Any())
            {
                // Add default roles
                var adminRole = new Uttambsolutionslimitedrole
                {
                    Rolename = "System Admin",
                    Roledescription = "Administrator role with full permissions",
                    Isdefault = true
                };
                var userRole = new Uttambsolutionslimitedrole
                {
                    Rolename = "Default User",
                    Roledescription = "Default role with partial permissions",
                    Isdefault = true
                };

                Uttambsolutionslimitedroles.Add(adminRole);
                Uttambsolutionslimitedroles.Add(userRole);
                SaveChanges();

                // Assign default permissions to roles
                var adminRoleId = adminRole.Roleid;
                var userRoleId = userRole.Roleid;

                var viewDashboardPermissionId = Uttambsolutionslimitedpermissions.First(p => p.Permissionname == "CAN_ACCESS_PORTAL").Permissionid;
                var editProfilePermissionId = Uttambsolutionslimitedpermissions.First(p => p.Permissionname == "CAN_MANAGE_STAFFS").Permissionid;

                Uttambsolutionslimitedrolepermissions.Add(new Uttambsolutionslimitedrolepermission
                {
                    Roleid = adminRoleId,
                    Permissionid = viewDashboardPermissionId
                });
                Uttambsolutionslimitedrolepermissions.Add(new Uttambsolutionslimitedrolepermission
                {
                    Roleid = adminRoleId,
                    Permissionid = editProfilePermissionId
                });
                Uttambsolutionslimitedrolepermissions.Add(new Uttambsolutionslimitedrolepermission
                {
                    Roleid = userRoleId,
                    Permissionid = viewDashboardPermissionId
                });
                SaveChanges();
            }

            if (!Uttambsolutionslimitedstaffs.Any())
            {
                Encryptdecrypt sec = new Encryptdecrypt();
                Stringgenerator str = new Stringgenerator();
                string Password = "K@ribun1";
                string Passwordhash = str.RandomString(12);
                // Add default staff
                Uttambsolutionslimitedstaffs.Add(new Uttambsolutionslimitedstaff
                {
                    Firstname = "Uttamb",
                    Lastname = "Solutions",
                    Emailaddress = "info@uttambsolutions.com",
                    Phonenumber = "0700000000",
                    Roleid = Uttambsolutionslimitedroles.First(r => r.Rolename == "System Admin").Roleid,
                    Passwords = sec.Encrypt(Password, Passwordhash),
                    Passwordhash = Passwordhash,
                    Loginstatus = 0,
                    Confirmemail = true,
                    Confirmphone = true,
                    Changepassword = false,
                    Lastpasswordchange = DateTime.UtcNow,
                    Isactive = true,
                    Isdeleted = false,
                    Isdefault = true,
                    Createdby = 0,
                    Modifiedby = 0,
                    Datecreated = DateTime.UtcNow,
                    Datemodified = DateTime.UtcNow
                });
                SaveChanges();
            }
        }
    }
}
