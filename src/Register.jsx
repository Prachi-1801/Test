import {
  Box,
  Typography,
  TextField,
  FormControl,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    userId: 0,
    userName: "",
    userEmail: "",
    password: "",
    phoneNo: "",
    profilePhoto: "",
    dob: "",
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handlePhoneNoChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setUserData({ ...userData, phoneNo: e.target.value });
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            paddingLeft: 10,
            paddingRight: 10,
            paddingBottom: 1,
          }}
        >
          <Typography paddingBottom={3} fontSize={30}>
            Create Account
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              size="small"
              id="outlined-basic"
              label="UserName"
              variant="outlined"
              value={userData.userName.trim()}
              onChange={(e) => {
                setUserData({ ...userData, userName: e.target.value });
              }}
              error={userData.userName.trim() == ""}
            />
            <TextField
              size="small"
              id="outlined-basic"
              label="Email"
              variant="outlined"
              value={userData.userEmail.trim()}
              onChange={(e) => {
                setUserData({ ...userData, userEmail: e.target.value });
              }}
            />
            <TextField
              size="small"
              id="outlined-basic"
              label="PhoneNo"
              variant="outlined"
              value={userData.phoneNo}
              onChange={handlePhoneNoChange}
              type="number"
              error={userData.phoneNo.length != 10}
              slotProps={{
                htmlInput: {
                  maxLength: 10,
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  sx: {
                    // Remove arrows in Chrome, Safari, Edge
                    "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                      {
                        display: "none",
                      },
                    // Remove arrows in Firefox
                    "&[type=number]": {
                      MozAppearance: "textfield",
                    },
                  },
                },
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date of Birth"
                onChange={(newValue) => {
                  setUserData({ ...userData, dob: newValue });
                }}
                sx={{ width: "100%" }}
                slotProps={{
                  textField: {
                    variant: "outlined",
                    size: "small",
                  },
                }}
              />
            </LocalizationProvider>
            <FormControl variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password" size="small">
                Password
              </InputLabel>
              <OutlinedInput
                value={userData.password}
                size="small"
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                onChange={(e) => {
                  setUserData({ ...userData, password: e.target.value });
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword
                          ? "hide the password"
                          : "display the password"
                      }
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
            <Button
              variant="outlined"
              onClick={() => {
                navigate("/");
              }}
            >
              Register
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Register;
