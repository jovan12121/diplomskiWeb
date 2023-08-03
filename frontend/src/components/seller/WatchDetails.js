import React, { useState, useEffect } from "react";
import { GetProductDetails } from "../../services/productService";
import {Dialog,DialogTitle,DialogContent,DialogActions,Button,Typography,Table,TableContainer,TableBody,TableCell,TableRow,IconButton } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import EditRoundedIcon from '@mui/icons-material/EditRounded';

function formatDate(dateString) {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-GB");
  return formattedDate;
}

function ProductPopup({ productId, onClose }) {
  const nav = useNavigate();

  function handleEdit() {
    nav("../editproduct", { state: product.id });
  }

  const [product, setProduct] = useState(null);

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

  return (
    <Dialog open={!!product} maxWidth="sm" fullWidth>
      {product && (
        <>
          <DialogTitle>{product.brand} - {product.model}  <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton></DialogTitle>
          <DialogContent>
            <Carousel>
              <div>
                <img src={"data:image/png;base64," + product.profilePicture} alt="Product" />
              </div>
              {product.additionalPictures && product.additionalPictures.map((picture, index) => (
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
                      <Typography variant="body1"><b>Description:</b></Typography>
                    </TableCell>

                  </TableRow>
                  <TableRow>
                  <TableCell colSpan={2}>
                      <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px", textAlign: "center" }}>
                        <Typography variant="body1">{product.description}</Typography>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body1"><b>Price:</b></Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{product.price} RSD</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body1"><b>Quantity:</b></Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{product.quantity}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body1"><b>Warranty:</b></Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{product.warranty}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body1"><b>Material:</b></Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{product.material}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body1"><b>Gender:</b></Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{product.gender}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body1"><b>Date:</b></Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{formatDate(product.date)}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body1"><b>Mechanism:</b></Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{product.mechanism}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body1"><b>Case Diameter:</b></Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{product.caseDiameter}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body1"><b>Bracelet Material:</b></Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{product.braceletMaterial}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body1"><b>Waterproof:</b></Typography>
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
            {/* <Button onClick={handleClose} color="secondary">
              Close
            </Button> */}
            <Button variant="contained" onClick={() => handleEdit(product.Id)} startIcon={<EditRoundedIcon/>}>
              Edit
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

export default ProductPopup;
