using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PSI_2020_backend.Models.DTO
{
    public class SubjectCardDTO
    {
        public int Number { get; set; }
        public bool IsDone { get; set; }
        public List<ProgramDTO> Lectures { get; set; }
        public List<ProgramDTO> Laboratories { get; set; }
        public List<ProgramDTO> Projects { get; set; }
        public List<ProgramDTO> Seminaries { get; set; }
        public List<ProgramDTO> Exercises { get; set; }
        public string Prerequisites { get; set; }
        public string PrerequisitesEng { get; set; }
        public string Bibliography { get; set; }
        public string BibliographyEng { get; set; }
        public string Tools { get; set; }
        public string ToolsEng { get; set; }
        public string Aims { get; set; }
        public string AimsEng { get; set; }
        public List<string> Professors { get; set; }
        public List<LearningEffectDTO> LearningEffects { get; set; }
    }
}
