import { useEffect, useState } from "react";
import { GetAllOrders } from "../../services/ordersService";
import OrderPopup from "./OrderPopup";
import Order from "../model/Order";
import { Paper,Table,TableHead,TableBody,TableRow,TableCell,Button,Container,TableSortLabel} from "@mui/material";
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
function AllOrders() {
  const [sortConfig, setSortConfig] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const getOrders = async () => {
      const resp = await GetAllOrders();
      const orderObjects = resp.data.map((orderData) => {
        return new Order(
          orderData.id,
          orderData.buyerUsername,
          orderData.timeOfOrder,
          orderData.timeForDelivery,
          orderData.timeOfArrival,
          orderData.address,
          orderData.comment,
          orderData.totalPrice,
          orderData.cancelled,
          orderData.paymentMethod
        );
      });
      setOrders(orderObjects);
    };
    getOrders();
  }, []);

  const sortedOrders = [...orders].sort((order1, order2) => {
    if (!sortConfig) {
      return 0;
    }

    const { column, direction } = sortConfig;

    if (order1[column] < order2[column]) {
      return direction === "asc" ? -1 : 1;
    }
    if (order1[column] > order2[column]) {
      return direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  function handleThClick(column) {
    let direction = "asc";
    if (sortConfig && sortConfig.column === column && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ column, direction });
  }

  function handleOrderClick(order) {
    setSelectedOrder(order);
  }

  function onClose() {
    setSelectedOrder(null);
  }

  return (
    <Container style={{ maxWidth: '85%' }}>
      <Paper>
        <Table >
          <TableHead>
            <TableRow>
              <TableCell align="center">
              <TableSortLabel
                active={sortConfig?.column === "buyerUsername"}
                direction={sortConfig?.column === "buyerUsername" ? sortConfig.direction : "asc"}
                onClick={() => handleThClick("buyerUsername")}
              >
                Buyer
              </TableSortLabel>
              </TableCell>
              <TableCell align="center">
              <TableSortLabel
                active={sortConfig?.column === "timeOfOrder"}
                direction={sortConfig?.column === "timeOfOrder" ? sortConfig.direction : "asc"}
                onClick={() => handleThClick("timeOfOrder")}
              >
                Time of order
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
              <TableSortLabel
                active={sortConfig?.column === "timeForDelivery"}
                direction={sortConfig?.column === "timeForDelivery" ? sortConfig.direction : "asc"}
                onClick={() => handleThClick("timeForDelivery")}
              >
                Delivery time
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
              <TableSortLabel
                active={sortConfig?.column === "timeOfArrival"}
                direction={sortConfig?.column === "timeOfArrival" ? sortConfig.direction : "asc"}
                onClick={() => handleThClick("timeOfArrival")}
              >
                Time of arrival
                </TableSortLabel>
              </TableCell>
              <TableCell align="center" >
              <TableSortLabel
                active={sortConfig?.column === "address"}
                direction={sortConfig?.column === "address" ? sortConfig.direction : "asc"}
                onClick={() => handleThClick("address")}
              >
                Address
                </TableSortLabel>
              </TableCell>
              <TableCell align="center" >
              <TableSortLabel
                active={sortConfig?.column === "comment"}
                direction={sortConfig?.column === "comment" ? sortConfig.direction : "asc"}
                onClick={() => handleThClick("comment")}
              >
                Comment
          </TableSortLabel>
              </TableCell>
              <TableCell align="center">
              <TableSortLabel
                active={sortConfig?.column === "totalPrice"}
                direction={sortConfig?.column === "totalPrice" ? sortConfig.direction : "asc"}
                onClick={() => handleThClick("totalPrice")}
              >
                Total price
                </TableSortLabel>

              </TableCell>
              <TableCell align="center">
                  Payment Method
              </TableCell>
              <TableCell align="center">
              <TableSortLabel
                active={sortConfig?.column === "status"}
                direction={sortConfig?.column === "status" ? sortConfig.direction : "asc"}
                onClick={() => handleThClick("status")}
              >
                Status
                </TableSortLabel>

              </TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from(sortedOrders).map((order) => (
              <TableRow key={order.id + order.timeOfOrder}>
                <TableCell align="center">{order.buyerUsername}</TableCell>
                <TableCell align="center">{order.getDateTime(order.timeOfOrder)}</TableCell>
                <TableCell align="center">{order.timeForDelivery}</TableCell>
                <TableCell align="center">{order.getDateTime(order.timeOfArrival)}</TableCell>
                <TableCell align="center">{order.address}</TableCell>
                <TableCell align="center">{order.comment}</TableCell>
                <TableCell align="center">{order.totalPrice} RSD</TableCell>
                <TableCell align="center">{order.paymentMethod}</TableCell>
                <TableCell align="center">{order.getOrderStatus()}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    onClick={() => handleOrderClick(order)}
                    startIcon={<InfoRoundedIcon/>}
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </Paper>
      {selectedOrder && <OrderPopup order={selectedOrder} onClose={onClose} />}
    </Container>
  );
}

export default AllOrders;
