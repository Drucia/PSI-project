using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using PSI_2020_backend.Cache;
using PSI_2020_backend.Models;
using PSI_2020_backend.Models.Database;
using PSI_2020_backend.Services.Interface;

namespace PSI_2020_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IAuthenticationService _authService;
        private readonly UserManager<DatabaseUser> _userManager;
        private readonly IOptions<List<PredefinedEmployee>> _predefinedEmployees;
        private readonly IDatabaseService _dbService;
        private readonly IEmployeeCache _employeeCache;

        public EmployeeController(IAuthenticationService authService, UserManager<DatabaseUser> userManager, IOptions<List<PredefinedEmployee>> predefinedEmployees,
            IDatabaseService dbService, IEmployeeCache employeeCache)
        {
            _authService = authService;
            _userManager = userManager;
            _predefinedEmployees = predefinedEmployees;
            _dbService = dbService;
            _employeeCache = employeeCache;
        }

        [HttpGet("")]
        [Authorize]
        public async Task<IActionResult> All()
        {
            var user = await _authService.GetAuthorizedUser(HttpContext.User, _userManager);
            if (!user.IsAdmin) return Unauthorized();
            if (user is null) return Unauthorized();

            var predefinedEmployeeList = _predefinedEmployees.Value.ToList();
            var employees = await _dbService.GetEmployees();
            foreach(var predefinedEmployee in predefinedEmployeeList)
            {
                if(employees.Select(emp => emp.Name == predefinedEmployee.Name).Count() == 0)
                {
                    await _dbService.CreateEmployee(predefinedEmployee.Name);
                }
            }

            return Ok(await _employeeCache.GetEmployeesAsync());
        }
    }
}