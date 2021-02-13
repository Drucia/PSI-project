using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PSI_2020_backend.Models;
using Microsoft.AspNetCore.Identity;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using PSI_2020_backend.Models.Database;
using Microsoft.AspNetCore.Authorization;
using PSI_2020_backend.Services.Interface;

namespace PSI_2020_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<DatabaseUser> _userManager;
        private readonly IOptions<Models.AuthorizationOptions> _authOptions;
        private readonly IOptions<List<PredefinedAccount>> _predefinedAccounts;
        private readonly IAuthenticationService _authService;

        public UserController(UserManager<DatabaseUser> userManager, IOptions<Models.AuthorizationOptions> authOptions, IOptions<List<PredefinedAccount>> predefinedAccounts,
            IAuthenticationService authService)
        {
            _userManager = userManager;
            _authOptions = authOptions;
            _predefinedAccounts = predefinedAccounts;
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
        {
            var user = await _userManager.FindByEmailAsync(loginModel.Email);

            if(user == null)
            {
                var predefinedAccountsList = _predefinedAccounts.Value;
                for(int i = 0; i < predefinedAccountsList.Count; i++)
                {
                    var account = predefinedAccountsList[i];
                    if(account.Email == loginModel.Email)
                    {
                        var status = await CreateUser(account.Email, "PasswordM0ck!", account.IsAdmin);
                        if(status)
                        {
                            user = await _userManager.FindByEmailAsync(loginModel.Email);
                        }
                        break;
                    }
                }
            }

            if (user == null || !await _authService.VerifyDataInAuthService(loginModel.Email, loginModel.Password))
                return Unauthorized();

            var roles = await _userManager.GetRolesAsync(user);
            var token = MakeToken(user, roles);
            return Ok(MakeUserCredentials(token, user));
        }

        [HttpGet("verify")]
        [Authorize]
        public async Task<IActionResult> Verify()
        {
            return Ok();
        }

        private JwtSecurityToken MakeToken(DatabaseUser user, IList<string> roles)
        {
            var claims = MakeClaims(user, roles);
            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_authOptions.Value.Secret));

            return new JwtSecurityToken(
                expires: DateTime.UtcNow.AddMinutes(_authOptions.Value.Expiration),
                claims: claims,
                signingCredentials: new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256));

        }

        private static IEnumerable<Claim> MakeClaims(DatabaseUser user, IList<string> roles)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Id),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };
            AddRoles(claims, roles);
            return claims;
        }

        public static void AddRoles(List<Claim> claims, IList<string> roles)
            => claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));


        private static UserCredentialsModel MakeUserCredentials(SecurityToken token, DatabaseUser user)
        {
            return new UserCredentialsModel()
            {
                AccessToken = new JwtSecurityTokenHandler().WriteToken(token),
                Name = user.Name,
                Email = user.Email,
                IsAdmin = user.IsAdmin
            };
        }

        private async Task<bool> CreateUser(string email, string password, bool isAdmin)
        {
            var name = $"epc{DateTime.Now:yyyyMMddHHmmssfff}{new Random().Next(1000)}";
            var newUser = new DatabaseUser()
            {
                Name = name,
                UserName = name,
                Email = email,
                IsAdmin = isAdmin
            };

            var result = await _userManager.CreateAsync(newUser, password);

            if (result.Succeeded) return true;
            return false;
        }
    }
}
