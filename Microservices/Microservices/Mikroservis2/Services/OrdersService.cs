using AutoMapper;
using Mikroservis2.Dto;
using Mikroservis2.Infrastracture;
using Mikroservis2.Interfaces;
using Mikroservis2.Model;
using Mikroservis2.Repo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Dapr.Client;
using Dapr;
using Mikroservis2.HelpClasses;

namespace Mikroservis2.Services
{
    public class OrdersService : IOrdersService
    {
        private readonly IMapper _mapper;
        private readonly ProjectDbContext _dbContext;
        //private readonly UsersRepo usersRepo;
        private readonly OrdersRepo ordersRepo;
        private readonly ProductsRepo productsRepo;
        private readonly OrderedProductsRepo orderedProductsRepo;

        private DaprClient _daprClient;
        public OrdersService(IMapper mapper, ProjectDbContext dbContext,DaprClient dapr)
        {
            _mapper = mapper;
           // usersRepo = new UsersRepo(dbContext);
            ordersRepo = new OrdersRepo(dbContext);
            orderedProductsRepo = new OrderedProductsRepo(dbContext);
            productsRepo = new ProductsRepo(dbContext);
            _daprClient = dapr;
        }

        public async Task<int> AddOrderAsync(NewOrderProductDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.BuyerUsername))
                throw new Exception("Invalid buyer!");

            if (dto.Products.Count == 0)
                throw new Exception("Invalid products count!");

            if (dto.TotalPrice <= 0)
                throw new Exception("Invalid price!");
            User u = null;
            List<OrderedProduct> orderedProducts = new List<OrderedProduct>();
            try
            {
                 u = await _daprClient.InvokeMethodAsync<User>(HttpMethod.Get, "mikroservis1", $"api/users/getUserByUsername/{dto.BuyerUsername}");
            }
            catch(Exception e)
            {
                throw new Exception(e.Message);
            }
            if (u == null)
                throw new Exception("Error");

            foreach (var item in dto.Products)
            {
                Product p = productsRepo.FindProduct(item.ProductId);
                if (p.Quantity < item.OrderQuantity)
                    throw new Exception("There is not enough of this product in stock!");
                p.Quantity -= item.OrderQuantity;
                productsRepo.UpdateProduct(p);
                OrderedProduct orderedProduct = new OrderedProduct();
                orderedProduct.ProductId = p.Id;
                orderedProduct.OrderQuantity = item.OrderQuantity;
                orderedProducts.Add(orderedProduct);
            }

            Order o = new Order();
            Random random = new Random();
            int deliveryTime = random.Next(2, 72);
            o.TimeForDelivery = deliveryTime;
            o.TimeOfOrder = DateTime.Now.AddHours(2);
            o.TotalPrice = dto.TotalPrice;
            o.BuyerId = u.Id;
            o.PaymentMethod = dto.PaymentMethod;
            if (dto.Address.Equals(""))
                o.Address = u.Address;
            else 
                o.Address = dto.Address;
            o.Comment = dto.Comment;
            o.BuyerUsername = dto.BuyerUsername;

            Order order = ordersRepo.AddOrder(o);

            foreach (var item in orderedProducts)
            {
                item.OrderId = order.Id;
                orderedProductsRepo.AddOrderedProduct(item);
            }

