using PSI_2020_backend.Models.Database.Bases;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace PSI_2020_backend.Models.Database
{
    public class SubjectCard : ModelBase
    {
        public int Number { get; set; }
        public bool IsDone { get; set; }
        public List<Program> Lectures { get; set; }
        public List<Program> Laboratories { get; set; }
        public List<Program> Projects { get; set; }
        public List<Program> Seminaries { get; set; }
        public List<Program> Exercises { get; set; }
        public string Prerequisites { get; set; }
        public string PrerequisitesEng { get; set; }
        public string Bibliography { get; set; }
        public string BibliographyEng { get; set; }
        public string Tools { get; set; }
        public string ToolsEng { get; set; }
        public string Aims { get; set; }
        public string AimsEng { get; set; }
        public List<string> Professors { get; set; }
        public List<LearningEffect> LearningEffects{ get; set; }
    }
}
