import React, { useEffect, useState, useContext } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Grid,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import {
  UserDetailsContext,
  ConnectionContext,
  UserNamesContext,
} from "./context";
import AvatarInitial from "./AvatarInitial";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import Tooltip from "@mui/material/Tooltip";

function ChatComponent() {
  const { userDetails } = useContext(UserDetailsContext);
  const { usernames } = useContext(UserNamesContext);
  const connection = useContext(ConnectionContext);

  const [openStartChatPopover, setOpenStartChatPopover] = useState(null);
  const [currentUser, setCurrentUser] = useState("");
  const [messages, setMessages] = useState([
    { User: "", Message: "", SentTo: "", SentTime: "" },
  ]);
  const [message, setMessage] = useState([]);

  useEffect(() => {
    console.log("Messages", messages);
  }, [messages]);

  useEffect(() => {
    if (connection) {
      connection.on("ReceiveMessage", (user, message) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { User: user, Message: message, SentTo: "All", SentTime: new Date() },
        ]);
      });

      connection.on("ReceiveUserMessage", (userId, connectionId, message) => {
        console.log(
          "UserId: ",
          userDetails.UserId,
          "ConnectionId: ",
          connectionId
        );

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            User: userId,
            Message: message,
            SentTo: connectionId,
            SentTime: new Date(),
          },
        ]);
      });
    }
  }, [connection]);

  const handleClickStartChatPopover = async (event) => {
    setOpenStartChatPopover(event.currentTarget);
    if (connection) {
      await connection.invoke("GetUsers");
    }
  };

  const handleCloseStartChatPopover = () => {
    setOpenStartChatPopover(null);
  };

  const sendMessage = async () => {
    if (connection) {
      if (currentUser == "All") {
        await connection.invoke("SendMessage", userDetails.UserId, message);
      } else {
        await connection.invoke(
          "SendMessageToUser",
          userDetails.UserId,
          currentUser,
          message
        );
      }
      setMessage(() => "");
    }
  };

  const open = Boolean(openStartChatPopover);
  const id = open ? "start-chat" : undefined;

  return (
    <>
      <Box height={"100%"} width={"100%"}>
        <Box display={"flex"} flexDirection={"column"}>
          <Box justifyItems={"right"} margin={1}>
            <Tooltip title={userDetails.Username} placement="bottom">
              <div>
                <AvatarInitial initial={userDetails.Username.slice(0, 1)} />
              </div>
            </Tooltip>
          </Box>
          <Grid container height={"calc(100vh - 50px)"}>
            <Grid size={3} borderRight={"1px solid #e5e5e5"} p={2}>
              <Grid container>
                <Button
                  variant="contained"
                  sx={{ textTransform: "capitalize" }}
                  onClick={handleClickStartChatPopover}
                >
                  New Chat
                </Button>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={openStartChatPopover}
                  onClose={handleCloseStartChatPopover}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  slotProps={{
                    paper: {
                      sx: {
                        p: 2,
                        minWidth: "250px",
                      },
                    },
                  }}
                >
                  <FormControl fullWidth size="small">
                    <InputLabel>Select people to start chat</InputLabel>
                    <Select
                      size="small"
                      label="Select people to start chat"
                      onChange={(e) => {
                        setCurrentUser(e.target.value);
                      }}
                    >
                      {Object.entries(usernames).length > 2 && (
                        <MenuItem value="All" key="All">
                          All
                        </MenuItem>
                      )}
                      {Object.entries(usernames).length !== 0 ? (
                        Object.entries(usernames)?.map(([key, value]) => {
                          if (key != userDetails.UserId)
                            return <MenuItem value={key}>{value}</MenuItem>;
                        })
                      ) : (
                        <MenuItem value={""}>No user available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                  <Grid container pt={1} justifyContent={"end"}>
                    <Button
                      variant="contained"
                      sx={{ textTransform: "capitalize" }}
                      onClick={handleClickStartChatPopover}
                    >
                      Start Chat
                    </Button>
                  </Grid>
                </Popover>
              </Grid>
            </Grid>
            <Grid size={9}>
              {currentUser && (
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"space-between"}
                  height={"100%"}
                >
                  <Box
                    display={"flex"}
                    flexDirection={"row"}
                    alignItems={"center"}
                    gap={1}
                  >
                    <AvatarInitial
                      initial={usernames[currentUser].slice(0, 1)}
                    />
                    {usernames[currentUser]}
                  </Box>
                  {messages.length > 0 && (
                    <>
                      <Box
                        display={"flex"}
                        sx={{
                          padding: 2,
                        }}
                        flexDirection={"column"}
                      >
                        {messages.map((x) => {
                          return (
                            <>
                              <Box
                                alignSelf={
                                  x.User == userDetails.UserId ? "end" : "start"
                                }
                              >
                                <Typography fontSize={12}>
                                  {x.User == userDetails.UserId
                                    ? "you"
                                    : usernames[x.User]}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "inline-block",
                                    border: "1px solid black",
                                    padding: 2,
                                    borderRadius: "16px",
                                  }}
                                  // maxWidth={false}
                                >
                                  {x.User == userDetails.UserId &&
                                  usernames[x.User] == x.SentTo
                                    ? x.Message
                                    : ""}
                                </Box>
                              </Box>
                            </>
                          );
                        })}
                      </Box>
                    </>
                  )}
                  <Box display={"flex"} flexDirection={"row"} marginBottom={5}>
                    <TextField
                      sx={{ flexGrow: 11 }}
                      id="outlined-basic"
                      variant="outlined"
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                      }}
                    />
                    <SendRoundedIcon
                      fontSize="large"
                      sx={{ flexGrow: 0.5, alignSelf: "center" }}
                      onClick={sendMessage}
                    />
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}

export default ChatComponent;
