import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";
import { Container } from "@mui/material";
import { VerifyPayPal } from "../../services/paymentService";
import { AddOrder } from "../../services/ordersService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PayPalPaymentForm = ({ totalPrice, products, address, comment }) => {
  const paypalClientId = process.env.REACT_APP_PAYPAL_CLIENT_ID; 
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const nav = useNavigate();
  
  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: totalPrice/100,
          },
        },
      ],
    });
  };
  
  async function order(data) {
    const resp = await AddOrder(data);
    toast.success("Your order will be delivered in " + resp + " hours.");
    nav("../");
  }

  const onApprove = async (data, actions) => {
    const captureDetails = await actions.order.capture();
    const response = await VerifyPayPal(captureDetails.id);
    console.log(response);
    if (response.result) {
      setPaymentSuccess(true);
      var data = {
        products: products,
        comment: comment,
        address: address,
        totalPrice: totalPrice,
        buyerUsername: localStorage.getItem("user"),
        paymentMethod: "PayPal"
      };
      order(data);
    } else {
      setPaymentError(response.error.message || "An unknown error occurred.");
    }
  };

  const onError = (err) => {
    setPaymentError(err.message || "An unknown error occurred.");
    console.error("PayPal error:", err);
  };

  return (
    <div>
      <PayPalScriptProvider options={{ "client-id": paypalClientId }}>
        <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError} />
      </PayPalScriptProvider>
      {paymentError && <p>{paymentError}</p>}
      {paymentSuccess && <p>Payment successful!</p>}
    </div>
  );
};

export default PayPalPaymentForm;
