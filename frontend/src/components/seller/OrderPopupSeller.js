import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { GetOrderDetailsSeller } from "../../services/ordersService";
import ProductSeller from "../model/ProductSeller";
import { Table,TableContainer,TableHead,TableBody,TableRow,TableCell,Paper,Button,Dialog,DialogTitle,DialogContent,DialogActions,IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function OrderPopupSeller(props) {
  const [orderProducts, setOrderProducts] = useState([]);
  const [sum, setSum] = useState(0);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const getOrderProducts = async () => {
      const username = localStorage.getItem("user");
      const resp = await GetOrderDetailsSeller(props.order.id, username);
      if (!resp.data) {
        toast.error("Error getting order products.");
      }
      const mappedProducts = resp.data.map((product) => new ProductSeller(product));
      setOrderProducts(mappedProducts);
    };
    getOrderProducts();
  }, [props.order.id]);

  useEffect(() => {
    let totalSum = 0;
    orderProducts.forEach((product) => {
      totalSum += product.price * product.orderQuantity;
    });
    setSum(totalSum);
    console.log(orderProducts);
  }, [orderProducts]);

  const handleClose = () => {
    setOpen(false);
    props.onClose();
  };

  function getDateTime(date) {
    const date1 = new Date(date);
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    return date1.toLocaleString("en-GB", options);
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
    const imgUrl = `data:image/png;base64,${product.picture}`;
    return (
      <TableRow>
        <TableCell>{product.brand}</TableCell>
        <TableCell>{product.model}</TableCell>
        <TableCell>{product.price}</TableCell>
        <TableCell>{product.quantity}</TableCell>
        <TableCell>{product.orderQuantity}</TableCell>
        <TableCell>
          <img width="40" height="40" src={imgUrl} alt="" />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Order details
        <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close" sx={{ position: "absolute", right: 12, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <b>Buyer:</b>
                </TableCell>
                <TableCell>{props.order.buyerUsername}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <b>Order time:</b>
                </TableCell>
                <TableCell>{getDateTime(props.order.timeOfOrder)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <b>Time for delivery:</b>
                </TableCell>
                <TableCell>{props.order.timeForDelivery}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <b>Time of arrival:</b>
                </TableCell>
                <TableCell>{getDateTime(props.order.timeOfArrival)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <b>Address:</b>
                </TableCell>
                <TableCell>{props.order.address}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <b>Comment:</b>
                </TableCell>
                <TableCell>{props.order.comment}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <b>Total price:</b>
                </TableCell>
                <TableCell>{props.order.totalPrice}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <b>Payment method:</b>
                </TableCell>
                <TableCell>{props.order.paymentMethod}</TableCell>
              </TableRow>
              <TableRow>
                {props.order.cancelled && (
                  <>
                    <TableCell>
                      <b>Status:</b>
                    </TableCell>
                    <TableCell>Cancelled</TableCell>
                  </>
                )}
                {!props.order.cancelled && CompareDates(props.order.timeOfArrival) && (
                  <>
                    <TableCell>
                      <b>Status:</b>
                    </TableCell>
                    <TableCell>In progress</TableCell>
                  </>
                )}
                {!props.order.cancelled && !CompareDates(props.order.timeOfArrival) && (
                  <>
                    <TableCell>
                      <b>Status:</b>
                    </TableCell>
                    <TableCell>Delivered</TableCell>
                  </>
                )}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <h4>Products</h4>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Brand</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>In stock</TableCell>
                <TableCell>Order Quantity</TableCell>
                <TableCell>Picture</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderProducts.map((product) => (
                <ShowProduct product={product} key={product.id} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
}

export default OrderPopupSeller;
