import { Box, Button, TextField, Typography } from "@mui/material";
import { useState, useContext, useEffect } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormControl from "@mui/material/FormControl";
import { useNavigate } from "react-router-dom";
import {
  UserDetailsContext,
  ConnectionContext,
  UserNamesContext,
} from "./context";

const LoginForm = () => {
  const navigate = useNavigate();

  const { userDetails, setUserDetails } = useContext(UserDetailsContext);
  const connection = useContext(ConnectionContext);
  const { setUsernames } = useContext(UserNamesContext);

  useEffect(() => {
    if (connection) {
      connection.on("ReceiveUser", (users) => {
        setUsernames(users.result);
      });
    }
  }, [connection]);

  // const userContext = useContext(userDetails);

  // const [showPassword, setShowPassword] = useState(false);

  // const handleClickShowPassword = () => setShowPassword((show) => !show);

  // const handleMouseDownPassword = (event) => {
  //   event.preventDefault();
  // };

  // const handleMouseUpPassword = (event) => {
  //   event.preventDefault();
  // };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            paddingLeft: 10,
            paddingRight: 10,
            paddingBottom: 5,
            gap: 2,
          }}
        >
          <Typography paddingBottom={3} fontSize={30}>
            Test App
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
              error={userDetails.Username.length <= 0}
              size="small"
              id="outlined-basic"
              label="UserName"
              variant="outlined"
              onChange={(e) => {
                setUserDetails((u) => ({ ...u, Username: e.target.value }));
              }}
            />
            {/* <FormControl size="small" variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
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
                onChange={(e) => {
                  setUserDetails((u) => ({ ...u, Password: e.target.value }));
                  console.log(userDetails);
                }}
                label="Password"
              />
            </FormControl> */}
            {/* <TextField
              size="small"
              id="outlined-basic"
              label="Password"
              variant="outlined"
              onChange={(e) => {
                setUserDetails((u) => ({ ...u, Password: e.target.value }));
              }}
            /> */}
          </Box>
          <Button
            variant="outlined"
            onClick={async () => {
              await connection.invoke("AddUser", userDetails.Username);
              navigate("/chat");
            }}
          >
            Login
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default LoginForm;
