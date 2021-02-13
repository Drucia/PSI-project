using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PSI_2020_backend.Models.DTO
{
    public class FieldDTO
    {
        public string Name { get; set; }
        public string EngName { get; set; }
        public string ShortName { get; set; }
        public List<SpecializationDTO> Specializations { get; set; }
    }
}
