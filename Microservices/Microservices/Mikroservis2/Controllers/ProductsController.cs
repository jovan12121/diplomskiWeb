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
    [Route("api/products")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductsService _productService;
        public ProductsController(IProductsService productService)
        {
            _productService = productService;
        }
        [HttpPost("addProduct")]
        [Authorize(Roles = "seller")]
        public async Task<ActionResult> AddProductAsync([FromForm] AddProductDto dto)
        {
            try
            {
                return Ok(await _productService.AddProductAsync(dto));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("getProductsBySeller")]
        [Authorize(Roles = "seller")]
        public async Task<ActionResult> GetProductsBySellerAsync(string seller)
        {
            try
            {
                return Ok(await _productService.GetProductsBySellerAsync(seller));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut("editProduct")]
        [Authorize(Roles = "seller")]
        public async Task<ActionResult> EditProductAsync([FromForm] EditProductDto dto)
        {
            try
            {
                return Ok(await _productService.EditProductAsync(dto));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete("deleteProduct/{id}")]
        [Authorize(Roles = "seller")]
        public async Task<ActionResult> DeleteProductAsync(long id)
        {
            try
            {
                return Ok(await _productService.DeleteProductAsync(id));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("getAllProducts")]
        [Authorize(Roles = "buyer")]
        public async Task<ActionResult> GetAllProductsAsync()
        {
            try
            {
                return Ok(await _productService.GetAllProductsAsync());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpGet("getProductDetails/{id}")]
        [Authorize(Roles = "seller,buyer")]
        public async Task<ActionResult> GetProductDetails(long id)
        {
            try
            {
                return Ok(await _productService.GetProductDetailsAsync(id));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
