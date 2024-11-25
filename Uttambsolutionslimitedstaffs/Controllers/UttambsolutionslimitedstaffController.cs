using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Uttambsolutionslimitedstaffs.DataContext;
using Uttambsolutionslimitedstaffs.Entities;
using Uttambsolutionslimitedstaffs.Helpers;
using Uttambsolutionslimitedstaffs.Models;

namespace Uttambsolutionslimitedstaffs.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UttambsolutionslimitedstaffController : ControllerBase
    {
        private readonly UttambsolutionslimitedstaffDbContext _staffDbContext;
        public const string JWT_SECURITY_KEY = "Yh2k7QSu4l8CZg5p6X3Pna9L0Miy4D3Bvt0JVr87UcOj69Kwq5R2Nmf4FWs03Hdx";
        private const int JWT_TOKEN_VALIDITY_MINS = 30;
        public UttambsolutionslimitedstaffController(UttambsolutionslimitedstaffDbContext staffDbContext)
        {
            _staffDbContext = staffDbContext;
        }
        [HttpPost("Staffauthenticate")]
        public async Task<ActionResult<Uttambsolutionsstaffresponce>> Authenticate([FromBody] Uttambsolurionsstaffauth userdata)
        {
            // Initialize the response object
            Uttambsolutionsstaffresponce authenticationResponse = new Uttambsolutionsstaffresponce();

            // Fetch the data asynchronously from the database
            var staffData = await _staffDbContext.Uttambsolutionslimitedstaffs
                .FirstOrDefaultAsync(staff => staff.Emailaddress == userdata.Username);

            // Check if the staff exists
            if (staffData != null)
            {
                Encryptdecrypt sec = new Encryptdecrypt();
                // Verify password (assuming password is stored hashed)
                if (userdata.Password == sec.Decrypt(staffData.Passwords, staffData.Passwordhash))
                {
                    // Populate response object with successful authentication details
                    authenticationResponse.Token = "";
                    var Tokenexpirytimestamp = DateTime.Now.AddMinutes(JWT_TOKEN_VALIDITY_MINS);
                    var Tokenkey = Encoding.ASCII.GetBytes(JWT_SECURITY_KEY);
                    var Claimidentity = new ClaimsIdentity(new List<Claim>
                        {
                            new Claim(JwtRegisteredClaimNames.Name,staffData.Firstname+" "+staffData.Lastname),
                            new Claim(ClaimTypes.Role,"")
                        });
                    var Signingcredentials = new SigningCredentials(
                        new SymmetricSecurityKey(Tokenkey),
                        SecurityAlgorithms.HmacSha256Signature
                        );
                    var Securitytokendescriptor = new SecurityTokenDescriptor
                    {
                        Subject = Claimidentity,
                        Expires = Tokenexpirytimestamp,
                        SigningCredentials = Signingcredentials
                    };
                    var Jwtsecuritytokenhandler = new JwtSecurityTokenHandler();
                    var Securitytoken = Jwtsecuritytokenhandler.CreateToken(Securitytokendescriptor);
                    var Token = Jwtsecuritytokenhandler.WriteToken(Securitytoken);
                    authenticationResponse = new Uttambsolutionsstaffresponce
                    {
                        RespStatus = 0,
                        RespMessage = "Ok",
                        Token = Token,
                        Expiresin = (int)Tokenexpirytimestamp.Subtract(DateTime.Now).TotalSeconds,
                        Usermodel = new Usermodeldataresponce
                        {
                            Loginid = staffData.Staffid,
                            Fullname = staffData.Firstname + " " + staffData.Lastname,
                            Phonenumber = staffData.Phonenumber,
                            Emailaddress = staffData.Emailaddress,
                            Roleid = staffData.Roleid
                        }
                    };
                }
                else
                {
                    // Populate response with failed authentication details
                    authenticationResponse.RespStatus = 1;
                    authenticationResponse.RespMessage = "Invalid password.";
                }
            }
            else
            {
                // Handle case where user does not exist
                authenticationResponse.RespStatus = 1;
                authenticationResponse.RespMessage = "User not found.";
            }

            // Return the response object
            return Ok(authenticationResponse);
        }

        [HttpGet]
        public ActionResult<IEnumerable<Uttambsolutionslimitedstaff>> Get()
        {
            var staffWithRoles = _staffDbContext.Uttambsolutionslimitedstaffs
        .Join(
            _staffDbContext.Set<Uttambsolutionslimitedrole>(),
            staff => staff.Roleid,
            role => role.Roleid,
            (staff, role) => new
            {
                Staffid = staff.Staffid,
                Firstname = staff.Firstname,
                Lastname = staff.Lastname,
                Emailaddress = staff.Emailaddress,
                Phonenumber = staff.Phonenumber,
                Roleid = role.Roleid,
                Rolename = role.Rolename
            }
        )
        .Where(staff => staff.Rolename != null) // Example condition
        .ToList();

            return Ok(staffWithRoles);
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
            try
            {
                // Initialize helper classes
                Encryptdecrypt sec = new Encryptdecrypt();
                Stringgenerator str = new Stringgenerator();
                string Passwordhash = str.RandomString(12);

                // Set default RoleId if not provided
                if (staff.Roleid == 0 || staff.Roleid == null)
                {
                    staff.Roleid = 1;
                }

                // Generate and encrypt password
                if (string.IsNullOrEmpty(staff.Passwords))
                {
                    string Password = str.RandomString(8);
                    staff.Passwordhash = Passwordhash;
                    staff.Passwords = sec.Encrypt(Password, Passwordhash);
                }
                else
                {
                    staff.Passwordhash = Passwordhash;
                    staff.Passwords = sec.Encrypt(staff.Passwords, Passwordhash);
                }

                // Save the new staff member to the database
                await _staffDbContext.Uttambsolutionslimitedstaffs.AddAsync(staff);
                await _staffDbContext.SaveChangesAsync();

                // Retrieve all staff data
                var allStaff = await _staffDbContext.Uttambsolutionslimitedstaffs.ToListAsync();

                // Send an email to the newly created staff
                await SendEmailNotificationAsync(staff);

                // Return all staff data as response
                return Ok(allStaff);
            }
            catch (Exception ex)
            {
                // Handle exceptions and return a meaningful error
                return BadRequest(new { message = "An error occurred while creating the staff.", error = ex.Message });
            }
        }

        // Helper method to send email notification
        private async Task SendEmailNotificationAsync(Uttambsolutionslimitedstaff staff)
        {
            try
            {
                Encryptdecrypt sec = new Encryptdecrypt();
                // Example email content
                string subject = "Welcome to Uttamb Solutions";
                string body = $@"
            <p>Dear {staff.Firstname} {staff.Lastname},</p>
            <p>Welcome to Uttamb Solutions! Your account has been created successfully.</p>
            <p><strong>Login Details:</strong></p>
            <ul>
                <li>Email: {staff.Emailaddress}</li>
                <li>Password: {sec.Decrypt(staff.Passwords, staff.Passwordhash)}</li> <!-- Use original password before encryption -->
            </ul>
            <p>We recommend changing your password upon first login.</p>
            <p>Best Regards,</p>
            <p>Uttamb Solutions Team</p>";

                // Configure and send the email
                EmailSenderHelper emailService = new EmailSenderHelper(); // Assume you have an EmailService class
                bool data = emailService.UttambsolutionssendemailAsync(staff.Emailaddress, subject, body, true, "", "", "");
            }
            catch (Exception ex)
            {
                // Log the exception for debugging purposes
                Console.WriteLine($"Failed to send email to {staff.Emailaddress}. Error: {ex.Message}");
            }
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
