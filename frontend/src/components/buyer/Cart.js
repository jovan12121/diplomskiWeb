import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {Dialog,DialogContent,DialogTitle,Button,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,IconButton,Box} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import "../../style.css";

function Cart({ items, onClearCart, onClose, removeItem }) {
    const nav = useNavigate();
    const [list, setList] = useState([]);
    const [sum, setSum] = useState(0);
    const [quantityCheck, setQuantityCheck] = useState(true);
    const [open, setOpen] = useState(true);

    useEffect(() => {
        setList(items);
        const total = items.reduce((accumulator, currentItem) => {
            return accumulator + currentItem.product.price * currentItem.orderQuantity;
        }, 0);
        setSum(total);
    }, [items]);

    function findIndex(itemId) {
        const index = list.findIndex((item) => item.product.id === itemId);
        return index;
    }

    function updateSum(updatedList) {
        let total = 0;
        for (let i = 0; i < updatedList.length; i++) {
            const item = updatedList[i];
            total += item.product.price * item.orderQuantity;
        }
        setSum(total);
    }

    function handleQuantityChange(itemId, event) {
        const index = findIndex(itemId);
        const updatedList = [...list];
        const q = parseInt(event.target.value);
        if (q < 0 || q > list[index].product.quantity) {
            setQuantityCheck(false);
        } else setQuantityCheck(true);
        updatedList[index].orderQuantity = q;
        setList(updatedList);
        const total = updatedList.reduce((accumulator, currentItem) => {
            return accumulator + currentItem.product.price * currentItem.orderQuantity;
        }, 0);
        setSum(total);
    }

    function remove(itemId) {
        const updatedList = list.filter((item) => item.product.id !== itemId);
        setList(updatedList);
        updateSum(updatedList);
    }

    const countUniqueOwnerIds = (arr) => {
        const uniqueOwnerIds = new Set(arr.map((obj) => obj.product.ownerId));
        console.log(uniqueOwnerIds);
        return uniqueOwnerIds.size;
    };

    function handleClick(event) {
        // event.preventDefault();
        // var dataList = [];
        // list.forEach((element) => {
        //     dataList.push({ productId: element.product.id, orderQuantity: element.orderQuantity });
        // });
        // var data = {
        //     products: dataList,
        //     comment: event.target.comment.value,
        //     address: event.target.address.value,
        //     totalPrice: sum + countUniqueOwnerIds(list) * 300,
        //     buyerUsername: localStorage.getItem("user"),
        // };
        // order(data);
        event.preventDefault();
        var dataList = [];
        list.forEach((element)=>
        {
            dataList.push({productId: element.product.id,productBrand:element.product.brand,productModel:element.product.model, orderQuantity:element.orderQuantity,picture:element.product.profilePicture,price:element.product.price});
        });
        nav("../confirmorder",{ state: dataList });
    }

    const handleClose = () => {
        setOpen(false);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
                <IconButton aria-label="close" onClick={handleClose} sx={{ position: "absolute", right: 8, top: 8 }}>
                    <CloseIcon />
                </IconButton>
                Your Cart
            </DialogTitle>
            <DialogContent>
                {list.length === 0 && <p>Your Cart is Empty!</p>}
                {list.length !== 0 && (
                    <>
                        <Box display="flex" justifyContent="flex-end" mb={2}>
                            <Button onClick={onClearCart} variant="outlined" color="primary">
                                Clear Cart
                            </Button>
                        </Box>

                        <form onSubmit={(event) => handleClick(event)}>
                            <Box display="flex" justifyContent="center">
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Picture</TableCell>
                                                <TableCell>Brand</TableCell>
                                                <TableCell>Model</TableCell>
                                                <TableCell>Price</TableCell>
                                                <TableCell>Quantity</TableCell>
                                                <TableCell>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {list.map((item) => (
                                                <TableRow key={item.product.id}>
                                                    <TableCell>
                                                        <img width="40" height="40" src={`data:image/png;base64,${item.product.profilePicture}`} alt="" />
                                                    </TableCell>
                                                    <TableCell>{item.product.brand}</TableCell>
                                                    <TableCell>{item.product.model}</TableCell>
                                                    <TableCell>{item.product.price}</TableCell>
                                                    <TableCell>
                                                        <input
                                                            type="number"
                                                            max={item.product.quantity}
                                                            defaultValue={item.orderQuantity}
                                                            onChange={(event) => handleQuantityChange(item.product.id, event)}
                                                            style={{ width: "75px" }}
                                                            min={1}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton
                                                            onClick={() => {
                                                                remove(item.product.id);
                                                                removeItem(item.product.id);
                                                            }}
                                                            color="primary"
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <b>Sum:</b>
                                        </TableCell>
                                        <TableCell>{sum}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <b>Delivery Costs:</b>
                                        </TableCell>
                                        <TableCell>{countUniqueOwnerIds(list) * 300}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <b>Total: </b>
                                        </TableCell>
                                        <TableCell>{sum + countUniqueOwnerIds(list) * 300}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            {sum > 0 && quantityCheck && (
                                <>

                                    <Button type="submit" variant="contained" color="success" className="mt-3">
                                        Order
                                    </Button>
                                </>
                            )}
                            {(sum <= 0 || !quantityCheck) && <p>Invalid quantity</p>}

                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default Cart;
