using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using PSI_2020_backend.Models;
using PSI_2020_backend.Services.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace PSI_2020_backend.Services.Implementation
{
    public class RequestService : IRequestService
    {
        private static readonly HttpClient client = new HttpClient();

        public async Task<string> SendGetRequest(string link)
        {
            try
            {
                return await client.GetStringAsync(link);
            }
            catch (Exception)
            {
                return "{\"error\": \"1\"}";
            }
        }       
        
        public async Task<string> SendPostRequest(string link, Dictionary<string, string> body)
        {
            var resp = await client.PostAsync(link, new StringContent(JsonConvert.SerializeObject(body), Encoding.UTF8, "application/json"));
            try
            {
                return await resp.Content.ReadAsStringAsync();
            }
            catch (Exception)
            {
                return "{\"error\": \"1\"}";
            }
        }
    }
}
