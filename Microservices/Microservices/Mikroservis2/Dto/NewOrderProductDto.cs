using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mikroservis2.Dto
{
    public class NewOrderProductDto
    {
        public List<OrderProductQuantityTemp> Products { get; set; }
        public string Comment { get; set; }
        public string Address { get; set; }
        public int TotalPrice { get; set; }
        public string BuyerUsername { get; set; }
        public string PaymentMethod { get; set; }
    }
}
