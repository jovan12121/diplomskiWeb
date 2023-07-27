using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mikroservis2.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mikroservis2.Infrastracture.Configurations
{
    public class OrderedProductsConfiguration : IEntityTypeConfiguration<OrderedProduct>
    {
        public void Configure(EntityTypeBuilder<OrderedProduct> builder)
        {
            builder.HasKey(op => new { op.OrderId, op.ProductId });
            builder.HasOne(x => x.Order)
                   .WithMany(x => x.OrderedProducts)
                   .HasForeignKey(x => x.OrderId)
                   .OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(x => x.Product)
                   .WithMany(x => x.OrderedProducts)
                   .HasForeignKey(x => x.ProductId)
                   .OnDelete(DeleteBehavior.Cascade);


        }
    }
}
