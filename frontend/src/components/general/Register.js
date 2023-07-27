import React, { useState } from "react";
import '../../style.css';
import { RegisterUser } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Card, CardContent, Typography, Link, TextField, Select, MenuItem, FormControl, InputLabel, Container, Box } from '@mui/material';
import { GoogleLogin } from "@react-oauth/google";

function Register() {
  const [errorMessages, setErrorMessages] = useState({});
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const navigate = useNavigate();

  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div style={{ color: 'red', fontSize: '15px' }}>{errorMessages.message}</div>
    );

  function validate(event) {
    var valid = true;
    const username = event.target.username.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value; 
    const email = event.target.email.value;
    const name = event.target.name.value;
    const lastname = event.target.lastname.value;
    const date = event.target.date.value;
    const usertype = event.target.usertype.value;
    const address = event.target.address.value;

    if (username.trim() === "") {
      setErrorMessages({ name: "username", message: "Username is required!" });
      valid = false;
    }
    if (password.trim() === "") {
      setErrorMessages({ name: "password", message: "Password is required!" });
      valid = false;
    }
    if (confirmPassword.trim() === "") { 
      setErrorMessages({ name: "confirmPassword", message: "Confirm password is required!" });
      valid = false;
    } else if (password !== confirmPassword) { 
      setErrorMessages({ name: "confirmPassword", message: "Passwords do not match!" });
      valid = false;
    }
    if (email.trim() === "") {
      setErrorMessages({ name: "email", message: "Email is required!" });
      valid = false;
    }
    if (name.trim() === "") {
      setErrorMessages({ name: "name", message: "Name is required!" });
      valid = false;
    }
    if (lastname.trim() === "") {
      setErrorMessages({ name: "lastname", message: "Lastname is required!" });
      valid = false;
    }
    if (usertype.trim() === "") {
      setErrorMessages({ name: "usertype", message: "User Type is required!" });
      valid = false;
    }
    if (address.trim() === "") {
      setErrorMessages({ name: "address", message: "Address is required!" });
      valid = false;
    }
    if (!date) {
      setErrorMessages({ name: "date", message: "Date of birth is required!" });
      valid = false;
    }
    const y = new Date(date).getFullYear();

    if (y > 2020 || y < 1900) {
      setErrorMessages({ name: "date", message: "Date is out of bounds!" });
      valid = false;
    }
    if (!file) {
      setErrorMessages({ name: "picture", message: "Picture is required!" });
      valid = false;
    }
    return valid;
  }

  const register = async (data) => {
    const r = await RegisterUser(data);
    if (r === null) {
      console.log("error");
    } else {
      toast.success('Successful registration!');
      navigate('../login');
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    setErrorMessages({ name: "username", message: "" });
    setErrorMessages({ name: "password", message: "" });
    setErrorMessages({ name: "confirmPassword", message: "" }); 
    setErrorMessages({ name: "email", message: "" });
    setErrorMessages({ name: "name", message: "" });
    setErrorMessages({ name: "lastname", message: "" });
    setErrorMessages({ name: "date", message: "" });
    setErrorMessages({ name: "address", message: "" });
    setErrorMessages({ name: "usertype", message: "" });
    setErrorMessages({ name: "picture", message: "" });

    if (validate(event)) {
      const formData = new FormData();
      formData.append('username', event.target.username.value);
      formData.append('name', event.target.name.value);
      formData.append('lastname', event.target.lastname.value);
      formData.append('password', event.target.password.value);
      formData.append('birthday', event.target.date.value);
      formData.append('email', event.target.email.value);
      formData.append('address', event.target.address.value);
      formData.append('usertype', event.target.usertype.value);
      formData.append('file', file);

      register(formData);
    }
  }

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    let value = URL.createObjectURL(event.target.files[0]);
    setImage(value);
  };

  function googleLoginHandle(response) {
    console.log(response.credential);
    navigate('../googleregister', { state: response.credential });
  }

  function googleLoginErrorHandle() {
    toast.error('Google login error');
  }

  return (
    <Container maxWidth="sm">
      <Box mt={5} display="flex" justifyContent="center">
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              Register
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                id="username"
                label="Username"
                type="text"
                name="username"
                fullWidth
                margin="normal"
              />
              {renderErrorMessage("username")}
              <TextField
                id="name"
                label="Name"
                type="text"
                name="name"
                fullWidth
                margin="normal"
              />
              {renderErrorMessage("name")}
              <TextField
                id="lastname"
                label="Lastname"
                type="text"
                name="lastname"
                fullWidth
                margin="normal"
              />
              {renderErrorMessage("lastname")}
              <TextField
                id="email"
                label="Email"
                type="email"
                name="email"
                fullWidth
                margin="normal"
              />
              {renderErrorMessage("email")}
              <TextField
                id="password"
                label="Password"
                type="password"
                name="password"
                fullWidth
                margin="normal"
              />
              {renderErrorMessage("password")}
              <TextField
                id="confirmPassword"
                label="Confirm Password" 
                type="password"
                name="confirmPassword"
                fullWidth
                margin="normal"
              />
              {renderErrorMessage("confirmPassword")}
              <TextField
                id="date"
                label="Date of Birth"
                type="date"
                name="date"
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              {renderErrorMessage("date")}
              <TextField
                id="address"
                label="Address"
                type="text"
                name="address"
                fullWidth
                margin="normal"
              />
              {renderErrorMessage("address")}
              <FormControl fullWidth margin="normal">
                <InputLabel id="usertype-label">User Type</InputLabel>
                <Select
                  labelId="usertype-label"
                  id="usertype"
                  name="usertype"
                  label="User Type"
                >
                  <MenuItem value="buyer">Buyer</MenuItem>
                  <MenuItem value="seller">Seller</MenuItem>
                </Select>
                {renderErrorMessage("usertype")}
              </FormControl>
              {image && <img src={image} alt="Preview" width="50px" height="50px" />}

              <TextField
                id="picture"
                label="Profile Picture"
                type="file"
                name="picture"
                accept=".jpg,.jpeg,.png"
                fullWidth
                margin="normal"
                onChange={handleFileChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              {renderErrorMessage("picture")}
              <Button variant="outlined" type="submit" fullWidth>
                Register
              </Button>
              <Typography variant="body1" component="div">
                Or register with Google:
              </Typography>
              <GoogleLogin onSuccess={googleLoginHandle} onError={googleLoginErrorHandle} />
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default Register;
