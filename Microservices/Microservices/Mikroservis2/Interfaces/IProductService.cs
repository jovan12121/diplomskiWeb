using Mikroservis2.Dto;
using Mikroservis2.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mikroservis2.Interfaces
{
    public interface IProductsService
    {
        Task<Product> AddProductAsync(AddProductDto dto);

        Task<List<GetProductsDto>> GetProductsBySellerAsync(string seller);

        Task<Product> EditProductAsync(EditProductDto dto);

        Task<bool> DeleteProductAsync(long id);

        Task<List<GetProductsBuyerDto>> GetAllProductsAsync();
        Task<GetProductDetailsDto> GetProductDetailsAsync(long id);
    }
}
