using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using PSI_2020_backend.Cache;
using PSI_2020_backend.Models;
using PSI_2020_backend.Models.Database;
using PSI_2020_backend.Models.DTO;
using PSI_2020_backend.Services.Implementation;
using PSI_2020_backend.Services.Interface;
using AuthorizationOptions = PSI_2020_backend.Models.AuthorizationOptions;

namespace PSI_2020_backend
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            // db
            services.AddDbContext<DatabaseContext>(options => options.UseNpgsql(Configuration.GetConnectionString("DatabasePostgres")));

            // cors
            services.AddCors(o => o.AddPolicy("AllowAll", builder =>
            {
                builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader();
            }));

            // server settings
            services.Configure<ServerSettings>(Configuration.GetSection("ServerSettings"));

            // identity, authentication & authorization
            services.Configure<AuthorizationOptions>(Configuration.GetSection("AuthOptions"));

            services.AddIdentity<DatabaseUser, IdentityRole>()
                .AddEntityFrameworkStores<DatabaseContext>()
                .AddDefaultTokenProviders();

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.SaveToken = true;
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        System.Text.Encoding.UTF8.GetBytes(Configuration["AuthOptions:Secret"]))
                };
            });

            services.AddAuthorization(options => {
                options.DefaultPolicy = new AuthorizationPolicyBuilder()
                    .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
                    .RequireAuthenticatedUser()
                    .Build();
            });

            services.AddTransient<IAuthenticationService, AuthenticationService>();
            services.AddTransient<IDatabaseService, DatabaseService>();
            services.AddTransient<IDTOMappingService, DTOMappingService>();
            services.AddTransient<IEmployeeCache, EmployeeCache>();
            services.AddTransient<IDocumentGeneratorService, DocumentGeneratorService>();
            services.AddTransient<IStorageService, StorageService>();
            services.AddTransient<IRequestService, RequestService>();
            

            // predefined accounts
            services.Configure<List<PredefinedAccount>>(Configuration.GetSection("PredefinedAccounts"));
            services.Configure<List<PredefinedEmployee>>(Configuration.GetSection("PredefinedEmployees"));
            services.Configure<List<EducationProgramDTO>>(Configuration.GetSection("PredefinedEducationPrograms"));
            services.Configure<ExternalServices>(Configuration.GetSection("ExternalServices"));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors("AllowAll");

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
