using PSI_2020_backend.Models.Database;
using PSI_2020_backend.Models.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PSI_2020_backend.Services.Interface
{
    public interface IDatabaseService
    {
        Task<List<EducationProgram>> GetEducationPrograms();
        Task<EducationProgram> GetEducationProgram(Guid id);
        Task<bool> CreateEducationProgram(EducationProgramDTO educationProgramDTO);
        Task<EducationProgram> UpdateEducationProgram(Guid id, EducationProgramDTO educationProgramDTO, string modifiedBy);
        Task<List<Employee>> GetEmployees();
        Task<bool> CreateEmployee(string name);
    }
}
