using Microsoft.EntityFrameworkCore;
using Moq;
using NUnit.Framework;
using PSI_2020_backend.Models.Database;
using PSI_2020_backend.Models.DTO;
using PSI_2020_backend.Services.Implementation;
using PSI_2020_backend.Services.Interface;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace PSI_2020_backend_test
{
    public class Tests
    {
        private DatabaseContext _db;
        private IDatabaseService _dbService;
        [SetUp]
        public void Setup()
        {
            var smock = new Mock<IStorageService>();
            smock.Setup(x => x.UploadEducationProgram(It.IsAny<EducationProgram>())).ReturnsAsync(true);
            IStorageService storageMock  = smock.Object;
            IDTOMappingService dtoMock = new Mock<IDTOMappingService>().Object;
            _db = GetInMemoryContext();
            _dbService = new DatabaseService(_db, dtoMock, storageMock);
        }

        [Test]
        public void Test1()
        {
            Assert.Pass();
        }

        [Test]
        public async Task EmployeeTest()
        {
            var employeeName1 = "Test Name";
            var employeeName2 = "Test Name2";
            var employeeName3 = "Test Name3";
            var employeeName4 = "Test Name4";
            var employeeName5 = "Test Name5";

            var employees = await _dbService.GetEmployees();
            Assert.AreEqual(0, employees.Count);

            await _dbService.CreateEmployee(employeeName1);
            employees = await _dbService.GetEmployees();
            Assert.AreEqual(1, employees.Count);
            Assert.AreEqual(employeeName1, (await _dbService.GetEmployees()).Where(e => e.Name == employeeName1).FirstOrDefault().Name);
            Assert.IsNull((await _dbService.GetEmployees()).Where(e => e.Name == employeeName2).FirstOrDefault());
            Assert.IsNull((await _dbService.GetEmployees()).Where(e => e.Name == employeeName3).FirstOrDefault());
            Assert.IsNull((await _dbService.GetEmployees()).Where(e => e.Name == employeeName4).FirstOrDefault());
            Assert.IsNull((await _dbService.GetEmployees()).Where(e => e.Name == employeeName5).FirstOrDefault());

            await _dbService.CreateEmployee(employeeName2);
            await _dbService.CreateEmployee(employeeName4);
            await _dbService.CreateEmployee(employeeName5);

            employees = await _dbService.GetEmployees();
            Assert.AreEqual(4, employees.Count);
            Assert.AreEqual(employeeName1, (await _dbService.GetEmployees()).Where(e => e.Name == employeeName1).FirstOrDefault().Name);
            Assert.AreEqual(employeeName2, (await _dbService.GetEmployees()).Where(e => e.Name == employeeName2).FirstOrDefault().Name);
            Assert.IsNull((await _dbService.GetEmployees()).Where(e => e.Name == employeeName3).FirstOrDefault());
            Assert.AreEqual(employeeName4, (await _dbService.GetEmployees()).Where(e => e.Name == employeeName4).FirstOrDefault().Name);
            Assert.AreEqual(employeeName5, (await _dbService.GetEmployees()).Where(e => e.Name == employeeName5).FirstOrDefault().Name);
        }

        [Test]
        public async Task EducationProgramTest()
        {
            var educationProgram1 = new EducationProgramDTO()
            {
                IsWIP = true,
                Degree = Degree.Master,
                Field = new FieldDTO()
                {
                    Name = "fieldName",
                    EngName = "fieldEngName",
                    ShortName = "fieldShortName",
                    Specializations = null
                },
                Term = Term.Summer,
                Year = 2021,
                Courses = null,
                Specialization = null
            };

            var educationPrograms = await _dbService.GetEducationPrograms();
            Assert.AreEqual(0, educationPrograms.Count);
            var createStatus = await _dbService.CreateEducationProgram(educationProgram1);
            Assert.IsTrue(createStatus);
            educationPrograms = await _dbService.GetEducationPrograms();
            Assert.AreEqual(1, educationPrograms.Count);
        }

        public static DatabaseContext GetInMemoryContext()
        {
            DbContextOptions<DatabaseContext> options;
            var builder = new DbContextOptionsBuilder<DatabaseContext>();
            builder.UseInMemoryDatabase("database");
            options = builder.Options;
            DatabaseContext context = new DatabaseContext(options);
            
            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();
            return context;
        }
    }
}