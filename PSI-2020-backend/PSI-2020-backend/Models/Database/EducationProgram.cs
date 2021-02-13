using PSI_2020_backend.Models.Database.Bases;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Threading.Tasks;

namespace PSI_2020_backend.Models.Database
{
    public class EducationProgram : ModelBase
    {
        public int Year { get; set; }
        public bool IsWIP { get; set; }
        public Degree Degree { get; set; }
        public Term Term { get; set; }
        public Field Field { get; set; }
        public Specialization Specialization { get; set; }
        public List<Course> Courses { get; set; }
        public bool IsHistorical { get; set; }
        public DateTime ModificationDate { get; set; }
        public string ModifiedBy { get; set; }
        public ModificationType ModificationType { get; set; }
    }
}
