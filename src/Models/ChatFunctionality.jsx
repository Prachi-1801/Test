import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

function ChatComponent() {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");
  const [isConnection, setIsConnection] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://192.168.0.75:7173/chatHub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
    setIsConnection(true);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection.on("ReceiveMessage", (user, message) => {
            setMessages((prevMessages) => [...prevMessages, { user, message }]);
          });

          connection.on("ReceiveUser", (users) => {
            setUsers(users);
          });
        })
        .catch((e) => console.log("Connection failed:", e));
    }
  }, [connection]);

  const sendMessage = async () => {
    if (
      connection &&
      connection.state === signalR.HubConnectionState.Connected
    ) {
      await connection.invoke("SendMessage", user, message);
    }
    setMessage(() => "");
  };

  const handleUsername = async () => {
    if (user != "") {
      setIsUser(true);
      await connection.invoke("AddUser", user);
      setUser(user);
    }
  };

  return (
    <>
      {user}
      <AccountCircleRoundedIcon />

      {isConnection && isUser && (
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">Users</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={user}
            // onChange={handleChange}
            label="Users"
          >
            {users.map((item) => {
              if (item != user)
                return (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                );
            })}
          </Select>
        </FormControl>
      )}
      {isConnection && (
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          height={"100vh"}
        >
          {!isUser ? (
            <>
              <TextField
                id="outlined-basic"
                label="Username"
                variant="outlined"
                value={user}
                onChange={(e) => {
                  setUser(e.target.value);
                }}
              />
              <Button onClick={handleUsername}>Enter</Button>
            </>
          ) : (
            <Box display={"flex"} flexDirection={"row"}>
              <Box
                display={"flex"}
                alignItems={"center"}
                sx={{
                  border: "1px solid black",
                  padding: 2,
                  mr: 50,
                  borderRadius: "16px",
                }}
                height={"50vh"}
                width={"50vh"}
              >
                <TextField
                  size="small"
                  sx={{ mr: 2 }}
                  id="standard-basic"
                  label="Message"
                  value={message}
                  // placeholder="Message"
                  variant="standard"
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                />
                <SendRoundedIcon sx={{ color: "gray" }} onClick={sendMessage} />
              </Box>
              {messages.length > 0 && (
                <>
                  <Box
                    sx={{
                      border: "1px solid black",
                      padding: 2,
                    }}
                  >
                    <Typography fontWeight="bold">{"Chats"}</Typography>
                    {messages.map((x) => {
                      return (
                        <>
                          <Typography fontSize={12}>
                            {x.user == user ? "You" : x.user}
                          </Typography>
                          <Typography>{x.message}</Typography>
                        </>
                      );
                    })}
                  </Box>
                </>
              )}
            </Box>
          )}
        </Box>
      )}
    </>
  );
}

export default ChatComponent;
