using Microsoft.AspNetCore.Mvc;
using Uttambsolutionslimitedcustomers.DataContext;
using Uttambsolutionslimitedcustomers.Models;

namespace Uttambsolutionslimitedcustomers.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UttambsolutionslimitedcustomerController : ControllerBase
    {
        private readonly UttambsolutionslimitedcustomerDbContext _customerDbContext;

        public UttambsolutionslimitedcustomerController(UttambsolutionslimitedcustomerDbContext customerDbContext)
        {
            _customerDbContext = customerDbContext;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Uttambsolutionslimitedcustomer>> GetCustomers()
        {
            return _customerDbContext.Uttambsolutionslimitedcustomers;
        }

        [HttpGet("{Customerid:int}")]
        public async Task<ActionResult<Uttambsolutionslimitedcustomer>> GetById(int Customerid)
        {
            var customer = await _customerDbContext.Uttambsolutionslimitedcustomers.FindAsync(Customerid);
            return customer;
        }

        [HttpPost]
        public async Task<ActionResult> Create(Uttambsolutionslimitedcustomer customer)
        {
            await _customerDbContext.Uttambsolutionslimitedcustomers.AddAsync(customer);
            await _customerDbContext.SaveChangesAsync();
            return Ok();
        }

        [HttpPut]
        public async Task<ActionResult> Update(Uttambsolutionslimitedcustomer customer)
        {
            _customerDbContext.Uttambsolutionslimitedcustomers.Update(customer);
            await _customerDbContext.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{Customerid:int}")]
        public async Task<ActionResult> Delete(int Customerid)
        {
            var customer = await _customerDbContext.Uttambsolutionslimitedcustomers.FindAsync(Customerid);
            _customerDbContext.Uttambsolutionslimitedcustomers.Remove(customer);
            await _customerDbContext.SaveChangesAsync();
            return Ok();
        }
    }
}
