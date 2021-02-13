using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PSI_2020_backend.Models.Database
{
    public class DatabaseUser : IdentityUser
    {
        public string Name { get; set; }
        public bool IsAdmin { get; set; }
    }
}
