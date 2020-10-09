using iCollect.Entities;
using iCollect.Enums;
using iCollect.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace iCollect.Controllers
{

    [Route("api/Account"), Produces("application/json"), EnableCors("AppPolicy")]
    public class AccountController : Controller
    {
        private readonly IConfiguration _config;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        public AccountController(IConfiguration config,
                UserManager<IdentityUser> userManager,
                RoleManager<IdentityRole> roleManager,
                SignInManager<IdentityUser> signInManager)
        {
            _config = config;
            _signInManager = signInManager;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody]AuthenticateModel model)
        {
            try
            {
                //Sign user in with username and password from parameters. This code assumes that the emailaddress is being used as the username. 
                var result = await _signInManager.PasswordSignInAsync(model.Username, model.Password, false, false).ConfigureAwait(false);

                if (result.Succeeded)
                {
                    //var name = _signInManager.GetExternalLoginInfoAsync();
                    //Retrieve authenticated user's details
                    var user = await _userManager.FindByEmailAsync(model.Username).ConfigureAwait(false);
                    var test = _userManager.GetRolesAsync(user);
                    await _userManager.AddToRoleAsync(user, RoleNames.Admin).ConfigureAwait(false);
                    //Generate unique token with user's details
                    var tokenString = await GenerateJSONWebToken(user).ConfigureAwait(false);

                    //Return Ok with token string as content
                    return Ok(new { token = tokenString });
                }
                return Unauthorized();
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [Authorize]
        [HttpGet, Route("getroles/{username}")]
        public async Task<IActionResult> GetRoles(string username)
        {
            try
            {
                //Retrieve authenticated user's details
                var user = await _userManager.FindByEmailAsync(username).ConfigureAwait(false);
                var roles = await _userManager.GetRolesAsync(user).ConfigureAwait(false);

                return Ok(new { roles = roles });
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        private async Task<string> GenerateJSONWebToken(IdentityUser user)
        {
            //Hash Security Key Object from the JWT Key
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            //Generate list of claims with general and universally recommended claims
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id)
            };
            //Retreive roles for user and add them to the claims listing
            //var roles = await _userManager.GetRolesAsync(user);
            //claims.AddRange(roles.Select(r => new Claim(ClaimsIdentity.DefaultRoleClaimType, r)));
            //Generate final token adding Issuer and Subscriber data, claims, expriation time and Key
            var token = new JwtSecurityToken(_config["Jwt:Issuer"]
                , _config["Jwt:Issuer"],
                claims,
                null,
                expires: DateTime.Now.AddHours(12),
                signingCredentials: credentials
            );

            //Return token string
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [AllowAnonymous]
        [HttpGet, Route("logout")]
        public async Task<IActionResult> logout()
        {
            await _signInManager.SignOutAsync().ConfigureAwait(false);
            return new JsonResult(true);
        }

        [AllowAnonymous]
        [HttpGet, Route("register/{username}/{email}/{password}")]
        public async Task<IActionResult> register(string username, string email, string password)
        {
            var userIdentity = new IdentityUser()
            {
                UserName = username,
                Email = email
            };
            var result = await _userManager.CreateAsync(userIdentity, password).ConfigureAwait(false);

            if (result.Succeeded)
            {
                if (!await _roleManager.RoleExistsAsync(RoleNames.User).ConfigureAwait(false))
                {
                    await _roleManager.CreateAsync(new IdentityRole(RoleNames.User)).ConfigureAwait(false);
                }

                await _userManager.AddToRoleAsync(userIdentity, RoleNames.User).ConfigureAwait(false);
            }
            else
            {
                //error
            }

            return new JsonResult(new { result });
        }
    }
}
