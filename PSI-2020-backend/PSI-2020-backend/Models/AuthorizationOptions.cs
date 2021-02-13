using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PSI_2020_backend.Models
{
    public class AuthorizationOptions
    {
        public string Secret { get; set; }
        public int Expiration { get; set; }
    }
}
