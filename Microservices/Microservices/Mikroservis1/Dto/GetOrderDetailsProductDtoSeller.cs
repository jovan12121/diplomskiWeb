﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mikroservis1.Dto
{
    public class GetOrderDetailsProductDtoSeller
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public int Price { get; set; }
        public int Quantity { get; set; }
        public string Description { get; set; }
        public byte[] Picture { get; set; }
        public int OrderQuantity { get; set; }
    }
}
