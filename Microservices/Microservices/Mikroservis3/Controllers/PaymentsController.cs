using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mikroservis3.Dto;
using Mikroservis3.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mikroservis3.Controllers
{
    [Route("api/payments")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentsService _paymentsService;
        public PaymentsController(IPaymentsService paymentsService)
        {
            _paymentsService = paymentsService;
        }

        [HttpPost("paywithstripe")]
        [Authorize(Roles = "buyer")]
        public IActionResult PayWithStripe([FromBody] PaymentRequest paymentRequest)
        {
            try
            {
                return Ok(_paymentsService.ProcessPaymentStripe(paymentRequest.PaymentMethodId, paymentRequest.Amount));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpPost("verifypaypalpayment")]
        [Authorize(Roles = "buyer")]
        public IActionResult VerifyPayPalPayment([FromBody] string id)
        {
            try
            {
                return Ok(_paymentsService.VerifyPayPalPayment(id));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
