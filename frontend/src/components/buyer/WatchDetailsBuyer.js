import React, { useState, useEffect } from "react";
import { GetProductDetails } from "../../services/productService";
import {Dialog,DialogTitle,DialogContent,DialogActions,Button,Typography,Table,TableContainer,TableBody,TableCell,TableRow,IconButton,TextField,Box} from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import CloseIcon from "@mui/icons-material/Close";
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded';

function WatchDetails({ productId, onClose, onAddToCart }) {
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const getDetails = async () => {
            const response = await GetProductDetails(productId);
            setProduct(response.data);
        };

        getDetails();
    }, [productId]);

    const handleClose = () => {
        setProduct(null);
        onClose();
    };

    const handleAddToCart = () => {
        onAddToCart(product, quantity);
        handleClose();
    };

    const handleQuantityChange = (event) => {
        setQuantity(event.target.value);
    };

    return (
        <Dialog open={!!product} onClose={handleClose} maxWidth="sm" fullWidth>
            {product && (
                <>
                    <DialogTitle>
                        {product.brand} - {product.model}
                        <IconButton onClick={handleClose}  sx={{ position: "absolute", top: 0, right: 0 }}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <Carousel>
                            <div>
                                <img src={"data:image/png;base64," + product.profilePicture} alt="Product" />
                            </div>
                            {product.additionalPictures &&
                                product.additionalPictures.map((picture, index) => (
                                    <div key={index}>
                                        <img src={"data:image/png;base64," + picture} alt={`Additional ${index + 1}`} />
                                    </div>
                                ))}
                        </Carousel>
                        <TableContainer>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell colSpan={2}>
                                            <Typography variant="body1">
                                                <b>Description:</b>
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={2}>
                                            <div
                                                style={{
                                                    border: "1px solid #ccc",
                                                    padding: "10px",
                                                    marginBottom: "10px",
                                                    textAlign: "center",
                                                }}
                                            >
                                                <Typography variant="body1">{product.description}</Typography>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="body1">
                                                <b>Price:</b>
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{product.price}</Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="body1">
                                                <b>In stock:</b>
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{product.quantity}</Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="body1">
                                                <b>Warranty:</b>
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{product.warranty}</Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="body1">
                                                <b>Material:</b>
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{product.material}</Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="body1">
                                                <b>Gender:</b>
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{product.gender}</Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="body1">
                                                <b>Mechanism:</b>
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{product.mechanism}</Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="body1">
                                                <b>Case Diameter:</b>
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{product.caseDiameter}</Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="body1">
                                                <b>Bracelet Material:</b>
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{product.braceletMaterial}</Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="body1">
                                                <b>Waterproof:</b>
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{product.waterproof}</Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DialogContent>
                    <DialogActions>
                        <Box display="flex" alignItems="center">
                            <form>

                                <TextField
                                    type="number"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    inputProps={{ min: 1, max: product.quantity }}
                                    
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleAddToCart}
                                    color="primary"
                                    sx={{ ml: 2,height:"50px"}}
                                    type="submit"
                                    startIcon={<AddShoppingCartRoundedIcon/>}
                                >
                                    Add to cart
                                </Button>
                            </form>

                        </Box>
                    </DialogActions>
                </>
            )}
        </Dialog>
    );
}

export default WatchDetails;
