import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GetUserData, EditProfile } from "../../services/userService";
import { TextField, Button, Box } from "@mui/material";
import User from "../model/User";

function Profile() {
  const [errorMessages, setErrorMessages] = useState({});
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState("");
  const [isGoogleUser, setIsGoogleUser] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    const u = localStorage.getItem("user");
    const t = localStorage.getItem("googleuser");
    setIsGoogleUser(t);

    const getUser = async () => {
      const resp = await GetUserData(u);
      const userData = new User(
        resp.data.username,
        resp.data.name,
        resp.data.lastname,
        resp.data.email,
        resp.data.birthday,
        resp.data.address,
        resp.data.picture
      );
      setUser(userData);
      setName(userData.name);
      setUsername(userData.username);
      setAddress(userData.address);
      var birthday = userData.birthday.substring(0, 10);
      setDate(birthday);
      setLastname(userData.lastname);
      setEmail(userData.email);
      var arr = userData.picture;
      const imageUrl = `data:image/png;base64,${arr}`;
      setImage(imageUrl);
    };

    getUser();
  }, []);

  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div style={{ color: "red", fontSize: "15px" }}>{errorMessages.message}</div>
    );

  function validate(event) {
    let valid = true;
    const username = event.target.username.value;
    const email = event.target.email.value;
    const name = event.target.name.value;
    const lastname = event.target.lastname.value;
    const date = event.target.date.value;
    const address = event.target.address.value;

    if (username.trim() === "") {
      setErrorMessages({ name: "username", message: "Username is required!" });
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
    return valid;
  }

  function handleSubmit(event) {
    event.preventDefault();
    setErrorMessages({ name: "username", message: "" });
    setErrorMessages({ name: "email", message: "" });
    setErrorMessages({ name: "name", message: "" });
    setErrorMessages({ name: "lastname", message: "" });
    setErrorMessages({ name: "date", message: "" });
    setErrorMessages({ name: "address", message: "" });

    if (validate(event)) {
      const formData = new FormData();
      formData.append("username", event.target.username.value);
      formData.append("name", event.target.name.value);
      formData.append("lastname", event.target.lastname.value);
      formData.append("birthday", event.target.date.value);
      formData.append("email", event.target.email.value);
      formData.append("address", event.target.address.value);
      formData.append("file", file);

      const resp = EditProfile(formData);

      if (resp === null) {
        console.log("error");
      } else {
        toast.success("Successful edit of profile!");
        nav("/home");
      }
    }
  }

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    let value = URL.createObjectURL(event.target.files[0]);
    setImage(value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastname(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit} id="form">
      <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
        <Box
          border={1}
          borderColor={'lightgray'}
          borderRadius={4}
          p={3}
          width={400}
          sx={{ "& .MuiFormControl-root": { mb: 3 } }}
        >
          <TextField
            readOnly
            type="text"
            name="username"
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
          />
          {renderErrorMessage("username")}
          <TextField
            type="text"
            name="name"
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={handleNameChange}
          />
          {renderErrorMessage("name")}
          <TextField
            type="text"
            name="lastname"
            label="Lastname"
            variant="outlined"
            fullWidth
            value={lastname}
            onChange={handleLastNameChange}
          />
          {renderErrorMessage("lastname")}
          {isGoogleUser === "false" && (
            <TextField
              type="email"
              name="email"
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={handleEmailChange}
            />
          )}
          {isGoogleUser === "true" && (
            <TextField
              type="email"
              name="email"
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              disabled
            />
          )}
          {renderErrorMessage("email")}
          <TextField
            type="date"
            name="date"
            label="Date of Birth"
            variant="outlined"
            fullWidth
            value={date}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleDateChange}
          />
          {renderErrorMessage("date")}
          <TextField
            type="text"
            name="address"
            label="Address"
            variant="outlined"
            fullWidth
            value={address}
            onChange={handleAddressChange}
          />
          {renderErrorMessage("address")}
          <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
            <img src={image} width="100px" height="100px" alt="Profile" />
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
            <TextField
              type="file"
              name="image"
              accept=".jpg,.jpeg,.png"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleFileChange}
            />
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
            <Button variant="contained" type="submit">
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </form>
  );
}

export default Profile;
