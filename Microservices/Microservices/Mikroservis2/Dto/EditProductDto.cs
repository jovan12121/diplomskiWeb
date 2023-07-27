using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mikroservis2.Dto
{
    public class EditProductDto
    {
        public long Id { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public int Price { get; set; }
        public int Quantity { get; set; }
        public string Description { get; set; }
        public string Gender { get; set; }
        public string BraceletMaterial { get; set; }
        public string Warranty { get; set; }
        public string Waterproof { get; set; }
        public string Material { get; set; }
        public string CaseDiameter { get; set; }
        public string Mechanism { get; set; }
        public IFormFile File { get; set; }
        public List<IFormFile> AdditionalImages { get; set; }
    }
}
