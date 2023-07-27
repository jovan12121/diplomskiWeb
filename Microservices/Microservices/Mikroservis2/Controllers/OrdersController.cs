using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mikroservis2.Dto;
using Mikroservis2.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mikroservis2.Controllers
{
    [Route("api/orders")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrdersService _ordersService;
        public OrdersController(IOrdersService ordersService)
        {
            _ordersService = ordersService;
        }
        [HttpPost("addOrder")]
        [Authorize(Roles = "buyer")]
        public async Task<ActionResult> AddOrderAsync(NewOrderProductDto dto)
        
        {
            try
            {
                return Ok(await _ordersService.AddOrderAsync(dto));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("getAllOrders")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> GetAllOrdersAsync()
        {
            try
            {
                return Ok(await _ordersService.GetAllOrdersAsync());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("getAllOrdersBuyer")]
        [Authorize(Roles = "buyer")]
        public async Task<ActionResult> GetAllOrdersBuyerAsync(string buyer)
        {
            try
            {
                return Ok(await _ordersService.GetAllOrdersBuyerAsync(buyer));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut("cancel/{orderId}")]
        [Authorize(Roles = "buyer")]
        public async Task<ActionResult> CancelOrderAsync(long orderId)
        {
            try
            {
                return Ok(await _ordersService.CancelOrderAsync(orderId));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("getOrderDetailsAdmin/{orderId}")]
        [Authorize(Roles = "admin,buyer")]
        public async Task<ActionResult> GetOrderDetailsAdminAsync(long orderId)
        {
            try
            {
                return Ok(await _ordersService.GetOrderDetailsAdminAsync(orderId));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("getAllOrdersSeller")]
        [Authorize(Roles = "seller")]
        public async Task<ActionResult> GetAllOrdersSellerAsync(string seller)
        {
            try
            {
                return Ok(await _ordersService.GetAllOrdersSellerAsync(seller));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("getOrderDetailsSeller/{orderId}/{seller}")]
        [Authorize(Roles = "seller")]
        public async Task<ActionResult> GetOrderDetailsSellerAsync(long orderId, string seller)
        {
            try
            {
                return Ok(await _ordersService.GetOrderDetailsSellerAsync(orderId, seller));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        //[HttpGet("getOrderDetailsBuyer/{orderId}")]
        //[Authorize(Roles = "buyer")]
        //public ActionResult GetOrderDetailsBuyer(long orderId)
        //{
        //    return Ok(_ordersService.GetOrderDetailsBuyer(orderId));
        //}
    }
}
