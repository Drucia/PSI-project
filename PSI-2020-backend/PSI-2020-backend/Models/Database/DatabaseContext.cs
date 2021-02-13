using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PSI_2020_backend.Models.Database
{
    public class DatabaseContext : IdentityDbContext<DatabaseUser>
    {
        public DatabaseContext(DbContextOptions options) : base(options) { }
        public DbSet<EducationProgram> EducationPrograms { get; set; }
        public DbSet<Employee> Employees { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            if (!Database.IsNpgsql())
            {
                builder.Ignore<List<string>>();
            }
        }
    }
}
