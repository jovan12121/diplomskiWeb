using Mikroservis2.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mikroservis2.Interfaces
{
    public interface IOrdersService
    {
        Task<int> AddOrderAsync(NewOrderProductDto dto);

        Task<List<GetAllOrdersDto>> GetAllOrdersAsync();

        Task<List<GetAllOrdersBuyerDto>> GetAllOrdersBuyerAsync(string buyer);

        Task<bool> CancelOrderAsync(long orderId);

        Task<List<GetOrderDetailsProductDto>> GetOrderDetailsAdminAsync(long orderId);

        Task<List<GetAllOrdersDto>> GetAllOrdersSellerAsync(string seller);

        Task<List<GetOrderDetailsProductDtoSeller>> GetOrderDetailsSellerAsync(long orderId, string username);
        //List<GetOrderDetailsProductDto> GetOrderDetailsBuyer(long orderId);
    }
}
