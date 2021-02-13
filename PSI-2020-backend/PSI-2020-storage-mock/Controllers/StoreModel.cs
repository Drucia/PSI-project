using System;

namespace PSI_2020_storage_mock.Controllers
{
    public class StoreModel
    {
        public Guid EducationProgram { get; set; }
        public Guid Course { get; set; }
        public byte[] Content { get; set; }
    }
}