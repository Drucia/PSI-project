using PSI_2020_backend.Models.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PSI_2020_backend.Models.DTO
{
    public class LearningEffectDTO
    {
        public string Code { get; set; }
        public string Description { get; set; }
        public string DescriptionEng { get; set; }
        public EffectCategory Category { get; set; }
    }
}