            return deliveryTime;
        }

        public async Task<bool> CancelOrderAsync(long orderId)
        {
            if (orderId <= 0)
                throw new Exception("Invalid order ID!");

            Order o = ordersRepo.FindOrder(orderId);
            if (o == null)
                throw new Exception("Order not found!");

            o.Cancelled = true;
            ordersRepo.UpdateOrder(o);

            List<OrderedProduct> orderedProducts = orderedProductsRepo.GetAll();
            foreach (var item in orderedProducts)
            {
                if (item.OrderId == orderId)
                {
                    Product p = productsRepo.FindProduct(item.ProductId);
                    p.Quantity += item.OrderQuantity;
                    productsRepo.UpdateProduct(p);
                }
            }

            return true;
        }

        public async Task<List<GetAllOrdersDto>> GetAllOrdersAsync()
        {
            List<GetAllOrdersDto> retVal = new List<GetAllOrdersDto>();

            foreach (var item in ordersRepo.GetAll())
            {
                GetAllOrdersDto gao = _mapper.Map<GetAllOrdersDto>(item);
                gao.TimeOfArrival = item.TimeOfOrder.AddHours(item.TimeForDelivery);
                retVal.Add(gao);
            }

            return retVal;
        }

        public async Task<List<GetAllOrdersBuyerDto>> GetAllOrdersBuyerAsync(string buyer)
        {
            if (string.IsNullOrWhiteSpace(buyer))
                throw new Exception("Invalid buyer!");

            List<GetAllOrdersBuyerDto> retVal = new List<GetAllOrdersBuyerDto>();

            foreach (var item in ordersRepo.GetAll())
            {
                if (!item.Cancelled && item.BuyerUsername == buyer)
                {
                    GetAllOrdersBuyerDto gao = _mapper.Map<GetAllOrdersBuyerDto>(item);
                    gao.TimeOfArrival = item.TimeOfOrder.AddHours(item.TimeForDelivery);
                    retVal.Add(gao);
                }
            }

            return retVal;
        }

        public async Task<List<GetAllOrdersDto>> GetAllOrdersSellerAsync(string seller)
        {
            if (string.IsNullOrWhiteSpace(seller))
                throw new Exception("Invalid seller!");
            User u = null;
            List<GetAllOrdersDto> retVal = new List<GetAllOrdersDto>();
            try
            {
                 u = await _daprClient.InvokeMethodAsync<User>(HttpMethod.Get, "mikroservis1", $"api/users/getUserByUsername/{seller}");
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
            if (u == null)
                throw new Exception("Seller not found!");

            long userId = u.Id;

            List<Product> products = productsRepo.GetAllProducts().Where(x => x.OwnerId == userId).ToList();

            List<OrderedProduct> orderedProducts = orderedProductsRepo.GetAll();

            List<long> orderIds = orderedProducts
                .Where(op => products.Any(p => p.Id == op.ProductId))
                .Select(op => op.OrderId)
                .Distinct()
                .ToList();

            foreach (var item in ordersRepo.GetAll())
            {
                if (orderIds.Contains(item.Id))
                {
                    GetAllOrdersDto gao = _mapper.Map<GetAllOrdersDto>(item);
                    gao.TimeOfArrival = item.TimeOfOrder.AddHours(item.TimeForDelivery);
                    retVal.Add(gao);
                }
            }

            return retVal;
        }

        public async Task<List<GetOrderDetailsProductDto>> GetOrderDetailsAdminAsync(long orderId)
        {
            if (orderId <= 0)
                throw new Exception("Invalid order ID!");

            List<GetOrderDetailsProductDto> retVal = new List<GetOrderDetailsProductDto>();
            Dictionary<long, int> productIdQuantityMap = new Dictionary<long, int>();

            foreach (var item in orderedProductsRepo.GetAll())
            {
                if (item.OrderId == orderId)
                {
                    productIdQuantityMap[item.ProductId] = item.OrderQuantity;
                }
            }

            foreach (var item in productIdQuantityMap)
            {
                GetOrderDetailsProductDto temp = _mapper.Map<GetOrderDetailsProductDto>(productsRepo.FindProduct(item.Key));
                temp.Quantity = item.Value;
                retVal.Add(temp);
            }

            return retVal;
        }

        public async Task<List<GetOrderDetailsProductDto>> GetOrderDetailsBuyerAsync(long orderId)
        {
            if (orderId <= 0)
                throw new Exception("Invalid order ID!");

            List<GetOrderDetailsProductDto> retVal = new List<GetOrderDetailsProductDto>();
            Dictionary<long, int> productIdQuantityMap = new Dictionary<long, int>();

            foreach (var item in orderedProductsRepo.GetAll())
            {
                if (item.OrderId == orderId)
                {
                    productIdQuantityMap[item.ProductId] = item.OrderQuantity;
                }
            }

            foreach (var item in productIdQuantityMap)
            {
                GetOrderDetailsProductDto temp = _mapper.Map<GetOrderDetailsProductDto>(productsRepo.FindProduct(item.Key));
                temp.Quantity = item.Value;
                retVal.Add(temp);
            }

            return retVal;
        }

        public async Task<List<GetOrderDetailsProductDtoSeller>> GetOrderDetailsSellerAsync(long orderId, string username)
        {
            if (orderId <= 0 || string.IsNullOrWhiteSpace(username))
                throw new Exception("Invalid data!");

            List<GetOrderDetailsProductDtoSeller> retVal = new List<GetOrderDetailsProductDtoSeller>();
            User u = null;
            try
            {
                u = await _daprClient.InvokeMethodAsync<User>(HttpMethod.Get, "mikroservis1", $"api/users/getUserByUsername/{username}");
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
            if (u == null)
                throw new Exception("Seller not found!");

            long userId = u.Id;

            foreach (var item in orderedProductsRepo.GetAll())
            {
                if (item.OrderId == orderId)
                {
                    Product p = productsRepo.FindProduct(item.ProductId);
                    if (p.OwnerId == userId)
                    {
                        GetOrderDetailsProductDtoSeller temp = _mapper.Map<GetOrderDetailsProductDtoSeller>(p);
                        temp.OrderQuantity = item.OrderQuantity;
                        retVal.Add(temp);
                    }
                }
            }

            return retVal;
        }


    }
}
