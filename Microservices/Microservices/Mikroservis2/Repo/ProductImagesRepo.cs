using Microsoft.AspNetCore.Http;
using Mikroservis2.Infrastracture;
using Mikroservis2.Model;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Mikroservis2.Repo
{
    public class ProductImagesRepo
    {
        private ProjectDbContext projectDbContext;
        public ProductImagesRepo(ProjectDbContext context)
        {
            projectDbContext = context;
        }
        public ProductImage AddProductImage(byte[] image,long productId)
        {
            ProductImage pi = new ProductImage();
            pi.Picture = image;
            pi.ProductId = productId;
            ProductImage retVal = projectDbContext.ProductImages.Add(pi).Entity;
            projectDbContext.SaveChanges();
            return retVal;

        }
        public async Task AddFew(List<ProductImage> list)
        {
            projectDbContext.ProductImages.AddRange(list);
            await projectDbContext.SaveChangesAsync();

        }

        public List<byte[]> GetAllPicturesForProduct(long id)
        {
            List<byte[]> retVal = new List<byte[]>();
            foreach (var item in projectDbContext.ProductImages.Where(x=>x.ProductId == id).ToList())
            {
                retVal.Add(item.Picture);
            }
            return retVal;
        }
        public void RemovePictures(long id)
        {
            List<ProductImage> list = projectDbContext.ProductImages.Where(x => x.ProductId == id).ToList();
            foreach (var item in list)
            {
                projectDbContext.ProductImages.Remove(item);
            }
            projectDbContext.SaveChanges();
        }
    }
}
