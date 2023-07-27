import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { GetOrderDetails } from "../../services/ordersService";
import Product from "../model/Product";
import { Dialog, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function OrderPopupBuyer(props) {
  const [orderProducts, setOrderProducts] = useState([]);

  useEffect(() => {
    const getOrderProducts = async () => {
      const resp = await GetOrderDetails(props.order.id);
      if (!resp.data) {
        toast.error('error');
      }
      const mappedProducts = resp.data.map(product => new Product(product));
      setOrderProducts(mappedProducts);
    }
    getOrderProducts();
  }, []);

  function getDateTime(date) {
    const date1 = new Date(date);
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    return date1.toLocaleString('en-GB', options);
  }

  function CompareDates(date1) {
    const Date1 = new Date(date1);
    const Date2 = new Date();
    if (Date1 > Date2) {
      return true;
    } else {
      return false;
    }
  }

  function ShowProduct(props) {
    const product = props.product;
    const imgUrl = `data:image/png;base64,${product.profilePicture}`;

    return (
      <TableRow>
        <TableCell align="center">{product.brand}</TableCell>
        <TableCell align="center">{product.model}</TableCell>
        <TableCell align="center">{product.price}</TableCell>
        <TableCell align="center">{product.quantity}</TableCell>
        <TableCell align="center"><img width='60' height='60' src={imgUrl} alt="" /></TableCell>
      </TableRow>
    );
  }

  return (
    <Dialog open={true} onClose={props.onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Order details
        <IconButton aria-label="close" onClick={props.onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell><b>Order time:</b></TableCell><TableCell>{getDateTime(props.order.timeOfOrder)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><b>Time for delivery:</b></TableCell><TableCell>{props.order.timeForDelivery}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><b>Time of arrival:</b></TableCell><TableCell>{getDateTime(props.order.timeOfArrival)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><b>Address:</b></TableCell><TableCell>{props.order.address}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><b>Comment:</b></TableCell><TableCell>{props.order.comment}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><b>Total price:</b></TableCell><TableCell>{props.order.totalPrice}</TableCell>
              </TableRow>
              <TableRow>
                {props.order.cancelled ?
                  <>
                    <TableCell><b>Status:</b></TableCell><TableCell>Cancelled</TableCell>
                  </> :
                  CompareDates(props.order.timeOfArrival) ?
                    <>
                      <TableCell><b>Status:</b></TableCell><TableCell>In progress</TableCell>
                    </> :
                    <>
                      <TableCell><b>Status:</b></TableCell><TableCell>Delivered</TableCell>
                    </>
                }
              </TableRow>
              <TableRow>
                <TableCell><b>Payment Method:</b></TableCell><TableCell>{props.order.paymentMethod}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Typography sx={{marginTop:2}} variant="h6">Products</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Brand</TableCell>
                <TableCell align="center">Model</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">Order Quantity</TableCell>
                <TableCell align="center">Picture</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderProducts.map(product => (
                <ShowProduct product={product} key={product.id} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
}

export default OrderPopupBuyer;
