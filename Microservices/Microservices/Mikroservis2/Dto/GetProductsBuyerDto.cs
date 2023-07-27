using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mikroservis2.Dto
{
    public class GetProductsBuyerDto
    {
        public long Id { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public int Price { get; set; }
        public int Quantity { get; set; }
        public byte[] ProfilePicture { get; set; }
        public string Warranty { get; set; }
        public string Mechanism { get; set; }
        public string CaseDiameter { get; set; }
        public string BraceletMaterial { get; set; }
        public string Waterproof { get; set; }
        public string Material { get; set; }
        public string Gender { get; set; }
        public DateTime Date { get; set; }
        public long OwnerId { get; set; }
    }
}
