import React, { useEffect, useState } from "react";
import { GetAllOrdersSeller } from "../../services/ordersService";
import OrderPopupSeller from "./OrderPopupSeller";
import OrderSeller from "../model/OrderSeller";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Container } from "@mui/material";
import { TableSortLabel } from "@mui/material";
import TimelapseIcon from '@mui/icons-material/Timelapse';

function AllOrdersSeller() {
    const [sortConfig, setSortConfig] = useState(null);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const getOrders = async () => {
            const resp = await GetAllOrdersSeller(localStorage.getItem('user'));
            const mappedOrders = resp.data.map(order => new OrderSeller(order));
            setOrders(mappedOrders);
        }
        getOrders();
    }, []);

    const sortedOrders = [...orders].sort((order1, order2) => {
        if (!sortConfig) {
            return 0;
        }

        const { column, direction } = sortConfig;

        if (order1[column] < order2[column]) {
            return direction === 'asc' ? -1 : 1;
        }
        if (order1[column] > order2[column]) {
            return direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    function CompareDates(date1) {
        const Date1 = new Date(date1);
        const Date2 = new Date();
        return Date1 > Date2;
    }

    function ShowOrder(props) {
        const order = props.order;
        const [countdown, setCountdown] = useState(null);

        useEffect(() => {
            if (order.status === 'In progress') {
                const intervalId = setInterval(() => {
                    const currentTime = new Date();
                    const timeOfArrival = new Date(order.timeOfArrival);
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

            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        return (
            <TableRow>
                <TableCell align="center">{order.buyerUsername}</TableCell>
                <TableCell align="center">{getDateTime(order.timeOfOrder)}</TableCell>
                <TableCell align="center">{order.timeForDelivery}</TableCell>
                <TableCell align="center">{getDateTime(order.timeOfArrival)}</TableCell>
                <TableCell align="center">{order.address}</TableCell>
                <TableCell align="center">{order.comment}</TableCell>
                <TableCell align="center">{order.totalPrice}</TableCell>
                <TableCell align="center">{getOrderStatus(order)}</TableCell>
                {order.status === 'In progress' && (
                    <TableCell align="center">
                        {countdown ? (
                            <span>
                                {formatTime(countdown)}
                            </span>
                        ) : (
                            <span><TimelapseIcon fontSize="small"/></span>
                        )}
                    </TableCell>
                )}
                {order.status === 'Cancelled' && <TableCell></TableCell>}
                {order.status === 'Delivered' && <TableCell></TableCell>}
                <TableCell align="center">
                    <Button onClick={() => handleOrderClick(order)} variant="outlined">
                        Details
                    </Button>
                </TableCell>
            </TableRow>
        );
    }

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

    function onClose() {
        setSelectedOrder(null);
    }

    function handleOrderClick(order) {
        setSelectedOrder(order);
    }

    function handleThClick(column) {
        let direction = 'asc';
        if (sortConfig && sortConfig.column === column && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ column, direction });
    }

    function getOrderStatus(order) {
        if (order.cancelled) {
            order.status = 'Cancelled';
            return 'Cancelled';
        }
        else if (!order.cancelled && CompareDates(order.timeOfArrival)) {
            order.status = 'In progress';
            return 'In progress';
        }
        else if (!order.cancelled && !CompareDates(order.timeOfArrival)) {
            order.status = 'Delivered';
            return 'Delivered';
        }
    }

    return (
        <Container style={{ maxWidth: "85%" }}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig?.column === 'buyerUsername'}
                                    direction={sortConfig?.column === 'buyerUsername' ? sortConfig.direction : 'asc'}
                                    onClick={() => handleThClick('buyerUsername')}
                                >
                                    Buyer
                                </TableSortLabel>
                            </TableCell> 
                            <TableCell align="center">
                                <TableSortLabel
                                    active={sortConfig?.column === 'timeOfOrder'}
                                    direction={sortConfig?.column === 'timeOfOrder' ? sortConfig.direction : 'asc'}
                                    onClick={() => handleThClick('timeOfOrder')}
                                >
                                    Time of order
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">
                                <TableSortLabel
                                    active={sortConfig?.column === 'timeForDelivery'}
                                    direction={sortConfig?.column === 'timeForDelivery' ? sortConfig.direction : 'asc'}
                                    onClick={() => handleThClick('timeForDelivery')}
                                >
                                    Delivery time(hours)
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">
                                <TableSortLabel
                                    active={sortConfig?.column === 'timeOfArrival'}
                                    direction={sortConfig?.column === 'timeOfArrival' ? sortConfig.direction : 'asc'}
                                    onClick={() => handleThClick('timeOfArrival')}
                                >
                                    Time of arrival
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">
                                <TableSortLabel
                                    active={sortConfig?.column === 'address'}
                                    direction={sortConfig?.column === 'address' ? sortConfig.direction : 'asc'}
                                    onClick={() => handleThClick('address')}
                                >
                                    Address
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">
                                <TableSortLabel
                                    active={sortConfig?.column === 'comment'}
                                    direction={sortConfig?.column === 'comment' ? sortConfig.direction : 'asc'}
                                    onClick={() => handleThClick('comment')}
                                >
                                    Comment
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">
                                <TableSortLabel
                                    active={sortConfig?.column === 'totalPrice'}
                                    direction={sortConfig?.column === 'totalPrice' ? sortConfig.direction : 'asc'}
                                    onClick={() => handleThClick('totalPrice')}
                                >
                                    Total price
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">
                                <TableSortLabel
                                    active={sortConfig?.column === 'status'}
                                    direction={sortConfig?.column === 'status' ? sortConfig.direction : 'asc'}
                                    onClick={() => handleThClick('status')}
                                >
                                    Status
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">Countdown</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.from(sortedOrders).map(order => (
                            <ShowOrder order={order} key={order.id + order.timeOfOrder} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {selectedOrder && <OrderPopupSeller order={selectedOrder} onClose={onClose} />}
        </Container>
    );
}

export default AllOrdersSeller;
