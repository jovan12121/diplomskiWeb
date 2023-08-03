import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Button, FormControl, Select, MenuItem, InputLabel, Typography } from "@mui/material";
import { AddOrder } from "../../services/ordersService";
import { toast } from "react-toastify";
import StripePaymentForm from "./StripePaymentForm";
import PayPalPaymentForm from "./PaypalPaymentForm";
import LocalAtmRoundedIcon from '@mui/icons-material/LocalAtmRounded';
function Payment() {
    const nav = useNavigate();
    const location = useLocation();
    const { products, totalPrice, address, comment } = location.state || {};

    const [paymentMethod, setPaymentMethod] = useState("cash");
    async function order(data) {
        const resp = await AddOrder(data);
        toast.success("Your order will be delivered in " + resp + " hours.");
        nav("../");
    }
    function handleClick(event) {
        var data = {
            products: products,
            comment: comment,
            address: address,
            totalPrice: totalPrice,
            buyerUsername: localStorage.getItem("user"),
            paymentMethod: "Cash"
        };
        order(data);
    }
    function handlePaymentMethodChange(event) {
        setPaymentMethod(event.target.value);
    }
    return (
        <Container>
            <Typography variant="h4" align="center">Total price:{totalPrice} RSD</Typography>
            <FormControl sx={{ width: "100%", marginTop: 2, marginBottom: 2 }}>
                <InputLabel htmlFor="payment-method">Payment Method</InputLabel>
                <Select
                    value={paymentMethod}
                    onChange={handlePaymentMethodChange}
                    label="Payment Method"
                    inputProps={{
                        name: "paymentMethod",
                        id: "payment-method",
                    }}
                >
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="stripe">Stripe</MenuItem>
                    <MenuItem value="paypal">PayPal</MenuItem>
                </Select>
            </FormControl>
            {paymentMethod === "cash" && <br /> &&
                <div style={{textAlign:"center"}}>
                <Button variant="contained" color="primary" size="large" type="submit" onClick={handleClick} startIcon={<LocalAtmRoundedIcon/>}>
                    Confirm Payment
                </Button>
                </div>}
            {paymentMethod === "stripe" && (
                <div style={{textAlign:"center"}}>
                <StripePaymentForm totalPrice={totalPrice} products={products} address={address} comment={comment} />
                </div>

            )}
            {paymentMethod === "paypal" && (
                <div style={{textAlign:"center",marginLeft:200}}>
                <PayPalPaymentForm totalPrice={totalPrice} products={products} address={address} comment={comment} />
                </div>

            )}
        </Container>
    );
}

export default Payment;
