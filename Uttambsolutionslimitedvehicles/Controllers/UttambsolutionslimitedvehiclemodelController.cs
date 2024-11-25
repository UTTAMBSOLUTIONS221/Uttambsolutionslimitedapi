using Microsoft.AspNetCore.Mvc;
using Uttambsolutionslimitedvehicles.DataContext;
using Uttambsolutionslimitedvehicles.Models;

namespace Uttambsolutionslimitedvehicles.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UttambsolutionslimitedvehiclemodelController : ControllerBase
    {
        private readonly UttambsolutionslimitedvehicleDbContext _vehicleDbContext;

        public UttambsolutionslimitedvehiclemodelController(UttambsolutionslimitedvehicleDbContext vehicleDbContext)
        {
            _vehicleDbContext = vehicleDbContext;
        }

        // Get all roles
        [HttpGet]
        public ActionResult<IEnumerable<Uttambsolutionslimitedvehiclemodel>> Get()
        {
            var vehicleModelsWithMake = _vehicleDbContext.Uttambsolutionslimitedvehiclemodels
        .Join(
            _vehicleDbContext.Uttambsolutionslimitedvehiclemakes,
            model => model.Vehiclemakeid, // Foreign key in the models table
            make => make.Vehiclemakeid,  // Primary key in the makes table
            (model, make) => new
            {
                ModelId = model.Vehiclemodelid,
                ModelName = model.Vehiclemodelname,
                MakeId = make.Vehiclemakeid,
                MakeName = make.Vehiclemakename
            }
        )
        .ToList();

            return Ok(vehicleModelsWithMake);
        }

        // Get a role by ID, including its associated permissions
        [HttpGet("{Vehiclemodelid:int}")]
        public async Task<ActionResult<Uttambsolutionslimitedvehiclemodel>> Get(int Vehiclemodelid)
        {
            var vehicleModel = await _vehicleDbContext.Uttambsolutionslimitedvehiclemodels.FindAsync(Vehiclemodelid);

            if (vehicleModel == null)
            {
                return NotFound();
            }

            return Ok(vehicleModel);
        }

        // Create a new model
        [HttpPost]
        public async Task<ActionResult> Create(Uttambsolutionslimitedvehiclemodel vehicleModel)
        {
            await _vehicleDbContext.Uttambsolutionslimitedvehiclemodels.AddAsync(vehicleModel);
            await _vehicleDbContext.SaveChangesAsync();
            return Ok();
        }

        // Update an existing model
        [HttpPut]
        public async Task<ActionResult> Update(Uttambsolutionslimitedvehiclemodel vehicleModel)
        {
            _vehicleDbContext.Uttambsolutionslimitedvehiclemodels.Update(vehicleModel);
            await _vehicleDbContext.SaveChangesAsync();
            return Ok();
        }

        // Delete a model 
        [HttpDelete("{Vehiclemodelid:int}")]
        public async Task<ActionResult> Delete(int Vehiclemodelid)
        {
            var vehicleModel = await _vehicleDbContext.Uttambsolutionslimitedvehiclemodels.FindAsync(Vehiclemodelid);
            if (vehicleModel == null)
            {
                return NotFound();
            }
            // Remove the model
            _vehicleDbContext.Uttambsolutionslimitedvehiclemodels.Remove(vehicleModel);
            await _vehicleDbContext.SaveChangesAsync();
            return NoContent();
        }
    }
}
