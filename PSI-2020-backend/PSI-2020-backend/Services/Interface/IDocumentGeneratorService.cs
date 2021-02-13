using PSI_2020_backend.Models.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PSI_2020_backend.Services.Interface
{
    public interface IDocumentGeneratorService
    {
        Task<byte[]> GenerateSubjectCard(Course course);
    }
}
