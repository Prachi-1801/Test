import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { buildConnection, connectionRef } from "./Connection";
import { useDispatch } from "react-redux";
import {
  useLoginMutation,
  useSaveConnectionIdMutation,
} from "./api/AuthAxiosApi";
import { setConnectionStatus } from "./features/connectionSlice";
import { setCredentials } from "./features/authSlice";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [login] = useLoginMutation();
  const saveConnectionId = useSaveConnectionIdMutation();

  const handleLogin = async () => {
    try {
      const result = await login({ identifier, password }).unwrap();

      dispatch(setCredentials({ token: result.token, userId: result.userId }));

      buildConnection(result.token);
      dispatch(setConnectionStatus("connecting"));

      await connectionRef.current.start();
      dispatch(setConnectionStatus("connected"));

      const connectionId =
        await connectionRef.current.invoke("GetConnectionId");
      await saveConnectionId({ userId: result.userId, connectionId }).unwrap();

      navigate("/chat");
    } catch (err) {
      console.error("Login failed:", err);
      dispatch(setConnectionStatus("disconnected"));
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
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
            Login
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
              error={identifier.length <= 0}
              size="small"
              id="outlined-basic"
              label="UserName"
              variant="outlined"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
              }}
            />
            <FormControl
              sx={{ width: "30ch" }}
              variant="outlined"
              error={password.length <= 0}
            >
              <InputLabel htmlFor="outlined-adornment-password" size="small">
                Password
              </InputLabel>
              <OutlinedInput
                error={password.length <= 0}
                size="small"
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
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
            <Button variant="outlined" onClick={handleLogin}>
              Login
            </Button>
          </Box>
        </Box>
        <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
          <Typography>Don't have account </Typography>
          <Button
            onClick={() => {
              navigate("/register");
            }}
          >
            Create Account
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default LoginForm;
