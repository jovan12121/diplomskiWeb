using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mikroservis2.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mikroservis2.Infrastracture.Configurations
{
    public class ProductImageConfiguration : IEntityTypeConfiguration<ProductImage>
    {
        public void Configure(EntityTypeBuilder<ProductImage> builder)
        {
            builder.HasKey(pi => pi.Id);
            builder.Property(x => x.Id).ValueGeneratedOnAdd();

            //builder.HasOne(x => x.Product)
            //       .WithMany(x => x.ProductImages)
            //       .HasForeignKey(x => x.ProductId)
            //       .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
