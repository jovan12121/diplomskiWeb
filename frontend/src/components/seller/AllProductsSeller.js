import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeleteProduct, GetProductsBySeller } from "../../services/productService";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Product from "../model/Product";
import { Delete as DeleteIcon, Edit as EditIcon, Visibility as VisibilityIcon } from "@mui/icons-material";
import ProductPopup from "./WatchDetails";

import {Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,IconButton,TableSortLabel} from "@mui/material";

function AllProductsSeller() {
  const [sortConfig, setSortConfig] = useState(null);
  const nav = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const sortedProducts = [...products].sort((product1, product2) => {
    if (!sortConfig) {
      return 0;
    }

    const { column, direction } = sortConfig;

    if (product1[column] < product2[column]) {
      return direction === "asc" ? -1 : 1;
    }
    if (product1[column] > product2[column]) {
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

  async function deleteProduct(id) {
    const resp = await DeleteProduct(id);
    if (resp) {
      toast.success("Successfully deleted!");
      const updatedList = products.filter((item) => item.id !== id);
      setProducts(updatedList);
    } else {
      toast.error("Error occurred while deleting.");
    }
  }

  function editProduct(product) {
    nav("../editproduct", { state: product });
  }

  function viewDetails(product) {
    openPopup(product.id);
  }

  function openPopup(productId) {
    setSelectedProductId(productId);
    setShowPopup(true);
  }

  useEffect(() => {
    const u = localStorage.getItem("user");
    const getProducts = async () => {
      const resp = await GetProductsBySeller(u);
      const productData = resp.data.map((data) => new Product(data));
      setProducts(productData);
    };
    getProducts();
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }} className="container">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ textAlign: "center" }}>
                  <TableSortLabel
                    active={sortConfig && sortConfig.column === "brand"}
                    direction={sortConfig && sortConfig.column === "brand" ? sortConfig.direction : "asc"}
                    onClick={() => handleThClick("brand")}
                  >
                    Brand
                  </TableSortLabel>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <TableSortLabel
                    active={sortConfig && sortConfig.column === "model"}
                    direction={sortConfig && sortConfig.column === "model" ? sortConfig.direction : "asc"}
                    onClick={() => handleThClick("model")}
                  >
                    Model
                  </TableSortLabel>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <TableSortLabel
                    active={sortConfig && sortConfig.column === "quantity"}
                    direction={sortConfig && sortConfig.column === "quantity" ? sortConfig.direction : "asc"}
                    onClick={() => handleThClick("quantity")}
                  >
                    In stock
                  </TableSortLabel>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <TableSortLabel
                    active={sortConfig && sortConfig.column === "price"}
                    direction={sortConfig && sortConfig.column === "price" ? sortConfig.direction : "asc"}
                    onClick={() => handleThClick("price")}
                  >
                    Price
                  </TableSortLabel>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>Profile Picture</TableCell>
                <TableCell style={{ textAlign: "center" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from(sortedProducts).map((product) => (
                <TableRow key={product.id}>
                  <TableCell style={{ textAlign: "center" }}>{product.brand}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>{product.model}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>{product.quantity}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>{product.price}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <img width="60" height="60" src={"data:image/png;base64," + product.profilePicture} alt="" />
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <IconButton onClick={() => editProduct(product.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => deleteProduct(product.id)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => viewDetails(product)}>
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="container">
        <Link to="../addproduct" className="link-dark">
          Add product
        </Link>
      </div>
      {showPopup && (
        <ProductPopup productId={selectedProductId} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
}

export default AllProductsSeller;
