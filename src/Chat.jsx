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
import Divider from "@mui/material/Divider";

function ChatComponent() {
  const { userDetails } = useContext(UserDetailsContext);
  const { usernames } = useContext(UserNamesContext);
  const connection = useContext(ConnectionContext);

  const [openStartChatPopover, setOpenStartChatPopover] = useState(null);
  const [selectedCurrentUser, setSelectedCurrentUser] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState([]);

  useEffect(() => {
    if (connection) {
      connection.on("ReceiveUserMessage", (userId, connectionId, message) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            User: userId,
            UserName: usernames[userId],
            Message: message,
            SentTo: connectionId,
            SentName: usernames[connectionId],
            SentTime: new Date(),
          },
        ]);
      });
    }
  }, [connection]);

  const handleClickNewChatPopover = async (event) => {
    setOpenStartChatPopover(event.currentTarget);
    if (connection) {
      await connection.invoke("GetUsers");
    }
  };

  const handleClickStartChatPopover = () => {
    setCurrentUser(selectedCurrentUser);
    handleCloseStartChatPopover();
    setSelectedCurrentUser("");
  };

  const handleCloseStartChatPopover = () => {
    setOpenStartChatPopover(null);
  };

  const sendMessage = async () => {
    if (connection) {
      // if (currentUser == "All") {
      //   await connection.invoke("SendMessage", userDetails.UserId, message);
      // } else {
      await connection.invoke(
        "SendMessageToUser",
        userDetails.UserId,
        currentUser,
        message
      );
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          User: userDetails.UserId,
          Message: message,
          SentTo: currentUser,
          SentTime: new Date(),
        },
      ]);
      // }
      setMessage(() => "");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage(); // Call the send function
    }
  };

  const open = Boolean(openStartChatPopover);
  const id = open ? "start-chat" : undefined;

  return (
    <>
      <Box height={"100%"} width={"100%"}>
        <Box display={"flex"} flexDirection={"column"}>
          <Box justifyItems={"right"} borderBottom={"1px solid #140d0dff"}>
            <Tooltip title={userDetails.Username} placement="bottom">
              <div style={{ margin: 7 }}>
                <AvatarInitial initial={userDetails.Username.slice(0, 1)} />
              </div>
            </Tooltip>
          </Box>

          <Grid container height={"calc(100vh - 50px)"}>
            <Grid size={3} borderRight={"1px solid #e5e5e5"}>
              <Grid container p={2}>
                <Button
                  variant="contained"
                  sx={{ textTransform: "capitalize" }}
                  onClick={handleClickNewChatPopover}
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
                        setSelectedCurrentUser(e.target.value);
                      }}
                    >
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
              <Grid marginTop={1}>
                <Box display={"flex"} flexDirection={"column"}>
                  {messages
                    .map((x) => {
                      if (x.SentTo == userDetails.UserId) {
                        return x.User;
                      } else if (x.User == userDetails.UserId) return x.SentTo;
                    })
                    .filter((value, index, self) => {
                      return self.indexOf(value) === index;
                    })
                    .map((x) => {
                      return (
                        <Box
                          borderBottom={"1px solid black"}
                          borderTop={"1px solid black"}
                          paddingTop={1}
                          paddingBottom={1}
                          textAlign={"center"}
                          fontSize={20}
                          onClick={() => {
                            setCurrentUser(x);
                          }}
                        >
                          {usernames[x]}
                        </Box>
                      );
                    })}
                </Box>
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
                          if (
                            (x.User == currentUser &&
                              x.SentTo == userDetails.UserId) ||
                            (x.User == userDetails.UserId &&
                              x.SentTo == currentUser)
                          )
                            return (
                              <>
                                <Box
                                  alignSelf={
                                    x.User == userDetails.UserId
                                      ? "end"
                                      : "start"
                                  }
                                >
                                  <Typography fontSize={12}>
                                    {x.SentTo == userDetails.UserId ||
                                    // (x.SentTo == "All" &&
                                    x.User != userDetails.UserId
                                      ? usernames[x.User]
                                      : "you"}
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: "inline-block",
                                      border: "1px solid black",
                                      padding: 2,
                                      borderRadius: "16px",
                                    }}
                                  >
                                    {x.Message}
                                    {/* {usernames[userDetails.UserId] ==
                                    usernames[x.SentTo] && x.Message} */}
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
                      onKeyDown={handleKeyDown}
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
