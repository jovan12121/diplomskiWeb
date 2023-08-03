using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mikroservis3.Interfaces
{
    public interface IPaymentsService
    {
        Task<bool> ProcessPaymentStripe(string paymentMethodId, int amount);
        Task<bool> VerifyPayPalPayment(string OrderId);
    }
}
