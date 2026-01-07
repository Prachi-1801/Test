import { Box, Button, TextField, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserDetailsContext, ConnectionContext } from "./context";
import { HubConnectionState } from "@microsoft/signalr";

const LoginForm = () => {
  const navigate = useNavigate();

  const { userDetails, setUserDetails } = useContext(UserDetailsContext);
  const connection = useContext(ConnectionContext);
  useEffect(() => {
    console.log("UserDetails:", userDetails);
  }, [userDetails]);

  useEffect(() => {
    if (connection) {
      connection.on("ReceiveUser", (user) => {
        setUserDetails((item) => ({
          ...item,
          Usernames: { ...user },
        }));
      });

      connection
        .start()
        .then(() => {
          // Now it is safe to call Hub methods
          connection
            .invoke("GetAllGroups")
            .then((response) => {
              if (response != null)
                setUserDetails((item) => ({
                  ...item,
                  Groupnames: Object.entries(response)?.map(([key, value]) => ({
                    GroupName: key,
                    Users: value,
                  })),
                }));
            })
            .catch((err) => console.error(err.toString()));
        })
        .catch((err) => console.error(err));
    }
  }, [connection]);

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
              if (userDetails.Username.trim().length > 0) {
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
