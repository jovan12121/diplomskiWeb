import "../../style.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, AppBar, Toolbar, Typography, Box } from "@mui/material";

function Header() {
  const nav = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [verified, setVerified] = useState(null);
  const [isGoogleUser, setIsGoogleUser] = useState("");


  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("encodedtoken");
    localStorage.removeItem("googleuser");
    setUserRole("");
    nav("/");
  }

  useEffect(() => {
    setUserRole("");
    const t = localStorage.getItem("googleuser");
    setIsGoogleUser(t);
    var token = localStorage.getItem("token");
    if (token) {
      const w = JSON.parse(token);
      const r = w["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      if (r === "seller") {
        setVerified(w.verified.toLowerCase());
      }
      setUserRole(r);
    }
  }, []);

  return (
    <AppBar position="static" style={{ backgroundColor: "#000000", borderBottom: "3px solid #b0b0b0" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {userRole === "admin" && (
            <Button component={Link} to="verification" color="inherit" >
              Verifications
            </Button>
          )}

          {userRole === "buyer" && (
            <Button component={Link} to="neworder" color="inherit" sx={{paddingRight:"20px"}}>
              New order
            </Button>
          )}

          {userRole === "admin" && (
            <Button component={Link} to="allorders" color="inherit" sx={{paddingLeft:"20px"}}>
              Orders
            </Button>
          )}

          {userRole === "buyer" && (
            <Button component={Link} to="allordersbuyer" color="inherit">
              Previous orders
            </Button>
          )}
          {userRole === "seller" && verified === "false" && (
            <Typography variant="body1" style={{ color: "red" }}>
              Account not verified!
            </Typography>
          )}

          {userRole === "seller" && verified === "true" && (
            <Button component={Link} to="allordersseller" color="inherit">
              Orders
            </Button>
          )}

          {userRole === "seller" && verified === "" && (
            <Typography variant="body1" style={{ color: "yellow" }}>
              Verification pending!
            </Typography>
          )}

          {userRole === "seller" && verified === "true" && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button component={Link} to="allproducts" color="inherit"sx={{paddingLeft:"20px"}}>
                Add product
              </Button>
              <Typography variant="body1" style={{ color: "green" }} sx={{paddingLeft:"520px"}}>
                Account verified!
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {userRole && (
            <Button component={Link} to="profile" color="inherit" sx={{paddingRight:"20px"}}>
              Edit profile
            </Button>
          )}

          {userRole && isGoogleUser === "false" && (
            <Button component={Link} to="changePassword" color="inherit" sx={{paddingRight:"20px"}}>
              Change password
            </Button>
          )}

          {userRole && (
            <Button variant="outlined" onClick={logout} color="inherit">
              Log out
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
