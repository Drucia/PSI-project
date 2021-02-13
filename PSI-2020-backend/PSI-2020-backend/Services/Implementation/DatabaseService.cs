using Microsoft.EntityFrameworkCore;
using PSI_2020_backend.Models.Database;
using PSI_2020_backend.Models.DTO;
using PSI_2020_backend.Services.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PSI_2020_backend.Services.Implementation
{
    public class DatabaseService : IDatabaseService
    {
        private readonly DatabaseContext _dbContext;
        private readonly IDTOMappingService _dtoMappingService;
        private readonly IStorageService _storageService;
        public DatabaseService(DatabaseContext dbContext, IDTOMappingService dtoMappingService, IStorageService storageService)
        {
            _dbContext = dbContext;
            _dtoMappingService = dtoMappingService;
            _storageService = storageService;
        }

        public async Task<List<EducationProgram>> GetHistoricalEducationPrograms()
        {
            return _dbContext.EducationPrograms
                .Include(x => x.Field)
                    .ThenInclude(f => f.Specializations)
                .Include(x => x.Specialization)
                .Include(x => x.Courses)
                    .ThenInclude(c => c.SubjectCard)
                        .ThenInclude(sc => sc.Exercises)
                .Include(x => x.Courses)
                    .ThenInclude(c => c.SubjectCard)
                        .ThenInclude(sc => sc.Seminaries)
                .Include(x => x.Courses)
                    .ThenInclude(c => c.SubjectCard)
                        .ThenInclude(sc => sc.Projects)
                .Include(x => x.Courses)
                    .ThenInclude(c => c.SubjectCard)
                        .ThenInclude(sc => sc.Laboratories)
                .Include(x => x.Courses)
                    .ThenInclude(c => c.SubjectCard)
                        .ThenInclude(sc => sc.Lectures)
                .Include(x => x.Courses)
                    .ThenInclude(c => c.SubjectCard)
                        .ThenInclude(sc => sc.LearningEffects)
                .ToList();
        }

        public async Task<List<EducationProgram>> GetEducationPrograms()
        {

            return (await GetHistoricalEducationPrograms())
                .Where(ep => !ep.IsHistorical).ToList();
        }

        public async Task<EducationProgram> GetEducationProgram(Guid id)
        {
            return (await GetHistoricalEducationPrograms())
                .Where(ep => ep.Id == id).FirstOrDefault();
        }

        public async Task<bool> CreateEducationProgram(EducationProgramDTO educationProgramDTO)
        {
            var educationProgram = MapEducationDTOToDatabaseObject(educationProgramDTO, "");
            if (educationProgramDTO.Id != null)
            {
                educationProgram.Id = educationProgramDTO.Id;
            }

            var status = await _storageService.UploadEducationProgram(educationProgram);
            if (status)
            {
                _dbContext.EducationPrograms.Add(educationProgram);
                _dbContext.SaveChanges();
                return true;
            }
            return false;
        }

        public async Task<EducationProgram> UpdateEducationProgram(Guid id, EducationProgramDTO educationProgramDTO, string modifiedBy)
        {
            var educationProgram = await GetEducationProgram(id);
            if(educationProgram != null)
            {
                var newEducationProgram = MapEducationDTOToDatabaseObject(educationProgramDTO, modifiedBy);
                var status = await _storageService.UploadEducationProgram(newEducationProgram);
                if (status)
                {
                    educationProgram.IsHistorical = true;
                    _dbContext.Update(educationProgram);
                    _dbContext.SaveChanges();

                    _dbContext.EducationPrograms.Add(newEducationProgram);
                    _dbContext.SaveChanges();

                    return newEducationProgram;
                }
            }
            return null;
        }

        public EducationProgram MapEducationDTOToDatabaseObject(EducationProgramDTO educationProgramDTO, string modifiedBy)
        {
            return new EducationProgram()
            {
                Year = educationProgramDTO.Year,
                IsWIP = educationProgramDTO.IsWIP,
                Degree = educationProgramDTO.Degree,
                Term = educationProgramDTO.Term,
                Field = educationProgramDTO.Field != null ? _dtoMappingService.MapToField(educationProgramDTO.Field) : null,
                Specialization = educationProgramDTO.Specialization != null ? _dtoMappingService.MapToSpecialization(educationProgramDTO.Specialization) : null,
                Courses = educationProgramDTO.Courses?.Select(x => _dtoMappingService.MapToCourse(x)).ToList(),
                IsHistorical = false,
                ModificationDate = DateTime.Now,
                ModificationType = Models.ModificationType.EducationProgram,
                ModifiedBy = modifiedBy
            };
        }

        public async Task<List<Employee>> GetEmployees()
        {
            return _dbContext.Employees.ToList();
        }

        public async Task<bool> CreateEmployee(string name) {
            var employee = new Employee()
            {
                Name = name
            };
            _dbContext.Employees.Add(employee);
            _dbContext.SaveChanges();
            return true;
        }
    }
}
