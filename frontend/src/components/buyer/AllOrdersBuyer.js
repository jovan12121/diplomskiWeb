import React, { useEffect, useState } from "react";
import { CancelOrder, GetAllOrdersBuyer } from "../../services/ordersService";
import OrderPopupBuyer from "./OrderPopupBuyer";
import { toast } from "react-toastify";
import OrderBuyer from "../model/OrderBuyer";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  Button,
  Container,
  Paper
} from "@mui/material";
import TimelapseIcon from '@mui/icons-material/Timelapse';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
function AllOrdersBuyer() {
  const [sortConfig, setSortConfig] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  function onClose() {
    setSelectedOrder(null);
  }

  function handleOrderClick(order) {
    setSelectedOrder(order);
  }

  useEffect(() => {
    const getOrders = async () => {
      const resp = await GetAllOrdersBuyer(localStorage.getItem("user"));
      const mappedOrders = resp.data.map((orderData) => new OrderBuyer(orderData));
      setOrders(mappedOrders);
    };
    getOrders();
  }, []);

  function CompareDates(date1) {
    const Date1 = new Date(date1);
    const Date2 = new Date();
    return Date1 > Date2;
  }

  function CompareDates2(date1) {
    const Date1 = new Date(new Date(date1).getTime() + 60 * 60 * 1000);
    const Date2 = new Date();
    return Date1 < Date2;
  }

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

  async function handleClickCancel(orderId) {
    const resp = await CancelOrder(orderId);
    if (resp.data === true) {
      toast.success("Successful cancellation of order!");
      const updatedList = orders.filter((item) => item.id !== orderId);
      setOrders(updatedList);
    } else {
      toast.error("There is some problem");
    }
  }

  function handleThClick(column) {
    let direction = "asc";
    if (sortConfig && sortConfig.column === column && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ column, direction });
  }

  function getOrderStatus(order) {
    if (CompareDates(order.timeOfArrival) && CompareDates2(order.timeOfOrder)) {
      order.status = "In progress";
      return (
        <>
          <TableCell align="center">In progress</TableCell>
          <TableCell align="center">
            <Button variant="outlined"  onClick={() => handleClickCancel(order.id)} startIcon={<CancelRoundedIcon/>}>
              Cancel
            </Button>
          </TableCell>
        </>
      );
    } else if (CompareDates(order.timeOfArrival) && !CompareDates2(order.timeOfOrder)) {
      order.status = "In progress";
      return (
        <>
          <TableCell align="center">In progress</TableCell>
          <TableCell align="center">
            <Button variant="outlined" disabled startIcon={<CancelRoundedIcon/>}>
              Cancel
            </Button>
          </TableCell>
        </>
      );
    } else if (!CompareDates(order.timeOfArrival)) {
      order.status = "Delivered";
      return (
        <>
          <TableCell align="center">Delivered</TableCell>
          <TableCell align="center">
            <Button variant="outlined" disabled startIcon={<CancelRoundedIcon/>}>
              Cancel
            </Button>
          </TableCell>
        </>
      );
    }
  }

  function ShowOrder(props) {
    const order = props.order;
    const [countdown, setCountdown] = useState(null);

    useEffect(() => {
      if (order.status === "In progress") {
        const intervalId = setInterval(() => {
          const currentTime = new Date().getTime();
          const timeOfArrival = new Date(order.timeOfArrival).getTime();
          const remainingTime = Math.max(0, timeOfArrival - currentTime);
          setCountdown(remainingTime);
        }, 1000);

        return () => {
          clearInterval(intervalId);
        };
      }
    }, [order]);

    function formatTime(time) {
      const hours = Math.floor(time / 3600000);
      const minutes = Math.floor((time % 3600000) / 60000);
      const seconds = Math.floor((time % 60000) / 1000);

      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    return (
      <TableRow>
        <TableCell align="center">{getDateTime(order.timeOfOrder)}</TableCell>
        <TableCell align="center">{order.timeForDelivery}</TableCell>
        <TableCell align="center">{getDateTime(order.timeOfArrival)}</TableCell>
        <TableCell align="center">{order.address}</TableCell>
        <TableCell align="center">{order.comment}</TableCell>
        <TableCell align="center">{order.totalPrice} RSD</TableCell>
        <TableCell align="center">{order.paymentMethod}</TableCell>
        {getOrderStatus(order)}
        {order.status === "In progress" && (
          <TableCell align="center">
            {countdown ? (
              <span>{formatTime(countdown)}</span>
            ) : (
              <span><TimelapseIcon fontSize="small"/></span>
            )}
          </TableCell>
        )}
        {order.status !== "In progress" && <TableCell align="center"></TableCell>}
        <TableCell align="center">
          <Button variant="outlined" onClick={() => handleOrderClick(order)} startIcon={<InfoRoundedIcon/>}>
            Details
          </Button>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <Container style={{maxWidth:"85%"}}>
      <Paper>
      <Table>
        <TableHead>
          <TableRow>
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
            <TableCell align="center">
              <TableSortLabel
                active={sortConfig?.column === "address"}
                direction={sortConfig?.column === "address" ? sortConfig.direction : "asc"}
                onClick={() => handleThClick("address")}
              >
                Address
              </TableSortLabel>
            </TableCell>
            <TableCell align="center">
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
            <TableCell align="center">Countdown</TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from(sortedOrders).map((order) => (
            <ShowOrder order={order} key={order.id} />
          ))}
        </TableBody>
      </Table>
      </Paper>
      {selectedOrder && <OrderPopupBuyer order={selectedOrder} onClose={onClose} />}
    </Container>
  );
}

export default AllOrdersBuyer;
