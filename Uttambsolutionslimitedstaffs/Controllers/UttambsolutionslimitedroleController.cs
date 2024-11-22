using Microsoft.AspNetCore.Mvc;
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

        [HttpGet]
        public ActionResult<IEnumerable<Uttambsolutionslimitedrole>> GetCustomers()
        {
            return _roleDbContext.Uttambsolutionslimitedroles;
        }

        [HttpGet("{Roleid:int}")]
        public async Task<ActionResult<Uttambsolutionslimitedrole>> GetById(int Roleid)
        {
            var role = await _roleDbContext.Uttambsolutionslimitedroles.FindAsync(Roleid);
            return role;
        }

        [HttpPost]
        public async Task<ActionResult> Create(Uttambsolutionslimitedrole permission)
        {
            await _roleDbContext.Uttambsolutionslimitedroles.AddAsync(permission);
            await _roleDbContext.SaveChangesAsync();
            return Ok();
        }

        [HttpPut]
        public async Task<ActionResult> Update(Uttambsolutionslimitedrole permission)
        {
            _roleDbContext.Uttambsolutionslimitedroles.Update(permission);
            await _roleDbContext.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{Roleid:int}")]
        public async Task<ActionResult> Delete(int Roleid)
        {
            var role = await _roleDbContext.Uttambsolutionslimitedroles.FindAsync(Roleid);
            _roleDbContext.Uttambsolutionslimitedroles.Remove(role);
            await _roleDbContext.SaveChangesAsync();
            return Ok();
        }
    }
}
