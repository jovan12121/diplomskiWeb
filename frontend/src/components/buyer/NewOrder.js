import React, { useState, useEffect, useRef } from "react";
import { GetAllProducts } from "../../services/productService";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import "../../style.css";
import { Card,Button,Container,Grid,Typography,CardMedia,CardContent,TableRow,Table,TableHead,TableBody,TableCell,TextField,} from "@mui/material";
import Cart from "../buyer/Cart";
import Product from "../model/Product";
import WatchDetails from "./WatchDetailsBuyer";
import { CSSTransition } from "react-transition-group";
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import FilterAltOffRoundedIcon from '@mui/icons-material/FilterAltOffRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
function NewOrder() {
  const [sortConfig, setSortConfig] = useState(null);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [genderFilters, setGenderFilters] = useState([]);
  const [brandFilters, setBrandFilters] = useState([]);
  const [caseDiameterFilters, setCaseDiameterFilters] = useState([]);
  const [mechanismFilters, setMechanismFilters] = useState([]);
  const [warrantyFilters, setWarrantyFilters] = useState([]);
  const [braceletMaterialFilters, setBraceletMaterialFilters] = useState([]);
  const [waterproofFilters, setWaterproofFilters] = useState([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isSorting, setIsSorting] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filterValues, setFilterValues] = useState({
    gender: "",
    brand: "",
    caseDiameter: "",
    braceletMaterial: "",
    waterproof: "",
    mechanism: "",
    warranty: "",
    minPrice: "",
    maxPrice: "",
  });

  const csstransitionRef = useRef(null); 

  function findIndex(itemId) {
    const index = cartItems.findIndex((item) => item.product.id === itemId);
    return index;
  }

  function removeItem(itemId) {
    const i = findIndex(itemId);
    const list = cartItems;
    list.splice(i, 1);
    setCartItems([...list]); 
  }

  function addToCart(product, quantity) {
    const i = findIndex(product.id);
    if (i === -1) {
      const item = {
        product: product,
        orderQuantity: quantity,
      };
      setCartItems((items) => [...items, item]);
    } else {
      const item = cartItems[i];
      item.orderQuantity = +item.orderQuantity + +quantity;
      setCartItems([...cartItems]);
    }
  }

  useEffect(() => {
    const getProducts = async () => {
      const resp = await GetAllProducts();
      const mappedProducts = resp.data.map((product) => new Product(product));
      setProducts(mappedProducts);
      setGenderFilters(Array.from(new Set(mappedProducts.map((product) => product.gender))).sort());
      setBrandFilters(Array.from(new Set(mappedProducts.map((product) => product.brand))).sort());
      setCaseDiameterFilters(Array.from(new Set(mappedProducts.map((product) => product.caseDiameter))).sort());
      setBraceletMaterialFilters(Array.from(new Set(mappedProducts.map((product) => product.braceletMaterial))).sort());
      setWaterproofFilters(Array.from(new Set(mappedProducts.map((product) => product.waterproof))).sort());
      setMechanismFilters(Array.from(new Set(mappedProducts.map((product) => product.mechanism))).sort());
      setWarrantyFilters(Array.from(new Set(mappedProducts.map((product) => product.warranty))).sort());
    };
    getProducts();
  }, []);

  function ShowProduct({ product }) {
    const imgUrl = `data:image/png;base64,${product.profilePicture}`;

    const handlePictureClick = () => {
      setSelectedProduct(product);
    };

    if (product.quantity === 0) return null;

    const handleAddToCart = (event) => {
      event.preventDefault();
      const quantity = event.target.quantity.value;
      addToCart(product, quantity);
    };

    return (
      <Card sx={{ width: 300, height: "100%", textAlign: "center" }} raised>
        <div onClick={handlePictureClick}>
          <CardMedia component="img" height="250" image={imgUrl} alt={product.name} className="mt-2" />
        </div>
        <CardContent>
          <Typography variant="h6">
            {product.brand} {product.model}
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="body2">
                    <b>Price:</b>
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{product.price} RSD</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell rowSpan={2} sx={{ textAlign: "center" }} colSpan={2}>
                  {!isCartOpen && product.quantity > 0 && (
                    <Grid container alignItems="center" justifyContent="center">
                      <form onSubmit={handleAddToCart}>
                        <TextField
                          type="number"
                          defaultValue={1}
                          inputProps={{ min: 1, max: product.quantity }}
                          name="quantity"
                          className="mr-2"
                          label="Quantity"
                        />
                        <Button variant="outlined" type="submit" sx={{ mt: 2, width: "100%" }} startIcon={<AddShoppingCartRoundedIcon/>}>
                          Add to cart
                        </Button>
                      </form>
                    </Grid>
                  )}
                  {isCartOpen && product.quantity > 0 && (
                    <Grid container alignItems="center" justifyContent="center">
                      <form>
                        <TextField
                          type="number"
                          defaultValue={1}
                          inputProps={{ min: 1, max: product.quantity }}
                          name="quantity"
                          className="mr-2"
                          label="Quantity"
                          disabled
                        />
                        <Button variant="outlined" type="submit" sx={{ mt: 2, width: "100%" }} disabled startIcon={<AddShoppingCartRoundedIcon/>}>
                          Add to cart
                        </Button>
                      </form>
                    </Grid>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleCartClose = () => {
    setIsCartOpen(false);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setIsFiltering(true);

    setTimeout(() => {
      setFilterValues((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      setIsFiltering(false);
    }, 300);
  };

  const handleToggleFilters = () => {
    setIsFilterVisible((prevState) => !prevState);
  };

  const handleResetFilter = () => {
    setFilterValues({
      gender: "",
      brand: "",
      caseDiameter: "",
      braceletMaterial: "",
      waterproof: "",
      mechanism: "",
      warranty: "",
      minPrice: "",
      maxPrice: "",
    });
  };

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

  const filteredProducts = sortedProducts.filter((product) => {
    const { gender, brand, caseDiameter, braceletMaterial, waterproof, mechanism, warranty, minPrice, maxPrice } = filterValues;

    if (gender && product.gender !== gender) {
      return false;
    }
    if (brand && product.brand !== brand) {
      return false;
    }
    if (caseDiameter && product.caseDiameter !== caseDiameter) {
      return false;
    }
    if (braceletMaterial && product.braceletMaterial !== braceletMaterial) {
      return false;
    }
    if (waterproof && product.waterproof !== waterproof) {
      return false;
    }
    if (mechanism && product.mechanism !== mechanism) {
      return false;
    }
    if (warranty && product.warranty !== warranty) {
      return false;
    }
    if (minPrice && product.price < minPrice) {
      return false;
    }
    if (maxPrice && product.price > maxPrice) {
      return false;
    }
    return true;
  });

  const handleSortingChange = (event) => {
    const { value } = event.target;
    let column = "";
    let direction = "";

    switch (value) {
      case "date":
        column = "date";
        direction = "desc";
        break;
      case "price-lower":
        column = "price";
        direction = "asc";
        break;
      case "price-higher":
        column = "price";
        direction = "desc";
        break;
      default:
        break;
    }

    setIsSorting(true);

    setTimeout(() => {
      setSortConfig({ column, direction });
      setIsSorting(false);
    }, 300);
  };

  return (
    <Container style={{ maxWidth: "80%" }}>
      <Grid container spacing={1} className={isFilterVisible ? "filter-options show" : "filter-options hide"}>
        <Grid item xs={12} sm={4} md={2}>
          <FormControl sx={{ mt: 2, minWidth: 175 }}>
            <InputLabel id="gender-select-label">Gender</InputLabel>
            <Select
              labelId="gender-select-label"
              id="gender-select"
              name="gender"
              value={filterValues.gender}
              onChange={handleFilterChange}
              label="Gender"
            >
              {genderFilters && genderFilters.map((genderOption) => (
                <MenuItem key={genderOption} value={genderOption}>
                  {genderOption}
                </MenuItem>
              ))}
              <MenuItem value="">All</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <FormControl sx={{ mt: 2, minWidth: 175 }}>
            <InputLabel id="brand-select-label">Brand</InputLabel>
            <Select
              labelId="brand-select-label"
              id="brand-select"
              name="brand"
              value={filterValues.brand}
              onChange={handleFilterChange}
              label="Brand"
            >
              <MenuItem value="">All</MenuItem>
              {brandFilters && brandFilters.map((brandOption) => (
                <MenuItem key={brandOption} value={brandOption}>
                  {brandOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <FormControl sx={{ mt: 2, minWidth: 175 }}>
            <InputLabel id="waterproof-select-label">Waterproof</InputLabel>
            <Select
              labelId="waterproof-select-label"
              id="waterproof-select"
              name="waterproof"
              value={filterValues.waterproof}
              onChange={handleFilterChange}
              label="Waterproof"
            >
              <MenuItem value="">All</MenuItem>
              {waterproofFilters && waterproofFilters.map((waterproofOption) => (
                <MenuItem key={waterproofOption} value={waterproofOption}>
                  {waterproofOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <FormControl sx={{ mt: 2, minWidth: 175 }}>
            <InputLabel id="warranty-select-label">Warranty</InputLabel>
            <Select
              labelId="warranty-select-label"
              id="warranty-select"
              name="warranty"
              value={filterValues.warranty}
              onChange={handleFilterChange}
              label="Warranty"
            >
              <MenuItem value="">All</MenuItem>
              {warrantyFilters && warrantyFilters.map((warrantyOption) => (
                <MenuItem key={warrantyOption} value={warrantyOption}>
                  {warrantyOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <FormControl sx={{ mt: 2, minWidth: 175 }}>
            <InputLabel id="braceletMaterial-select-label">Bracelet Material</InputLabel>
            <Select
              labelId="braceletMaterial-select-label"
              id="braceletMaterial-select"
              name="braceletMaterial"
              label="Bracelet Material"
              value={filterValues.braceletMaterial}
              onChange={handleFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              {braceletMaterialFilters && braceletMaterialFilters.map((braceletMaterialOption) => (
                <MenuItem key={braceletMaterialOption} value={braceletMaterialOption}>
                  {braceletMaterialOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <FormControl sx={{ mt: 2, minWidth: 175 }}>
            <InputLabel id="caseDiameter-select-label">Case Diameter</InputLabel>
            <Select
              labelId="caseDiameter-select-label"
              id="caseDiameter-select"
              name="caseDiameter"
              value={filterValues.caseDiameter}
              onChange={handleFilterChange}
              label="Case Diameter"
            >
              <MenuItem value="">All</MenuItem>
              {caseDiameterFilters && caseDiameterFilters.map((caseDiameterOption) => (
                <MenuItem key={caseDiameterOption} value={caseDiameterOption}>
                  {caseDiameterOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <FormControl sx={{ mt: 2, minWidth: 175 }}>
            <InputLabel id="mechanism-select-label">Mechanism</InputLabel>
            <Select
              labelId="mechanism-select-label"
              id="mechanism-select"
              name="mechanism"
              value={filterValues.mechanism}
              onChange={handleFilterChange}
              label="Mechanism"
            >
              <MenuItem value="">All</MenuItem>
              {mechanismFilters && mechanismFilters.map((mechanismOption) => (
                <MenuItem key={mechanismOption} value={mechanismOption}>
                  {mechanismOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <FormControl sx={{ mt: 2, width: 175 }}>

            <TextField
              type="number"
              inputProps={{
                inputMode: "numeric",
                style: { appearance: "textfield" },
              }}
              label="Min Price"
              name="minPrice"
              value={filterValues.minPrice}
              onChange={handleFilterChange}
              fullWidth
            />
          </FormControl>

        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <FormControl sx={{ mt: 2, width: 175 }}>

            <TextField
              type="number"
              inputProps={{
                inputMode: "numeric",
                style: { appearance: "textfield" },
              }}
              label="Max Price"
              name="maxPrice"
              value={filterValues.maxPrice}
              onChange={handleFilterChange}
              fullWidth
            />
          </FormControl>

        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <FormControl sx={{ mt: 2, width: 175 }}>
            <Button variant="outlined" color="primary" style={{ height: '56px' }} onClick={handleResetFilter} startIcon={<ClearRoundedIcon/>}>
              Reset Filters
            </Button>
          </FormControl>

        </Grid>
      </Grid>
      <Grid container justifyContent="space-between">
        <Grid item xs={12} md={6}>
          <Button
            variant="outlined"
            color="primary"
            style={{ height: '56px' }}
            onClick={handleToggleFilters}
            className="mt-3"
            startIcon={isFilterVisible ? <FilterAltOffRoundedIcon/>:<FilterAltRoundedIcon/>  }
          >
            {isFilterVisible ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </Grid>
        <Grid item xs={12} md={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <FormControl sx={{ mt: 2, width: 250,mr:2 }}>
            <InputLabel id="sort-label">Sort by</InputLabel>
            <Select labelId="sort-label" name="sortSelect" onChange={handleSortingChange} label="Sort by">
              <MenuItem value="date" >Date</MenuItem>
              <MenuItem value="price-lower">Price:from lower to higher</MenuItem>
              <MenuItem value="price-higher">Price:from higher to lower</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={1} mt={1}>
        {filteredProducts.map((product, index) => (
          <CSSTransition
            key={product.id}
            nodeRef={csstransitionRef} 
            in={!isFiltering && !isSorting}
            classNames="fade"
            timeout={300}
            unmountOnExit
            appear
          >
            <Grid item xs={12} sm={12} md={4} lg={3}>
              <ShowProduct product={product} />
            </Grid>
          </CSSTransition>
        ))}
      </Grid>
      <div
        className="text-center mt-3 position-sticky"
        style={{ position: "sticky", bottom: "20px", right: "20px", zIndex: "1000", textAlign: "center" }}
      >
        <Button variant="contained" onClick={handleCartClick} startIcon={<ShoppingCartRoundedIcon />}>
          View Cart ({cartItems.length})
        </Button>
        {selectedProduct && (
          <WatchDetails productId={selectedProduct.id} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} />
        )}
        {isCartOpen && (
          <Cart items={cartItems} onClearCart={() => setCartItems([])} onClose={handleCartClose} removeItem={removeItem} />
        )}
      </div>
    </Container>
  );
}

export default NewOrder;
