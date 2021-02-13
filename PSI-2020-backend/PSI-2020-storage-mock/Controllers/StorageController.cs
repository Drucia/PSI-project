using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace PSI_2020_storage_mock.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StorageController : Controller
    {

        private List<StoreModel> storage;
        private readonly string path = "saveddata2.json";

        public StorageController()
        {
            if (!(System.IO.File.Exists(path)))
            {
                System.IO.File.WriteAllText(path, "[]");
            }
            string data = System.IO.File.ReadAllText(path);
            if(data != "")
            {
                storage = JsonConvert.DeserializeObject<List<StoreModel>>(data);
            }
        }

        [HttpGet("test")]
        public async Task<IActionResult> Test()
        {
            return Ok("Storage working!");
        }

        [HttpPost("store")]
        public async Task<IActionResult> Store([FromBody] StoreModel storeModel)
        {
            storage.Add(storeModel);
            System.IO.File.WriteAllText(path, JsonConvert.SerializeObject(storage));
            return Ok("ok");
        }

        [HttpGet("download/{educationProgram}/{course}")]
        public async Task<IActionResult> Download(Guid educationProgram, Guid course)
        {
            foreach(var storeModel in storage)
            {
                if(storeModel.EducationProgram == educationProgram && storeModel.Course == course)
                {
                    var content = storeModel.Content;
                    return File(
                    content,
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "card.xlsx");
                }
            }
            return NotFound("not found");
        }


    }
}