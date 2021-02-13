using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using PSI_2020_backend.Models;
using PSI_2020_backend.Models.Database;
using PSI_2020_backend.Services.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace PSI_2020_backend.Services.Implementation
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly IOptions<ExternalServices> _externalServices;
        private readonly IRequestService _requestService;
        public AuthenticationService(IOptions<ExternalServices> externalServices, IRequestService requestService)
        {
            _externalServices = externalServices;
            _requestService = requestService;
        }
        public async Task<DatabaseUser> GetAuthorizedUser(ClaimsPrincipal user, UserManager<DatabaseUser> userManager)
        {
            try
            {
                var identity = user?.Identity as ClaimsIdentity;
                var id = identity?.FindFirst(ClaimTypes.Name)?.Value;
                return await userManager.FindByIdAsync(id);
            }
            catch
            {
                return null;
            }
        }

        public async Task<bool> VerifyDataInAuthService(string login, string password)
        {
            var parameters = new Dictionary<string, string>
            {
                ["email"] = login,
                ["password"] = password
            };
            var response = await _requestService.SendPostRequest(_externalServices.Value.AuthServiceAddress + "/api/authentication/login", parameters);
            return response == "ok";
        }
    }
}
