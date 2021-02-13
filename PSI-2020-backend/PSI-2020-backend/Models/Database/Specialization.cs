using PSI_2020_backend.Models.Database.Bases;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PSI_2020_backend.Models.Database
{
    public class Specialization : ModelBase
    {
        public string Name { get; set; }
        public string EngName { get; set; }
        public string ShortName { get; set; }
    }
}
