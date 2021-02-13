using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PSI_2020_backend.Cache
{
    public interface IEmployeeCache
    {
        Task<List<string>> GetEmployeesAsync();
    }
}
