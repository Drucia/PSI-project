using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using PSI_2020_backend.Models;
using PSI_2020_backend.Models.Database;
using PSI_2020_backend.Services.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PSI_2020_backend.Services.Implementation
{
    public class StorageService : IStorageService
    {
        private readonly IOptions<ExternalServices> _externalServices;
        private readonly IRequestService _requestService;
        private readonly IDocumentGeneratorService _generator;
        public StorageService(IOptions<ExternalServices> externalServices, IRequestService requestService, IDocumentGeneratorService generator)
        {
            _externalServices = externalServices;
            _requestService = requestService;
            _generator = generator;
        }

        public async Task<bool> UploadEducationProgram(EducationProgram program)
        {
            foreach(var course in program.Courses)
            {
                var content = await _generator.GenerateSubjectCard(course);
                var parameters = new Dictionary<string, string>
                {
                    ["educationProgram"] = program.Id.ToString(),
                    ["course"] = course.Id.ToString(),
                    ["content"] = JsonConvert.SerializeObject(content)
                };
                //var response = await _requestService.SendPostRequest(_externalServices.Value.StorageAddress + "/api/storage/store", parameters);
                //if (response != "ok") return false;
            }
            return true;
        }

        public async Task<List<LinkDetails>> GetLinkList(EducationProgram program)
        {
            if(program.Courses != null)
            {
                return program.Courses.Select(c => new LinkDetails()
                {
                    Name = c.Name,
                    //Link = $"{_externalServices.Value.StorageAddress}/api/storage/download/{program.Id}/{c.Id}"
                    Link = $"/api/educationProgram/download/{program.Id}/{c.Id}"
                }).ToList();
            }
            return new List<LinkDetails>();
        }
    }
}
