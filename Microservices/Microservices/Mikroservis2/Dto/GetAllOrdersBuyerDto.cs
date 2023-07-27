﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mikroservis2.Dto
{
    public class GetAllOrdersBuyerDto
    {
        public long Id { get; set; }
        public DateTime TimeOfOrder { get; set; }
        public int TimeForDelivery { get; set; }
        public string Address { get; set; }
        public string Comment { get; set; }
        public int TotalPrice { get; set; }
        public DateTime TimeOfArrival { get; set; }
        public string PaymentMethod { get; set; }
    }
}