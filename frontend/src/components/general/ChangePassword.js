import { useState } from "react";
import { ChangeUserPassword } from "../../services/userService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box } from "@mui/material";
import SaveAsRoundedIcon from '@mui/icons-material/SaveAsRounded';
function ChangePassword() {
  const nav = useNavigate();
  const [errorMessages, setErrorMessages] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessages({ oldPassword: "" });
    setErrorMessages({ newPassword: "" });

    if (validate(event)) {
      const u = localStorage.getItem("user");
      const formData = new FormData();
      formData.append("Username", u);
      formData.append("NewPassword", event.target.newPassword.value);
      formData.append("OldPassword", event.target.oldPassword.value);

      const resp = await ChangeUserPassword(formData);
      if (resp.data === true) {
        toast.success("Successful password change!");
        nav("../../home");
      } else {
        toast.error("Wrong old password!");
      }
    }
  };

  const renderErrorMessage = (name) =>
    name in errorMessages && (
      <div style={{ color: "red", fontSize: "15px" }}>{errorMessages[name]}</div>
    );

  function validate(event) {
    let valid = true;

    if (event.target.oldPassword.value.trim() === "") {
      valid = false;
      setErrorMessages({ oldPassword: "Old password is required!" });
    }

    if (event.target.newPassword.value.trim() === "") {
      valid = false;
      setErrorMessages({ newPassword: "New password is required!" });
    }

    return valid;
  }

  return (
    <div className="mt-2">
      <form onSubmit={handleSubmit}>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Box
            display="flex"
            flexDirection="column"
            border={1}
            borderColor={'lightgray'}
            p={3}
            width="400px"
            mx={2}
            borderRadius={4}
          >
            <div className="m-2">
              <TextField
                type="password"
                name="oldPassword"
                label="Old password"
                variant="outlined"
                fullWidth
              />
              {renderErrorMessage("oldPassword")}
            </div>
            <div className="m-2">
              <TextField
                type="password"
                name="newPassword"
                label="New password"
                variant="outlined"
                fullWidth
              />
              {renderErrorMessage("newPassword")}
            </div>
            <div className="m-2">
              <Button type="outline" variant="contained" size="large" fullWidth startIcon={<SaveAsRoundedIcon/>}>
                Change password
              </Button>
            </div>
          </Box>
        </Box>
      </form>
    </div>
  );
}

export default ChangePassword;
