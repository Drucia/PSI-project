using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using PSI_2020_backend.Models.Database;
using PSI_2020_backend.Models.DTO;
using PSI_2020_backend.Services.Interface;

namespace PSI_2020_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EducationProgramController : Controller
    {
        private readonly IAuthenticationService _authService;
        private readonly UserManager<DatabaseUser> _userManager;
        private readonly IDatabaseService _databaseService;
        private readonly IOptions<List<EducationProgramDTO>> _predefinedEducationPrograms;
        private readonly IDocumentGeneratorService _generator;

        private readonly IStorageService _storageService;

        public EducationProgramController(IAuthenticationService authService, UserManager<DatabaseUser> userManager, IDatabaseService databaseService, 
            IOptions<List<EducationProgramDTO>> predefinedEducationPrograms, IStorageService storageService, IDocumentGeneratorService generator)
        {
            _authService = authService;
            _userManager = userManager;
            _databaseService = databaseService;
            _predefinedEducationPrograms = predefinedEducationPrograms;
            _storageService = storageService;
            _generator = generator;
        }

        [HttpGet("")]
        public async Task<IActionResult> All()
        {
            foreach (var ep in _predefinedEducationPrograms.Value)
            {
                var fetchedEducationProgram = await _databaseService.GetEducationProgram(ep.Id);
                if (fetchedEducationProgram == null)
                {
                    await _databaseService.CreateEducationProgram(ep);
                }
            }

            var educationProgramList = await _databaseService.GetEducationPrograms();

            return Ok(educationProgramList.Where(ep => !ep.IsWIP).ToList());
        }

        [HttpGet("wip")]
        [Authorize]
        public async Task<IActionResult> AllWip()
        {
            var user = await _authService.GetAuthorizedUser(HttpContext.User, _userManager);
            if (user is null) return Unauthorized();
            if (!user.IsAdmin) return Unauthorized();

            foreach (var ep in _predefinedEducationPrograms.Value)
            {
                var fetchedEducationProgram = await _databaseService.GetEducationProgram(ep.Id);
                if (fetchedEducationProgram == null)
                {
                    await _databaseService.CreateEducationProgram(ep);
                }
            }

            var educationProgramList = await _databaseService.GetEducationPrograms();

            return Ok(educationProgramList.Where(ep => ep.IsWIP).ToList());
        }

        [HttpGet("{programId}")]
        [Authorize]
        public async Task<IActionResult> GetProgram(Guid programId)
        {
            var user = await _authService.GetAuthorizedUser(HttpContext.User, _userManager);
            if (!user.IsAdmin) return Unauthorized();
            if (user is null) return Unauthorized();

            var program = await _databaseService.GetEducationProgram(programId);
            if (program != null)
            {
                return Ok(program);
            }

            return StatusCode(StatusCodes.Status404NotFound);
        }

        [HttpPut("{programId}/update")]
        [Authorize]
        public async Task<IActionResult> Update(Guid programId, [FromBody] EducationProgramDTO dto)
        {
            var user = await _authService.GetAuthorizedUser(HttpContext.User, _userManager);
            if (!user.IsAdmin) return Unauthorized();
            if (user is null) return Unauthorized();

            var educationProgram = await _databaseService.UpdateEducationProgram(programId, dto, user.Name);
            if(educationProgram != null)
            {
                return Ok(educationProgram);
            }
            return StatusCode(StatusCodes.Status500InternalServerError);
        }

        [HttpGet("{programId}/pdf")]
        public async Task<IActionResult> Pdf(Guid programId)
        {
            var program = await _databaseService.GetEducationProgram(programId);
            if (program != null)
            {
                return Ok(await _storageService.GetLinkList(program));
            }

            return StatusCode(StatusCodes.Status404NotFound);
        }

        [HttpGet("download/{educationProgram}/{courseId}")]
        public async Task<IActionResult> Download(Guid educationProgram, Guid courseId)
        {
            var program = await _databaseService.GetEducationProgram(educationProgram);
            if (program != null)
            {
                var course = program.Courses.Where(c => c.Id == courseId).FirstOrDefault();
                if(course != null)
                {
                    var content = await _generator.GenerateSubjectCard(course);
                    return File(
                    content,
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "card.xlsx");
                }
            }
            return NotFound("not found");
        }
    }
}