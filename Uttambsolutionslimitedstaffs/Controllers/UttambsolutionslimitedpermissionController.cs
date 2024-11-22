using Microsoft.AspNetCore.Mvc;
using Uttambsolutionslimitedstaffs.DataContext;
using Uttambsolutionslimitedstaffs.Models;

namespace Uttambsolutionslimitedstaffs.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UttambsolutionslimitedpermissionController : ControllerBase
    {
        private readonly UttambsolutionslimitedstaffDbContext _permissionDbContext;

        public UttambsolutionslimitedpermissionController(UttambsolutionslimitedstaffDbContext permissionDbContext)
        {
            _permissionDbContext = permissionDbContext;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Uttambsolutionslimitedpermission>> GetCustomers()
        {
            return _permissionDbContext.Uttambsolutionslimitedpermissions;
        }

        [HttpGet("{Permissionid:int}")]
        public async Task<ActionResult<Uttambsolutionslimitedpermission>> GetById(int Permissionid)
        {
            var permission = await _permissionDbContext.Uttambsolutionslimitedpermissions.FindAsync(Permissionid);
            return permission;
        }

        [HttpPost]
        public async Task<ActionResult> Create(Uttambsolutionslimitedpermission permission)
        {
            await _permissionDbContext.Uttambsolutionslimitedpermissions.AddAsync(permission);
            await _permissionDbContext.SaveChangesAsync();
            return Ok();
        }

        [HttpPut]
        public async Task<ActionResult> Update(Uttambsolutionslimitedpermission permission)
        {
            _permissionDbContext.Uttambsolutionslimitedpermissions.Update(permission);
            await _permissionDbContext.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{Permissionid:int}")]
        public async Task<ActionResult> Delete(int Permissionid)
        {
            var permission = await _permissionDbContext.Uttambsolutionslimitedpermissions.FindAsync(Permissionid);
            _permissionDbContext.Uttambsolutionslimitedpermissions.Remove(permission);
            await _permissionDbContext.SaveChangesAsync();
            return Ok();
        }
    }
}
