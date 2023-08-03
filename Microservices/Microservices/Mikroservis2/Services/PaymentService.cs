//using Microsoft.Extensions.Configuration;
//using Mikroservis2.Dto;
//using Mikroservis2.Interfaces;
//using Stripe;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text.Json;
//using System.Text.Json.Serialization;
//using System.Threading.Tasks;
//using PayPalCheckoutSdk.Orders;
//using PayPalCheckoutSdk.Core;

//namespace Mikroservis2.Services
//{
//    public class PaymentService : IPaymentsService
//    {
//        private readonly IConfigurationSection _stripeSecretKey;
//        private readonly IConfigurationSection _payPalClientId;
//        private readonly IConfigurationSection _payPalSecret;

//        public PaymentService(IConfiguration config)
//        {
//            _stripeSecretKey = config.GetSection("StripeSecretKey");
//            _payPalClientId = config.GetSection("PayPalClientId");
//            _payPalSecret = config.GetSection("PayPalSecret");

//        }
//        public async Task<bool> ProcessPaymentStripe(string paymentMethodId, int amount)
//        {
//            try
//            {
//                StripeConfiguration.ApiKey = _stripeSecretKey.Value;

//                var options = new PaymentIntentCreateOptions
//                {
//                    PaymentMethod = paymentMethodId,
//                    Amount = amount,
//                    Currency = "rsd",
//                    ConfirmationMethod = "manual",
//                };

//                var service = new PaymentIntentService();
//                var paymentIntent = service.Create(options);

//                if (paymentIntent.Status == "requires_confirmation")
//                {
//                    var confirmOptions = new PaymentIntentConfirmOptions
//                    {
//                        PaymentMethod = paymentMethodId,
//                    };

//                    var confirmedPaymentIntent = service.Confirm(paymentIntent.Id, confirmOptions);

//                    if (confirmedPaymentIntent.Status == "succeeded")
//                    {
//                        return true;
//                    }
//                    else
//                    {
//                        throw new Exception("Payment failed. Please try again or use a different payment method.");
//                    }
//                }
//                else
//                {
//                    throw new Exception("Unexpected payment status. Please try again later.");
//                }
//            }
//            catch (Exception e)
//            {
//                var options = new JsonSerializerOptions
//                {
//                    ReferenceHandler = ReferenceHandler.Preserve,
//                };

//                var jsonString = JsonSerializer.Serialize(e, options);

//                throw new Exception(jsonString);
//            }
//        }

//        public async Task<bool> VerifyPayPalPayment(string OrderId)
//        {
//            try
//            {
//                var paypalClient = new PayPalHttpClient(
//                    new SandboxEnvironment(_payPalClientId.Value, _payPalSecret.Value)
//                );
//                var request = new OrdersGetRequest(OrderId);
//                var response = paypalClient.Execute(request).Result;

//                if (response.StatusCode == System.Net.HttpStatusCode.OK)
//                {
//                    var order = response.Result<Order>();

//                    if (order.Status == "COMPLETED")
//                    {
//                        return true;
//                    }
//                    else
//                    {
//                        throw new Exception("Payment status is not completed!");
//                    }
//                }
//                else
//                {
//                    throw new Exception("There's some error!");
//                }
//            }
//            catch (Exception e)
//            {
//                var options = new JsonSerializerOptions
//                {
//                    ReferenceHandler = ReferenceHandler.Preserve, 
//                };

//                var jsonString = JsonSerializer.Serialize(e, options);

//                throw new Exception(jsonString);
//            }
//        }

//    }
//}
