import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EditProductSeller, GetProductDetails } from "../../services/productService";
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Product from "../model/Product";

function EditProduct() {
  const [product, setProduct] = useState(null);
  const [errorMessages, setErrorMessages] = useState({});
  const [file, setFile] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [gender, setGender] = useState("");
  const [braceletMaterial, setBraceletMaterial] = useState("");
  const [warranty, setWarranty] = useState("");
  const [waterproof, setWaterproof] = useState("");
  const [material, setMaterial] = useState("");
  const [mechanism, setMechanism] = useState("");
  const [caseDiameter, setCaseDiameter] = useState("");
  const nav = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const productId = location.state;
    const getData = async () => {
      const resp = await GetProductDetails(productId);
      const p = new Product(resp.data);
      setProduct(p);
      setGender(p.gender);
      setBraceletMaterial(p.braceletMaterial);
      setWarranty(p.warranty);
      setWaterproof(p.waterproof);
      setMaterial(p.material);
      setMechanism(p.mechanism);
      setCaseDiameter(p.caseDiameter);
      setFile(p.profilePicture);
      setAdditionalImages(resp.data.additionalPictures);
    };
    getData();
  }, []);
  useEffect(() => {

  }, [additionalImages]);

  const createImgSrc = (bytes) => {
    if (bytes instanceof File) {
      return URL.createObjectURL(bytes);
    } else {
      const imageUrl = `data:image/png;base64,${bytes}`;
      return imageUrl;
    }
  };

  const renderErrorMessage = (name) =>
    name in errorMessages && (
      <div style={{ color: 'red', fontSize: '15px' }}>{errorMessages[name]}</div>
    );

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleAdditionalImagesChange = (event) => {
    const files = event.target.files;
    const newImages = Array.from(files);
  
    setAdditionalImages(newImages);
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleBraceletMaterialChange = (event) => {
    setBraceletMaterial(event.target.value);
  };

  const handleWarrantyChange = (event) => {
    setWarranty(event.target.value);
  };

  const handleWaterproofChange = (event) => {
    setWaterproof(event.target.value);
  };

  const handleMaterialChange = (event) => {
    setMaterial(event.target.value);
  };

  const handleMechanismChange = (event) => {
    setMechanism(event.target.value);
  };

  const handleCaseDiameterChange = (event) => {
    setCaseDiameter(event.target.value);
  };

  const validate = (event) => {
    const brand = event.target.brand.value.trim();
    const model = event.target.model.value.trim();
    const price = event.target.price.value;
    const quantity = event.target.quantity.value;
    const description = event.target.description.value.trim();

    const errors = {};

    if (brand === "") {
      errors.brand = "Brand is required!";
    }

    if (model === "") {
      errors.model = "Model is required!";
    }

    if (price <= 0) {
      errors.price = "Price must be greater than 0!";
    }

    if (quantity <= 0) {
      errors.quantity = "Quantity must be greater than 0!";
    }

    if (description === "") {
      errors.description = "Description is required!";
    }

    if (gender === "") {
      errors.gender = "Gender is required!";
    }

    if (braceletMaterial === "") {
      errors.braceletMaterial = "Bracelet material is required!";
    }

    if (warranty === "") {
      errors.warranty = "Warranty information is required!";
    }

    if (waterproof === "") {
      errors.waterproof = "Waterproof information is required!";
    }

    if (material === "") {
      errors.material = "Material information is required!";
    }

    if (caseDiameter === "") {
      errors.caseDiameter = "Case diameter is required!";
    }

    if (!file) {
      errors.picture = "Picture is required!";
    }

    if (additionalImages.length === 0) {
      errors.additionalImages = "Please select at least one additional image!";
    }

    setErrorMessages(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessages({});
    if (validate(event)) {
      const formData = new FormData(event.target);
      console.log(formData);
      formData.append("id", product.id);
      edit(formData);
    }
  };

  const edit = async (data) => {
    const r = await EditProductSeller(data);
    if (r) {
      toast.success('Editing product was successful!');
      nav('../allproducts');
    } else {
      toast.error('Error occurred while editing.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={6} md={4}>
          {product && (
            <div className="border border-gray rounded p-3 m-2 bg-light">
              <div className="m-2">
                <TextField label="Brand" name="brand" defaultValue={product.brand} fullWidth />
                {renderErrorMessage("brand")}
              </div>
              <div className="m-2">
                <TextField label="Model" name="model" defaultValue={product.model} fullWidth />
                {renderErrorMessage("model")}
              </div>
              <div className="m-2">
                <TextField label="Price" name="price" type="number" defaultValue={product.price} fullWidth />
                {renderErrorMessage("price")}
              </div>
              <div className="m-2">
                <TextField label="Quantity" name="quantity" type="number" defaultValue={product.quantity} fullWidth />
                {renderErrorMessage("quantity")}
              </div>
              <div className="m-2">
                <TextField label="Description" name="description" defaultValue={product.description} multiline rows={4} fullWidth />
                {renderErrorMessage("description")}
              </div>
              <div className="m-2">
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select value={gender} onChange={handleGenderChange} name="gender">
                    <MenuItem value="Men">Men</MenuItem>
                    <MenuItem value="Women">Women</MenuItem>
                    <MenuItem value="Unisex">Unisex</MenuItem>
                  </Select>
                </FormControl>
                {renderErrorMessage("gender")}
              </div>
              <div className="m-2">
                <FormControl fullWidth>
                  <InputLabel>Bracelet Material</InputLabel>
                  <Select value={braceletMaterial} onChange={handleBraceletMaterialChange} name="braceletMaterial">
                    <MenuItem value="Leather">Leather</MenuItem>
                    <MenuItem value="Steel">Steel</MenuItem>
                    <MenuItem value="Gold">Gold</MenuItem>
                    <MenuItem value="Nylon">Nylon</MenuItem>
                    <MenuItem value="Silicone">Silicone</MenuItem>
                  </Select>
                </FormControl>
                {renderErrorMessage("braceletMaterial")}
              </div>
              <div className="m-2">
                <FormControl fullWidth>
                  <InputLabel>Mechanism</InputLabel>
                  <Select value={mechanism} onChange={handleMechanismChange} name="mechanism">
                    <MenuItem value="Automatic">Automatic</MenuItem>
                    <MenuItem value="Quartz">Quartz</MenuItem>
                    <MenuItem value="Mechanical">Mechanical</MenuItem>
                    <MenuItem value="Digital">Digital</MenuItem>
                    <MenuItem value="Solar">Solar</MenuItem>
                  </Select>
                </FormControl>
                {renderErrorMessage("mechanism")}
              </div>
              <div className="m-2">
                <FormControl fullWidth>
                  <InputLabel>Warranty</InputLabel>
                  <Select value={warranty} onChange={handleWarrantyChange} name="warranty">
                    <MenuItem value="None">None</MenuItem>
                    <MenuItem value="1 year">1 year</MenuItem>
                    <MenuItem value="2 years">2 years</MenuItem>
                    <MenuItem value="3 years">3 years</MenuItem>
                    <MenuItem value="4 years">4 years</MenuItem>
                    <MenuItem value="5 years">5 years</MenuItem>
                  </Select>
                </FormControl>
                {renderErrorMessage("warranty")}
              </div>
              <div className="m-2">
                <FormControl fullWidth>
                  <InputLabel>Waterproof</InputLabel>
                  <Select value={waterproof} onChange={handleWaterproofChange} name="waterproof">
                    <MenuItem value="None">None</MenuItem>
                    <MenuItem value="50m">50m</MenuItem>
                    <MenuItem value="100m">100m</MenuItem>
                    <MenuItem value="200m">200m</MenuItem>
                    <MenuItem value="200+m">200+m</MenuItem>
                  </Select>
                </FormControl>
                {renderErrorMessage("waterproof")}
              </div>
              <div className="m-2">
                <FormControl fullWidth>
                  <InputLabel>Material</InputLabel>
                  <Select value={material} onChange={handleMaterialChange} name="material">
                    <MenuItem value="Stainless Steel">Stainless Steel</MenuItem>
                    <MenuItem value="Titanium">Titanium</MenuItem>
                    <MenuItem value="Ceramic">Ceramic</MenuItem>
                  </Select>
                </FormControl>
                {renderErrorMessage("material")}
              </div>
              <div className="m-2">
                <TextField label="Case Diameter" name="caseDiameter" defaultValue={caseDiameter} fullWidth />
                {renderErrorMessage("caseDiameter")}
              </div>
              <div className="m-2">
                <img src={createImgSrc(file)} width="100px" height="100px" alt="Product" />
              </div>
              <div className="m-2">
                <TextField label="Product Picture" name="file" type="file" accept=".jpg,.jpeg,.png" onChange={handleFileChange} InputLabelProps={{
                  shrink: true,
                }} fullWidth />
                {renderErrorMessage("picture")}
              </div>
              <div className="m-2">
                <div>
                  {additionalImages.map((image, index) => (
                    <img key={index} src={createImgSrc(image)} width="100px" height="100px" alt={`Additional ${index + 1}`} />
                  ))}
                </div>
                <div>
                  <TextField label="Additional Pictures" name="additionalImages" type="file" accept=".jpg,.jpeg,.png" InputLabelProps={{
                    shrink: true,
                  }} inputProps={{
                    multiple: true
                  }} onChange={handleAdditionalImagesChange} fullWidth />
                  {renderErrorMessage("additionalImages")}
                </div>
              </div>
              <div className="m-2">
                <Button variant="contained" color="primary" type="submit">Edit Product</Button>
              </div>
            </div>
          )}
        </Grid>
      </Grid>
    </form>
  );
}

export default EditProduct;
