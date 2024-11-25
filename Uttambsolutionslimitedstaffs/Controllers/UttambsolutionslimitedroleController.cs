using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Uttambsolutionslimitedstaffs.DataContext;
using Uttambsolutionslimitedstaffs.Models;

namespace Uttambsolutionslimitedstaffs.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UttambsolutionslimitedroleController : ControllerBase
    {
        private readonly UttambsolutionslimitedstaffDbContext _roleDbContext;

        public UttambsolutionslimitedroleController(UttambsolutionslimitedstaffDbContext roleDbContext)
        {
            _roleDbContext = roleDbContext;
        }

        // Get all roles
        [HttpGet]
        public ActionResult<IEnumerable<Uttambsolutionslimitedrole>> GetRoles()
        {
            var roles = _roleDbContext.Uttambsolutionslimitedroles.Include(r => r.RolePermissions)
                                                                 .ThenInclude(rp => rp.Permission)
                                                                 .ToList();
            return Ok(roles);
        }

        // Get a role by ID, including its associated permissions
        [HttpGet("{Roleid:int}")]
        public async Task<ActionResult<Uttambsolutionslimitedrole>> GetRoleById(int Roleid)
        {
            var role = await _roleDbContext.Uttambsolutionslimitedroles
                                           .Include(r => r.RolePermissions)
                                           .ThenInclude(rp => rp.Permission)
                                           .FirstOrDefaultAsync(r => r.RoleId == Roleid);

            if (role == null)
            {
                return NotFound();
            }

            return Ok(role);
        }

        // Create a new role with associated permissions
        [HttpPost]
        public async Task<ActionResult> CreateRole(Uttambsolutionslimitedrole role)
        {
            // Add the role first
            await _roleDbContext.Uttambsolutionslimitedroles.AddAsync(role);
            await _roleDbContext.SaveChangesAsync();

            // Add the associated permissions
            if (role.PermissionIds != null && role.PermissionIds.Count > 0)
            {
                foreach (var permissionId in role.PermissionIds)
                {
                    _roleDbContext.RolePermissions.Add(new RolePermission
                    {
                        RoleId = role.RoleId,
                        PermissionId = permissionId
                    });
                }
                await _roleDbContext.SaveChangesAsync();
            }

            return CreatedAtAction(nameof(GetRoleById), new { Roleid = role.RoleId }, role);
        }

        // Update an existing role, including its permissions
        [HttpPut("{Roleid:int}")]
        public async Task<ActionResult> UpdateRole(int Roleid, Uttambsolutionslimitedrole role)
        {
            var existingRole = await _roleDbContext.Uttambsolutionslimitedroles
                                                    .Include(r => r.RolePermissions)
                                                    .FirstOrDefaultAsync(r => r.RoleId == Roleid);

            if (existingRole == null)
            {
                return NotFound();
            }

            // Update the role properties
            existingRole.RoleName = role.RoleName;
            _roleDbContext.Uttambsolutionslimitedroles.Update(existingRole);

            // Remove old permissions
            _roleDbContext.RolePermissions.RemoveRange(existingRole.RolePermissions);

            // Add new permissions
            if (role.PermissionIds != null && role.PermissionIds.Count > 0)
            {
                foreach (var permissionId in role.PermissionIds)
                {
                    _roleDbContext.RolePermissions.Add(new RolePermission
                    {
                        RoleId = existingRole.RoleId,
                        PermissionId = permissionId
                    });
                }
            }

            await _roleDbContext.SaveChangesAsync();

            return NoContent();
        }

        // Delete a role and its associated permissions
        [HttpDelete("{Roleid:int}")]
        public async Task<ActionResult> DeleteRole(int Roleid)
        {
            var role = await _roleDbContext.Uttambsolutionslimitedroles
                                           .Include(r => r.RolePermissions)
                                           .FirstOrDefaultAsync(r => r.RoleId == Roleid);

            if (role == null)
            {
                return NotFound();
            }

            // Remove the associated permissions
            _roleDbContext.RolePermissions.RemoveRange(role.RolePermissions);

            // Remove the role
            _roleDbContext.Uttambsolutionslimitedroles.Remove(role);
            await _roleDbContext.SaveChangesAsync();

            return NoContent();
        }
    }
}
