using PSI_2020_backend.Models.Database.Bases;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PSI_2020_backend.Models.Database
{
    public class Program : ModelBase
    {
        public string Subject { get; set; }
        public string EngSubject { get; set; }
        public int Hours { get; set; }
    }
}
