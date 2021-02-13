using PSI_2020_backend.Models.Database;
using PSI_2020_backend.Services.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PSI_2020_backend.Cache
{
    public class EmployeeCache : IEmployeeCache
    {
        private List<Employee> EmployeeList;
        private readonly IDatabaseService _dbService;
        public EmployeeCache(IDatabaseService dbService)
        {
            _dbService = dbService;
        }

        public async Task<List<string>> GetEmployeesAsync()
        {
            if(EmployeeList == null)
            {
                EmployeeList = await _dbService.GetEmployees();
            }
            return EmployeeList.Select(emp => emp.Name).ToList();
        }
    }
}
