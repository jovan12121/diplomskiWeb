﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mikroservis3.Dto
{
    public class PaymentRequest
    {
        public string PaymentMethodId { get; set; }
        public int Amount { get; set; }
    }
}
