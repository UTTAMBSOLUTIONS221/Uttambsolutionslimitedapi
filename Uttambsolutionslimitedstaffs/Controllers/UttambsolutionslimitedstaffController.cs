using Microsoft.AspNetCore.Mvc;
using Uttambsolutionslimitedstaffs.DataContext;
using Uttambsolutionslimitedstaffs.Models;

namespace Uttambsolutionslimitedstaffs.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UttambsolutionslimitedstaffController : ControllerBase
    {
        private readonly UttambsolutionslimitedstaffDbContext _staffDbContext;

        public UttambsolutionslimitedstaffController(UttambsolutionslimitedstaffDbContext staffDbContext)
        {
            _staffDbContext = staffDbContext;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Uttambsolutionslimitedstaff>> GetCustomers()
        {
            return _staffDbContext.Uttambsolutionslimitedstaffs;
        }

        [HttpGet("{Staffid:int}")]
        public async Task<ActionResult<Uttambsolutionslimitedstaff>> GetById(int Staffid)
        {
            var staff = await _staffDbContext.Uttambsolutionslimitedstaffs.FindAsync(Staffid);
            return staff;
        }

        [HttpPost]
        public async Task<ActionResult> Create(Uttambsolutionslimitedstaff staff)
        {
            await _staffDbContext.Uttambsolutionslimitedstaffs.AddAsync(staff);
            await _staffDbContext.SaveChangesAsync();
            return Ok();
        }

        [HttpPut]
        public async Task<ActionResult> Update(Uttambsolutionslimitedstaff staff)
        {
            _staffDbContext.Uttambsolutionslimitedstaffs.Update(staff);
            await _staffDbContext.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{Staffid:int}")]
        public async Task<ActionResult> Delete(int Staffid)
        {
            var staff = await _staffDbContext.Uttambsolutionslimitedstaffs.FindAsync(Staffid);
            _staffDbContext.Uttambsolutionslimitedstaffs.Remove(staff);
            await _staffDbContext.SaveChangesAsync();
            return Ok();
        }
    }
}
