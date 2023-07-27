using AutoMapper;
using Dapr.Client;
using Mikroservis2.Dto;
using Mikroservis2.HelpClasses;
using Mikroservis2.Infrastracture;
using Mikroservis2.Interfaces;
using Mikroservis2.Model;
using Mikroservis2.Repo;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace Mikroservis2.Services
{
    public class ProductsService : IProductsService
    {
        private readonly IMapper _mapper;
        private readonly ProjectDbContext _dbContext;
        private readonly ProductsRepo productsRepo;
        private readonly ProductImagesRepo productImagesRepo;
        private DaprClient _daprClient;

        //private readonly UsersRepo usersRepo;
        public ProductsService(IMapper mapper, ProjectDbContext dbContext,DaprClient darp)
        {
            _mapper = mapper;
            //_dbContext = dbContext;
            productsRepo = new ProductsRepo(dbContext);
            productImagesRepo = new ProductImagesRepo(dbContext);
            //usersRepo = new UsersRepo(dbContext);
            _daprClient = darp;
        }

        public async Task<Product> AddProductAsync(AddProductDto dto)
        {
            if (dto.Description.Trim() == "" || dto.File == null || dto.Model.Trim() == "" || dto.Quantity <= 0 || dto.SellerUsername.Trim() == "" || dto.BraceletMaterial.Trim()=="" || dto.Brand.Trim()=="" || dto.CaseDiameter.Trim()=="" || dto.Gender.Trim()=="" || dto.Warranty.Trim()=="" || dto.Waterproof.Trim()=="" )
                throw new Exception("Invalid Data!");

            Product p = _mapper.Map<Product>(dto);

            using (var stream = new MemoryStream())
            {
                await dto.File.CopyToAsync(stream);
                p.ProfilePicture = stream.ToArray();
            }

            User owner = null;

            try
            {
                owner = await _daprClient.InvokeMethodAsync<User>(HttpMethod.Get, "mikroservis1", $"api/users/getUserByUsername/{dto.SellerUsername}");
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }

            p.OwnerId = owner.Id;
            p.Date = DateTime.Now;
            Product retval = productsRepo.AddProduct(p);
            List<ProductImage> productImages = new List<ProductImage>();
            foreach (var item in dto.AdditionalImages)
            {
                ProductImage pi = new ProductImage();
                using (var stream = new MemoryStream())
                {
                    item.CopyTo(stream);
                    pi.Picture = stream.ToArray();
                    pi.ProductId = p.Id;
                }
                productImages.Add(pi);
            }
            productImagesRepo.AddFew(productImages);
            //foreach (var item in dto.AdditionalImages)
            //{
            //    using (var stream = new MemoryStream())
            //    {
            //        await dto.File.CopyToAsync(stream);
            //        ProductImage t = productImagesRepo.AddProductImage(stream.ToArray(), retval.Id);
            //        if (t == null)
            //            throw new Exception("Error");
            //    }
            //}
            return retval;
        }

        public async Task<bool> DeleteProductAsync(long id)
        {
            if (id <= 0)
                throw new Exception("Invalid productId!");

            Product p = productsRepo.FindProduct(id);
            productsRepo.RemoveProduct(p);
            productImagesRepo.RemovePictures(id);
            return true;
        }

        public async Task<Product> EditProductAsync(EditProductDto dto)
        {
            if (dto.Description.Trim() == "" || dto.Model.Trim() == "" || dto.Quantity <= 0 || dto.BraceletMaterial.Trim() == "" || dto.Brand.Trim() == "" || dto.CaseDiameter.Trim() == "" || dto.Gender.Trim() == "" || dto.Warranty.Trim() == "" || dto.Waterproof.Trim() == "")
                throw new Exception("Invalid Data!");

            Product p = productsRepo.FindProduct(dto.Id);
            p.Model = dto.Model;
            p.Description = dto.Description;
            p.Quantity = dto.Quantity;
            p.Price = dto.Price;
            p.Gender = dto.Gender;
            p.Brand = dto.Brand;
            p.CaseDiameter = dto.CaseDiameter;
            p.BraceletMaterial = dto.BraceletMaterial;
            p.Material = dto.Material;
            p.Warranty = dto.Warranty;
            p.Waterproof = dto.Waterproof;
            p.Mechanism = dto.Mechanism;
            if (dto.File != null)
            {
                using (var stream = new MemoryStream())
                {
                    await dto.File.CopyToAsync(stream);
                    p.ProfilePicture = stream.ToArray();
                }
            }
            Product retVal = productsRepo.UpdateProduct(p);
            if (dto.AdditionalImages!=null)
            {
                productImagesRepo.RemovePictures(p.Id);
                List<ProductImage> productImages = new List<ProductImage>();
                foreach (var item in dto.AdditionalImages)
                {
                    ProductImage pi = new ProductImage();
                    using (var stream = new MemoryStream())
                    {
                        item.CopyTo(stream);
                        pi.Picture = stream.ToArray();
                        pi.ProductId = p.Id;
                    }
                    productImages.Add(pi);
                }
                await productImagesRepo.AddFew(productImages);
            }

            
            return retVal;
        }

        public async Task<List<GetProductsBuyerDto>> GetAllProductsAsync()
        {
            List<Product> list = productsRepo.GetAllProducts();
            List<GetProductsBuyerDto> retVal = new List<GetProductsBuyerDto>();

            foreach (var item in list)
            {
                if(item.Quantity!=0)
                    retVal.Add(_mapper.Map<GetProductsBuyerDto>(item));
            }

            return retVal;
        }

        public async Task<GetProductDetailsDto> GetProductDetailsAsync(long id)
        {
            if (id < 0)
                throw new Exception("Error");

            Product p = productsRepo.FindProduct(id);
            GetProductDetailsDto retVal = _mapper.Map<GetProductDetailsDto>(p);
            retVal.AdditionalPictures = productImagesRepo.GetAllPicturesForProduct(id);
            return retVal;
        }

        public async Task<List<GetProductsDto>> GetProductsBySellerAsync(string seller)
        {
            if (seller.Trim() == "")
                throw new Exception("Invalid seller!");

            User owner = null;

            try
            {
                owner = await _daprClient.InvokeMethodAsync<User>(HttpMethod.Get, "mikroservis1", $"api/users/getUserByUsername/{seller}");
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }

            if (owner == null)
                throw new Exception("error");

            List<Product> products = productsRepo.GetAllProducts().Where(x => x.OwnerId == owner.Id).ToList<Product>();
            List<GetProductsDto> retVal = new List<GetProductsDto>();

            foreach (var item in products)
            {
                GetProductsDto dto = _mapper.Map<GetProductsDto>(item);
                retVal.Add(dto);
            }

            return retVal;
        }

    }
}
