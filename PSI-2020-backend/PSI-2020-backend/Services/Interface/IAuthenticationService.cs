using Microsoft.AspNetCore.Identity;
using PSI_2020_backend.Models.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace PSI_2020_backend.Services.Interface
{
    public interface IAuthenticationService
    {
        Task<DatabaseUser> GetAuthorizedUser(ClaimsPrincipal user, UserManager<DatabaseUser> userManager);
        Task<bool> VerifyDataInAuthService(string login, string password);
    }
}