using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mikroservis2.Model
{
    public class ProductImage
    {
        public int Id { get; set; }
        public byte[] Picture { get; set; }
        public long ProductId { get; set; }
        //public Product Product { get; set; }

    }
}
