import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@mui/material";
import { PayWithStripe } from "../../services/paymentService";
import { useNavigate } from "react-router-dom";
import { AddOrder } from "../../services/ordersService";
import { toast } from "react-toastify";
import PaymentRoundedIcon from '@mui/icons-material/PaymentRounded';
function StripePaymentForm ({ totalPrice, products, address, comment }) {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const nav = useNavigate();
  async function order(data) {
    const resp = await AddOrder(data);
    toast.success("Your order will be delivered in " + resp + " hours.");
    nav("../");
  }
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (error) {
      setPaymentError(error.message);
      return;
    }
    const d = { paymentMethodId: paymentMethod.id, amount: totalPrice };
    const response = await PayWithStripe(d);
    if (response.result) {
      setPaymentSuccess(true);
      var data = {
        products: products,
        comment: comment,
        address: address,
        totalPrice: totalPrice,
        buyerUsername: localStorage.getItem("user"),
        paymentMethod: "Stripe"
      };
      order(data);
    } else {
      setPaymentError(response.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={{ style: { base: { fontSize: "20px" } } }} />
      <Button variant="contained" color="primary" size="large" type="submit" sx={{ marginTop: 2 }} startIcon={<PaymentRoundedIcon/>}>
        Confirm Payment
      </Button>
      {paymentError && <p>{paymentError}</p>}
      {paymentSuccess && <p>Payment successful!</p>}
    </form>
  );
};

export default StripePaymentForm;
