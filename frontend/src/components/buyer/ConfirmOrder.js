import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TableContainer, Table, TableHead, TableBody, TableRow, Paper, TableCell, Container, TextField, Button,FormControl } from "@mui/material";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
function ConfirmOrder() {
  const nav = useNavigate();
  const location = useLocation();
  const list = location.state || [];

  const dataList = [];
  let totalPrice = 0;

  list.forEach((element) => {
    dataList.push({
      productId: element.productId,
      productBrand: element.productBrand,
      productModel: element.productModel,
      productImage: element.productImage,
      orderQuantity: element.orderQuantity,
      picture: element.picture,
      price: element.price,
      total: element.price * element.orderQuantity,
    });

    totalPrice += element.price * element.orderQuantity + 300;
  });
  function handleClick(event) {
    event.preventDefault();
    var dataList = [];
    list.forEach((element) => {
      dataList.push({ productId: element.productId, orderQuantity: element.orderQuantity });
    });
    nav("../payment", { state: { products:dataList, totalPrice:totalPrice,address:event.target.address.value,comment:event.target.comment.value } });
  }


  return (
    <Container>
      <form onSubmit={(event) => handleClick(event)}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Picture</TableCell>
                <TableCell align="center">Brand</TableCell>
                <TableCell align="center">Model</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataList.map((item) => (
                <TableRow key={item.productId}>
                  <TableCell align="center">
                    <img src={`data:image/png;base64,${item.picture}`} alt="Product" width="100" height="100" />
                  </TableCell>
                  <TableCell align="center">{item.productBrand}</TableCell>
                  <TableCell align="center">{item.productModel}</TableCell>
                  <TableCell align="center">{item.orderQuantity}</TableCell>
                  <TableCell align="center">{item.price} RSD</TableCell>
                  <TableCell align="center">{item.total} RSD</TableCell>
                </TableRow>
              ))}

              <TableRow>
                <TableCell colSpan={6} align="center">
                  <h4>Total Price: {totalPrice} RSD</h4>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <FormControl sx={{ width: "80%" }}>
                    <TextField label="Comment" variant="outlined" name="comment" />
                  </FormControl>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <FormControl sx={{ width: "80%" }}>
                    <TextField label="Address" variant="outlined"  name="address" />
                  </FormControl>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Button variant="contained" size="large" type="sumbit" startIcon={<CheckRoundedIcon/>}>
                    Confirm Order
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </form>
    </Container>
  );
}

export default ConfirmOrder;
