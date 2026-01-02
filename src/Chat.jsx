import { useEffect, useState, useContext } from "react";
import {
  Button,
  Box,
  Grid,
  Popover,
  TextField,
  Typography,
  Autocomplete,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { UserDetailsContext, ConnectionContext } from "./context";
import AvatarInitial from "./AvatarInitial";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

function ChatComponent() {
  const { userDetails, setUserDetails } = useContext(UserDetailsContext);
  const connection = useContext(ConnectionContext);

  const [openStartChatPopover, setOpenStartChatPopover] = useState(null);
  const [selectedCurrentUsers, setSelectedCurrentUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState([]);
  const [openGroupPopup, setOpenGroupPopup] = useState(false);
  const [newGroupName, setNewGroupName] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [currentChat, setCurrentChat] = useState({ Id: null, IsGroup: false });

  useEffect(() => {
    console.log("GroupUsers: ", group.Users);
    userDetails.Groupnames?.map((group) => {
      if (!group.Users.includes(userDetails.UserId))
        console.log("GroupName: ", group);
    });
  }, [userDetails]);

  useEffect(() => {
    if (connection) {
      connection.on("ReceiveUserMessage", (userId, connectionId, message) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            User: userId,
            UserName: userDetails.Usernames[userId],
            Message: message,
            SentTo: connectionId,
            SentName: userDetails.Usernames[connectionId],
            SentTime: new Date(),
          },
        ]);
      });

      connection.on("ReceiveGroupMessage", (userId, message, group) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            User: userId,
            UserName: userDetails.Usernames[userId],
            SentTo: group,
            SentName: "Group",
            SentTime: new Date(),
            Message: message,
          },
        ]);
      });

      connection.on("ReceiveGroupName", (groupName, groupUsers) => {
        setUserDetails((user) => ({
          ...user,
          Groupnames: [
            ...user.Groupnames,
            {
              GroupName: groupName,
              Users: groupUsers,
            },
          ],
        }));
      });
    }
  }, [connection]);

  const handleClickNewChatPopover = async (event) => {
    setOpenStartChatPopover(event.currentTarget);
  };

  const handleClickStartChatPopover = () => {
    if (selectedCurrentUsers.length == 1) {
      setCurrentChat({ Id: selectedCurrentUsers[0]?.id, IsGroup: false });
    } else if (selectedCurrentUsers.length > 1) {
      handleGroupPopupClickOpen();
    } else if (selectedGroup != "") {
      setCurrentChat({ Id: selectedGroup, IsGroup: true });
      setSelectedGroup(null);
    }
    handleCloseStartChatPopover();
  };

  const handleCloseStartChatPopover = () => {
    setOpenStartChatPopover(null);
    // setSelectedCurrentUsers([]);
    setSelectedGroup(null);
  };

  const sendMessage = async () => {
    if (connection && currentChat.Id != null) {
      if (!currentChat.IsGroup) {
        await connection.invoke(
          "SendMessageToUser",
          userDetails.UserId,
          currentChat.Id,
          message
        );
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            User: userDetails.UserId,
            Message: message,
            SentTo: currentChat.Id,
            SentTime: new Date(),
          },
        ]);
      } else if (currentChat.IsGroup) {
        await connection.invoke("SendMessageToGroup", currentChat.Id, message);
      }
      setMessage(() => "");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const handleAutocompleteChange = (event, value) => {
    if (value.length != 0) {
      setSelectedCurrentUsers(value);
    }
  };

  const handleGroupPopupClickOpen = () => {
    setOpenGroupPopup(true);
  };

  const handleGroupPopupClose = () => {
    setOpenGroupPopup(false);
    setSelectedCurrentUsers([]);
    setNewGroupName("");
  };

  const handleGroupPopupSubmit = async () => {
    if (connection) {
      let groupUsers = selectedCurrentUsers.map((user) => user.id);
      await connection.invoke(
        "JoinGroup",
        newGroupName,
        userDetails.UserId,
        groupUsers
      );
      setCurrentChat({ Id: newGroupName, IsGroup: true });
      setNewGroupName(null);
    }
    // setSelectedCurrentUsers([]);
    handleGroupPopupClose();
  };

  const handleClickJoinChat = async () => {
    if (connection) {
      await connection.invoke("JoinGroup", selectedGroup, null, [
        userDetails.UserId,
      ]);
    }
    setCurrentChat({ Id: newGroupName, IsGroup: true });
    setSelectedGroup(null);
    handleGroupPopupClose();
  };

  const handleGroupPopupInputChange = (event) => {
    setNewGroupName(event.target.value);
  };

  const handleGroupChange = (event) => {
    setSelectedGroup(event.target.value);
    setSelectedCurrentUsers([]);
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
                  <Box
                    width={"100%"}
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"center"}
                  >
                    <Autocomplete
                      multiple
                      id="tags-outlined"
                      options={Object.entries(userDetails.Usernames)
                        .filter(([key]) => key !== userDetails.UserId)
                        .map(([key, value]) => ({ id: key, label: value }))}
                      onChange={handleAutocompleteChange}
                      getOptionLabel={(value) => value.label}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select people to start chat"
                        />
                      )}
                    />
                    <Divider>
                      <Typography sx={{ fontSize: "12px", color: "gray" }}>
                        OR
                      </Typography>
                    </Divider>
                    <FormControl sx={{ minWidth: 120 }}>
                      <InputLabel id="demo-simple-select-helper-label">
                        Select group to start chat
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={selectedGroup}
                        label="Select group to start chat"
                        onChange={handleGroupChange}
                      >
                        {userDetails.Groupnames?.map((group) => {
                          if (!group.Users.includes(userDetails.UserId))
                            return (
                              <MenuItem
                                key={group.GroupName}
                                value={group.GroupName}
                              >
                                {group.GroupName}
                              </MenuItem>
                            );
                        })}
                      </Select>
                    </FormControl>
                  </Box>
                  <Grid
                    container
                    pt={1}
                    display={"flex"}
                    flexDirection={"row"}
                    justifyContent={"space-between"}
                  >
                    <Button
                      variant="contained"
                      sx={{ textTransform: "capitalize" }}
                      onClick={handleClickJoinChat}
                      disabled={selectedGroup == null}
                    >
                      Join Group
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ textTransform: "capitalize" }}
                      onClick={handleClickStartChatPopover}
                      disabled={
                        selectedCurrentUsers == null ||
                        selectedCurrentUsers.length == 0
                      }
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
                      else if (x.SentName == "Group") {
                        return x.SentTo;
                      }
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
                            if (userDetails.Usernames[x])
                              setCurrentChat({ Id: x, IsGroup: false });
                            else setCurrentChat({ Id: x, IsGroup: true });
                          }}
                        >
                          {userDetails.Usernames[x] || x}
                        </Box>
                      );
                    })}
                </Box>
              </Grid>
            </Grid>
            <Grid size={9}>
              {currentChat.Id != null && (
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
                      initial={
                        currentChat.Id != null &&
                        ((currentChat.IsGroup && currentChat.Id.slice(0, 1)) ||
                          userDetails.Usernames[currentChat.Id].slice(0, 1))
                      }
                    />
                    {currentChat.Id != null &&
                      ((currentChat.IsGroup && currentChat.Id) ||
                        userDetails.Usernames[currentChat.Id])}
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
                          if (currentChat.Id != null)
                            if (
                              userDetails.Usernames[x.SentTo] &&
                              ((x.User == currentChat.Id &&
                                x.SentTo == userDetails.UserId) ||
                                (x.User == userDetails.UserId &&
                                  x.SentTo == currentChat.Id))
                            ) {
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
                                      x.User != userDetails.UserId
                                        ? userDetails.Usernames[x.User]
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
                                    </Box>
                                  </Box>
                                </>
                              );
                            } else if (currentChat.Id == x.SentTo) {
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
                                      {x.User != userDetails.UserId
                                        ? userDetails.Usernames[x.User]
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
                                    </Box>
                                  </Box>
                                </>
                              );
                            }
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
      <Dialog
        open={openGroupPopup}
        onClose={handleGroupPopupClose}
        slotProps={{ paper: { sx: { minWidth: 445 } } }}
      >
        <DialogTitle>Create Group</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus // Automatically focuses the input field when the dialog opens
            margin="dense"
            id="name"
            label="Enter Group Name"
            type="email"
            fullWidth
            variant="standard"
            value={newGroupName}
            onChange={handleGroupPopupInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleGroupPopupClose}>Cancel</Button>
          <Button onClick={handleGroupPopupSubmit} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ChatComponent;
