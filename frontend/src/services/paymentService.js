import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const PayWithStripe = async (data) => {
    return await axios.post(`${process.env.REACT_APP_API_URL}/api/payments/paywithstripe`, data,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('encodedToken'))}`
        }
      }).then(function (response) {
          //console.log(response.data);
          return response.data;
      })
      .catch(function (error) {
        if(error.response.data)
          toast.error(error.response.data)   
        else
          toast.error(error)
      });
  
  }
export const VerifyPayPal = async (data) => {
    return await axios.post(`${process.env.REACT_APP_API_URL}/api/payments/verifypaypalpayment`, data,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('encodedToken'))}`
        }
      }).then(function (response) {
          console.log(response.data);
          return response.data;
      })
      .catch(function (error) {
        if(error.response.data)
          toast.error(error.response.data)   
        else
          toast.error(error)
      });
  
  }