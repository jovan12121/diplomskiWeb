import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { RegisterGoogle } from "../../services/userService";
import { TextField, Button, Box,Card, CardContent,Container } from "@mui/material";
import jwt_decode from "jwt-decode";
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

function GoogleRegister() {
  const [errorMessages, setErrorMessages] = useState({});
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const location = useLocation();
  const token = location.state;
  const [email, setEmail] = useState();
  const nav = useNavigate();

  useEffect(() => {
    var decToken = jwt_decode(token);
    setName(decToken.given_name);
    setLastname(decToken.family_name);
    setEmail(decToken.email);
  }, []);

  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div style={{ color: "red", fontSize: "15px" }}>{errorMessages.message}</div>
    );

  function validate(event) {
    let valid = true;
    const username = event.target.username.value;
    const name1 = event.target.name.value;
    const lastname = event.target.lastname.value;
    const date = event.target.date.value;
    const address = event.target.address.value;

    if (username.trim() === "") {
      setErrorMessages({ name: "username", message: "Username is required!" });
      valid = false;
    }
    if (name1.trim() === "") {
      setErrorMessages({ name: "name", message: "Name is required!" });
      valid = false;
    }
    if (lastname.trim() === "") {
      setErrorMessages({ name: "lastname", message: "Lastname is required!" });
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

  const reg = async (data) => {
    const r = await RegisterGoogle(data);

    if (r != null) {
      toast.success("Successful registration!");
      nav("../login");
    } else {
      console.log("error");
    }
  };

  function handleSubmit(event) {
    event.preventDefault();
    setErrorMessages({ name: "username", message: "" });
    setErrorMessages({ name: "name", message: "" });
    setErrorMessages({ name: "lastname", message: "" });
    setErrorMessages({ name: "date", message: "" });
    setErrorMessages({ name: "address", message: "" });
    setErrorMessages({ name: "picture", message: "" });

    if (validate(event)) {
      const formData = new FormData();
      formData.append("username", event.target.username.value);
      formData.append("name", event.target.name.value);
      formData.append("lastname", event.target.lastname.value);
      formData.append("birthday", event.target.date.value);
      formData.append("password", "");
      formData.append("email", email);
      formData.append("address", event.target.address.value);
      formData.append("usertype", "buyer");
      formData.append("file", file);
      formData.append("token", token);

      reg(formData);
    }
  }

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    let value = URL.createObjectURL(event.target.files[0]);
    setImage(value);
  };

  return (
    <Container maxWidth="sm">
      <Card>
      <CardContent>

      <form onSubmit={handleSubmit}>
        <Box display="flex" justifyContent="center" alignItems="center" p={2}>
          <Box sx={{ "& .MuiFormControl-root": { mb: 3 } }}>
            <TextField
              type="text"
              name="username"
              label="Username"
              variant="outlined"
              fullWidth
            />
            {renderErrorMessage("username")}
            <TextField
              type="text"
              name="name"
              label="Name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {renderErrorMessage("name")}
            <TextField
              type="text"
              name="lastname"
              label="Lastname"
              variant="outlined"
              fullWidth
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
            {renderErrorMessage("lastname")}
            <TextField
              type="date"
              name="date"
              label="Date of Birth"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
            {renderErrorMessage("date")}
            <TextField
              type="text"
              name="address"
              label="Address"
              variant="outlined"
              fullWidth
            />
            {renderErrorMessage("address")}
            <Box>
              {image && <img src={image} alt="Preview" width="50px" height="50px" />}
              <TextField
                type="file"
                name="image"
                accept=".jpg,.jpeg,.png"
                InputLabelProps={{
                    shrink: true,
                  }}
                onChange={handleFileChange}
              />
              {renderErrorMessage("picture")}
            </Box>
            <Button variant="contained" type="submit" fullWidth startIcon={<AccountCircleRoundedIcon/>}>
              Register
            </Button>
          </Box>
        </Box>
      </form>
      </CardContent>
      </Card>
    </Container>
  );
}

export default GoogleRegister;
