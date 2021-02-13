using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace PSI_2020_authentication_mock.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Authentication : Controller
    {

        private readonly IOptions<List<PredefinedAccount>> _predefinedAccounts;
        public Authentication(IOptions<List<PredefinedAccount>> predefinedAccounts)
        {
            _predefinedAccounts = predefinedAccounts;
        }

        [HttpGet("test")]
        public async Task<IActionResult> Test()
        {
            return Ok("Authentication working!");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
        {
            var predefinedAccountsList = _predefinedAccounts.Value;
            for (int i = 0; i < predefinedAccountsList.Count; i++)
            {
                var account = predefinedAccountsList[i];
                if (account.Email == loginModel.Email)
                {
                    if(account.Password == loginModel.Password)
                    {
                        return Ok("ok");
                    }
                }
            }
            return Unauthorized("unauthorized");
        }
    }
}