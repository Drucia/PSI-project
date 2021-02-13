using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PSI_2020_backend.Models.DTO
{
    public class CourseDTO
    {
        public string Name { get; set; }
        public string EngName { get; set; }
        public int Semester { get; set; }
        public int SumHoursForLectures { get; set; }
        public int SumHoursForLaboratories { get; set; }
        public int SumHoursForProjects { get; set; }
        public int SumHoursForSeminaries { get; set; }
        public int SumHoursForExercises { get; set; }
        public SubjectCardDTO SubjectCard { get; set; }
    }
}
