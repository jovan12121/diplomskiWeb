import { useState } from "react";
import '../../style.css';
import { LoginUser, LoginUserGoogle } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { Button, Card, CardContent, Typography, Link, TextField } from '@mui/material';
import { GoogleLogin } from "@react-oauth/google";
import { toast } from 'react-toastify';
import jwt_decode from "jwt-decode";
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
function Login() {
  const [errorMessages, setErrorMessages] = useState({});
  const navigate = useNavigate();

  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div style={{ color: 'red', fontSize: '15px' }}>{errorMessages.message}</div>
    );

  function validate(event) {
    var valid = true;
    if (event.target.username.value.trim() === "") {
      valid = false;
      setErrorMessages({ name: "username", message: "Username is required!" });
    }
    if (event.target.password.value.trim() === "") {
      valid = false;
      setErrorMessages({ name: "password", message: "Password is required!" });
    }
    return valid;
  }

  const login = async (data, u) => {
    const r = await LoginUser(data, navigate, u);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessages({ name: "username", message: "" });
    setErrorMessages({ name: "password", message: "" });
    if (validate(event)) {
      var formData = new FormData();
      const u = event.target.username.value;
      formData.append("username", u);
      formData.append("password", event.target.password.value);
      login(formData, u);
    }
  };

  const googleLoginHandle = async (response) => {
    const token = response.credential;
    const t = jwt_decode(token);
    var fd = new FormData();
    fd.append('email', t.email);
    fd.append('token', token);
    const r = await LoginUserGoogle(fd, navigate);
  };

  function googleLoginErrorHandle() {
    toast.error('Google login error');
  }

  return (
    <div className="container mt-5 ">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <Card className="bg-light border border-gray rounded">
            <CardContent>
              <Typography variant="h5" component="div" className="card-title">
                Login
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
                  id="password"
                  label="Password"
                  type="password"
                  name="password"
                  fullWidth
                  margin="normal"
                />
                {renderErrorMessage("password")}
                <Button variant="contained" type="submit" className="mt-2" fullWidth startIcon={<LoginRoundedIcon/>}>
                  Login
                </Button>
                <div>
                  Don't have an account? Go to{" "}
                  <Link href="/register" className="link-dark">
                    Registration
                  </Link>
                </div>
                <br />
                <Typography variant="body1" component="div">
                  Or login with Google:
                </Typography>
                <GoogleLogin onSuccess={googleLoginHandle} onError={googleLoginErrorHandle} />
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Login;
