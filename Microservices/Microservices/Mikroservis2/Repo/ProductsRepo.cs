using Mikroservis2.Infrastracture;
using Mikroservis2.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mikroservis2.Repo
{
    public class ProductsRepo
    {
        private ProjectDbContext projectDbContext;
        public ProductsRepo(ProjectDbContext context)
        {
            projectDbContext = context;
        }
        public Product AddProduct(Product p)
        {
            Product retVal = projectDbContext.Products.Add(p).Entity;
            projectDbContext.SaveChanges();
            return retVal;
        }
        public Product FindProduct(long id)
        {
            return projectDbContext.Products.Find(id);
        }
        public void RemoveProduct(Product p)
        {
            projectDbContext.Products.Remove(p);
            projectDbContext.SaveChanges();
        }
        public Product UpdateProduct(Product p)
        {
            Product retVal = projectDbContext.Products.Update(p).Entity;
            projectDbContext.SaveChanges();
            return retVal;
        }
        public List<Product> GetAllProducts()
        {
            List<Product> list = projectDbContext.Products.ToList<Product>();
            return list;
        }

    }
}
