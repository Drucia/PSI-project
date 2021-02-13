using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PSI_2020_backend.Services.Interface
{
    public interface IRequestService
    {
        Task<string> SendGetRequest(string link);
        Task<string> SendPostRequest(string link, Dictionary<string, string> body);
    }
}
