import { Box, Button, TextField, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserDetailsContext, ConnectionContext } from "./context";

const LoginForm = () => {
  const navigate = useNavigate();

  const { userDetails, setUserDetails } = useContext(UserDetailsContext);
  const connection = useContext(ConnectionContext);
  // const { setUsernames } = useContext(UserNamesContext);

  useEffect(() => {
    if (connection) {
      //  setUserDetails((u) => ({ ...u, Username: e.target.value }));
      connection.on("ReceiveUser", (user) => {
        setUserDetails((item) => ({
          ...item,
          Usernames: { ...user },
        }));
        // setUsernames((users) => ({ ...users, ...user }));
        // setUsernames(users);
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
          </Box>
          <Button
            variant="outlined"
            onClick={async () => {
              if (userDetails.Username.length > 0) {
                await connection.invoke("AddUser", userDetails.Username);
                var connectionId = await connection.invoke("GetConnectionId");
                setUserDetails((u) => ({ ...u, UserId: connectionId }));
                navigate("/chat");
              }
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
