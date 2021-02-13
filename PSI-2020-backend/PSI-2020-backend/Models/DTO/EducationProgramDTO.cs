using PSI_2020_backend.Models.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PSI_2020_backend.Models.DTO
{
    public class EducationProgramDTO
    {
        public Guid Id { get; set; }
        public int Year { get; set; }
        public bool IsWIP { get; set; }
        public Degree Degree { get; set; }
        public Term Term { get; set; }
        public FieldDTO Field { get; set; }
        public SpecializationDTO? Specialization { get; set; }
        public List<CourseDTO> Courses { get; set; }
    }
}
