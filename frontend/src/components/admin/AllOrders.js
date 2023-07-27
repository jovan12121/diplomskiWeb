import { useEffect, useState } from "react";
import { GetAllOrders } from "../../services/ordersService";
import OrderPopup from "./OrderPopup";
import Order from "../model/Order";
import { Paper,Table,TableHead,TableBody,TableRow,TableCell,Button,Container} from "@mui/material";

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
    <Container style={{ maxWidth: '80%' }}>
        <Table component={Paper}>
          <TableHead>
            <TableRow>
              <TableCell align="center" onClick={() => handleThClick("buyerUsername")}>
                Buyer{" "}
                {sortConfig && sortConfig.column === "buyerUsername" && (
                  <span>{sortConfig.direction === "asc" ? "▲" : "▼"}</span>
                )}
              </TableCell>
              <TableCell align="center" onClick={() => handleThClick("timeOfOrder")}>
                Time of order{" "}
                {sortConfig && sortConfig.column === "timeOfOrder" && (
                  <span>{sortConfig.direction === "asc" ? "▲" : "▼"}</span>
                )}
              </TableCell>
              <TableCell align="center" onClick={() => handleThClick("timeForDelivery")}>
                Delivery time(hours){" "}
                {sortConfig && sortConfig.column === "timeForDelivery" && (
                  <span>{sortConfig.direction === "asc" ? "▲" : "▼"}</span>
                )}
              </TableCell>
              <TableCell align="center" onClick={() => handleThClick("timeOfArrival")}>
                Time of arrival{" "}
                {sortConfig && sortConfig.column === "timeOfArrival" && (
                  <span>{sortConfig.direction === "asc" ? "▲" : "▼"}</span>)
                }
              </TableCell>
              <TableCell align="center" onClick={() => handleThClick("address")}>
                Address{" "}
                {sortConfig && sortConfig.column === "address" && (
                  <span>{sortConfig.direction === "asc" ? "▲" : "▼"}</span>)
                }
              </TableCell>
              <TableCell align="center" onClick={() => handleThClick("comment")}>
                Comment{" "}
                {sortConfig && sortConfig.column === "comment" && (
                  <span>{sortConfig.direction === "asc" ? "▲" : "▼"}</span>)
                }
              </TableCell>
              <TableCell align="center" onClick={() => handleThClick("totalPrice")}>
                Total price{" "}
                {sortConfig && sortConfig.column === "totalPrice" && (
                  <span>{sortConfig.direction === "asc" ? "▲" : "▼"}</span>)
                }
              </TableCell>
              <TableCell align="center">
                  Payment Method
              </TableCell>
              <TableCell align="center" onClick={() => handleThClick("status")}>
                Status{" "}
                {sortConfig && sortConfig.column === "status" && (
                  <span>{sortConfig.direction === "asc" ? "▲" : "▼"}</span>)
                }
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
                <TableCell align="center">{order.totalPrice}</TableCell>
                <TableCell align="center">{order.paymentMethod}</TableCell>
                <TableCell align="center">{order.getOrderStatus()}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    onClick={() => handleOrderClick(order)}
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      {selectedOrder && <OrderPopup order={selectedOrder} onClose={onClose} />}
    </Container>
  );
}

export default AllOrders;
