using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mikroservis2.Dto
{
    public class PaymentResult
    {
        public bool Successful { get; set; }
        public string OrderId { get; set; }
        public string ErrorMessage { get; set; }

    }
}
