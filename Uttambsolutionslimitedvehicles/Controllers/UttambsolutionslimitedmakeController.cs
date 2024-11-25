using Microsoft.AspNetCore.Mvc;
using Uttambsolutionslimitedvehicles.DataContext;
using Uttambsolutionslimitedvehicles.Models;

namespace Uttambsolutionslimitedvehicles.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UttambsolutionslimitedmakeController : ControllerBase
    {
        private readonly UttambsolutionslimitedvehicleDbContext _vehiclMakeDbContext;

        public UttambsolutionslimitedmakeController(UttambsolutionslimitedvehicleDbContext vehiclMakeDbContext)
        {
            _vehiclMakeDbContext = vehiclMakeDbContext;
        }

        // Get all roles
        [HttpGet]
        public ActionResult<IEnumerable<Uttambsolutionslimitedvehiclemake>> Get()
        {
            var vehicleMakes = _vehiclMakeDbContext.Uttambsolutionslimitedvehiclemakes;
            return Ok(vehicleMakes);
        }

        // Get a role by ID, including its associated permissions
        [HttpGet("{Vehiclemakeid:int}")]
        public async Task<ActionResult<Uttambsolutionslimitedvehiclemake>> Get(int Vehiclemakeid)
        {
            var vehicleMake = await _vehiclMakeDbContext.Uttambsolutionslimitedvehiclemakes.FindAsync(Vehiclemakeid);

            if (vehicleMake == null)
            {
                return NotFound();
            }

            return Ok(vehicleMake);
        }

        // Create a new role with associated permissions
        [HttpPost]
        public async Task<ActionResult> Create(Uttambsolutionslimitedvehiclemake vehicleMake)
        {
            // Add the role first
            await _vehiclMakeDbContext.Uttambsolutionslimitedvehiclemakes.AddAsync(vehicleMake);
            await _vehiclMakeDbContext.SaveChangesAsync();
            return Ok();
        }

        // Update an existing role, including its permissions
        [HttpPut]
        public async Task<ActionResult> Update(Uttambsolutionslimitedvehiclemake vehicleMake)
        {
            _vehiclMakeDbContext.Uttambsolutionslimitedvehiclemakes.Update(vehicleMake);
            await _vehiclMakeDbContext.SaveChangesAsync();
            return Ok();
        }

        // Delete a role and its associated permissions
        [HttpDelete("{Vehiclemakeid:int}")]
        public async Task<ActionResult> Delete(int Vehiclemakeid)
        {
            var vehicleMake = await _vehiclMakeDbContext.Uttambsolutionslimitedvehiclemakes.FindAsync(Vehiclemakeid);
            if (vehicleMake == null)
            {
                return NotFound();
            }
            // Remove the role
            _vehiclMakeDbContext.Uttambsolutionslimitedvehiclemakes.Remove(vehicleMake);
            await _vehiclMakeDbContext.SaveChangesAsync();
            return NoContent();
        }
    }
}
