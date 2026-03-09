import { useEffect, useState, useContext, useRef } from "react";
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
  Input,
  Chip,
} from "@mui/material";
import { UserDetailsContext, ConnectionContext } from "./context";
import AvatarInitial from "./AvatarInitial";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import EmojiPicker from "emoji-picker-react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import AttachmentOutlinedIcon from "@mui/icons-material/AttachmentOutlined";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import DeleteIcon from "@mui/icons-material/Delete";

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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isMicOn, setIsMicOn] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);

  useEffect(() => {
    console.log("Messages: ", messages);
  }, [messages]);

  useEffect(() => {
    if (audioRef.current && !isMicOn) {
      audioRef.current.src = audioUrl;
    }
  }, [audioUrl, isMicOn]);

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

      connection.on(
        "ReceiveUserFile",
        (userId, connectionId, filename, filedata, filetype) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              User: userId,
              UserName: userDetails.Usernames[userId],
              IsFile: true,
              Message: {
                filename: filename,
                filedata: filedata,
                filetype: filetype,
              },
              SentTo: connectionId,
              SentName: userDetails.Usernames[connectionId],
              SentTime: new Date(),
            },
          ]);
        },
      );

      connection.on(
        "ReceiveGroupFile",
        (userId, group, filename, filedata, filetype) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              User: userId,
              UserName: userDetails.Usernames[userId],
              SentTo: group,
              SentName: "Group",
              SentTime: new Date(),
              Message: {
                filename: filename,
                filedata: filedata,
                filetype: filetype,
              },
              IsFile: true,
            },
          ]);
        },
      );

      connection.on("ReceiveUserAudio", (userId, connectionId, audio) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            User: userId,
            UserName: userDetails.Usernames[userId],
            IsAudio: true,
            Message: audio,
            SentTo: connectionId,
            SentName: userDetails.Usernames[connectionId],
            SentTime: new Date(),
          },
        ]);
      });

      connection.on("ReceiveGroupAudio", (userId, group, audio) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            User: userId,
            UserName: userDetails.Usernames[userId],
            SentTo: group,
            SentName: "Group",
            SentTime: new Date(),
            Message: audio,
            IsAudio: true,
          },
        ]);
      });

      connection.on("ReceiveGroupNames", (groupNames) => {
        setUserDetails((user) => ({
          ...user,
          Groupnames: Object.entries(groupNames).map(([key, value]) => ({
            GroupName: key,
            Users: value,
          })),
        }));
      });
    }
  }, [connection]);

  const handleClickNewChatPopover = async (event) => {
    setOpenStartChatPopover(event.currentTarget);
  };

  const downloadFile = (filename, base64, type) => {
    const blob = new Blob(
      [Uint8Array.from(atob(base64.split(",").pop()), (c) => c.charCodeAt(0))],
      { type },
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
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
    setSelectedGroup(null);
  };

  const handleAudioDelete = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    audioRef.current.value = null;
  };

  const sendMessage = async () => {
    if (message.length > 0) {
      if (connection && currentChat.Id != null) {
        if (!currentChat.IsGroup) {
          await connection.invoke(
            "SendMessageToUser",
            userDetails.UserId,
            currentChat.Id,
            message,
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
          await connection.invoke(
            "SendMessageToGroup",
            currentChat.Id,
            message,
          );
        }
        setMessage(() => "");
      }
    }

    if (selectedFile && connection) {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result.split(",")[1];

        try {
          if (currentChat.IsGroup) {
            await connection.invoke(
              "SendFileToGroup",
              currentChat.Id,
              selectedFile.name,
              base64Data,
              selectedFile.type,
            );
          } else {
            await connection.invoke(
              "SendFileToUser",
              userDetails.UserId,
              currentChat.Id,
              selectedFile.name,
              base64Data,
              selectedFile.type,
            );
          }
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              User: userDetails.UserId,
              Message: {
                filename: selectedFile.name,
                filedata: base64Data,
                filetype: selectedFile.type,
              },
              SentTo: currentChat.Id,
              SentTime: new Date(),
              IsFile: true,
            },
          ]);
        } catch (error) {
          console.error("Error sending file to SignalR:", error);
        }

        // Clear selected file after sending
        setSelectedFile(null);
      };
      reader.readAsDataURL(selectedFile); // Convert file to base64
    } else if (audioBlob && audioBlob.size > 0) {
      const arrayBuffer = await audioBlob.arrayBuffer();
      // Convert ArrayBuffer to Uint8Array
      const bytes = new Uint8Array(arrayBuffer);

      // Function to convert Uint8Array to Base64 string
      function uint8ArrayToBase64(bytes) {
        const binary = [];
        for (let i = 0; i < bytes.length; i++) {
          binary.push(String.fromCharCode(bytes[i]));
        }
        return btoa(binary.join(""));
      }

      const base64String = uint8ArrayToBase64(bytes);
      if (connection && currentChat.Id != null) {
        if (!currentChat.IsGroup) {
          await connection.invoke(
            "SendAudioToUser",
            userDetails.UserId,
            currentChat.Id,
            base64String,
          );
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              User: userDetails.UserId,
              Message: base64String,
              SentTo: currentChat.Id,
              SentTime: new Date(),
              IsAudio: true,
            },
          ]);
        } else if (currentChat.IsGroup) {
          await connection.invoke(
            "SendAudioToGroup",
            currentChat.Id,
            base64String,
          );
        }
      }
      setAudioBlob(null);
      setAudioUrl(null);
      audioRef.current.value = null;
    } else {
      console.log("No file selected or no connection.");
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
        groupUsers,
      );
      setCurrentChat({ Id: newGroupName, IsGroup: true });
      setNewGroupName(null);
    }
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

  const handleEmojiClick = (emojiData) => {
    setMessage((msg) => msg + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const stopRecording = () => {
    // Stop the media recorder
    mediaRecorderRef.current.stop();
    setIsMicOn(false);
  };

  const startRecording = async () => {
    // Request access to the user's microphone
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // Create a new MediaRecorder instance
    mediaRecorderRef.current = new MediaRecorder(stream);

    // Clear previous audio chunks if any
    audioChunksRef.current = [];

    // Collect audio data in chunks
    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    // When recording stops, create a Blob and a URL for the recorded audio
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioBlob(audioBlob);
      setAudioUrl(audioUrl);
    };

    // Start recording
    mediaRecorderRef.current.start();
    setIsMicOn(true);
  };

  const open = Boolean(openStartChatPopover);
  const id = open ? "start-chat" : undefined;

  return (
    <>
      <Box height="100%" width="100%">
        <Box display="flex" flexDirection="column">
          <Box justifyItems="right" borderBottom="1px solid #140d0dff">
            <Tooltip title={userDetails.Username} placement="bottom">
              <div style={{ margin: 7 }}>
                <AvatarInitial initial={userDetails.Username.slice(0, 1)} />
              </div>
            </Tooltip>
          </Box>

          <Grid container height="calc(100vh - 50px)">
            <Grid size={3} borderRight="1px solid #e5e5e5">
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
                    width="100%"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
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
                        {userDetails.Groupnames != null &&
                          userDetails.Groupnames?.map((group) => {
                            if (
                              group.Users &&
                              group.Users.length > 0 &&
                              !group.Users.includes(userDetails.UserId)
                            )
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
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
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
                <Box display="flex" flexDirection="column">
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
                          borderBottom="1px solid black"
                          borderTop="1px solid black"
                          paddingTop={1}
                          paddingBottom={1}
                          textAlign="center"
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
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  height="100%"
                >
                  <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
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
                  {/* chats */}
                  <Box
                    sx={{
                      mb: 2,
                      display: "flex",
                      flexDirection: "column-reverse",
                      flex: 1,
                      overflow: "hidden",
                      overflowY: "scroll",
                    }}
                  >
                    {messages.length > 0 && (
                      <>
                        <Box
                          display="flex"
                          sx={{
                            padding: 2,
                          }}
                          flexDirection="column"
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
                                      <Box
                                        sx={{
                                          border: "1px solid black",
                                          padding: 2,
                                          borderRadius: "16px",
                                          marginTop: 2,
                                        }}
                                        onClick={() =>
                                          x.IsFile &&
                                          downloadFile(
                                            x.Message.filename,
                                            x.Message.filedata,
                                            x.Message.filetype,
                                          )
                                        }
                                      >
                                        {x.IsFile ? (
                                          x.Message.filename
                                        ) : x.IsAudio ? (
                                          <audio controls>
                                            <source
                                              src={`data:audio/mp3;base64,${x.Message}`}
                                              type="audio/mp3"
                                            />
                                          </audio>
                                        ) : (
                                          x.Message
                                        )}
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
                    <EmojiPicker
                      open={showEmojiPicker}
                      style={{ position: "absolute", bottom: 85, right: 16 }}
                      onEmojiClick={handleEmojiClick}
                    />
                  </Box>
                  <Box
                    display="flex"
                    mx={1}
                    mb={5}
                    border={1}
                    borderRadius={1}
                    flexDirection="column"
                  >
                    <Box>
                      {selectedFile && (
                        <Chip
                          label={selectedFile && selectedFile.name}
                          onDelete={() => setSelectedFile(null)}
                        ></Chip>
                      )}
                    </Box>

                    {audioUrl && (
                      <Box
                        m={1}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "flex-start",
                          alignItems: "center",
                        }}
                      >
                        <audio
                          style={{
                            height: "40px", // Set height here
                          }}
                          ref={audioRef}
                          controls
                        />
                        <DeleteIcon
                          sx={{
                            fontSize: 28,
                            color: "red",
                          }}
                          onClick={handleAudioDelete}
                        />
                      </Box>
                    )}

                    <Box display="flex" flexDirection="row">
                      <Input
                        sx={{ padding: 1 }}
                        disableUnderline
                        fullWidth
                        id="outlined-basic"
                        variant="outlined"
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value.trim());
                        }}
                        onKeyDown={handleKeyDown}
                      />
                      <Box
                        display="flex"
                        flexDirection="row"
                        gap={1}
                        alignItems="center"
                      >
                        {isMicOn ? (
                          <MicIcon onClick={stopRecording} />
                        ) : (
                          <MicOffIcon onClick={startRecording} />
                        )}
                        <label htmlFor="files" style={{ alignSelf: "center" }}>
                          <AttachmentOutlinedIcon
                            fontSize="medium"
                            sx={{
                              cursor: "pointer",
                              alignSelf: "center",
                              rotate: "300deg",
                            }}
                          />
                        </label>
                        <Input
                          id="files"
                          type="file"
                          style={{ display: "none" }}
                          onChange={handleFileChange}
                        />
                        <EmojiEmotionsIcon
                          fontSize="medium"
                          sx={{
                            alignSelf: "center",
                            color: "#FC0",
                          }}
                          onClick={() => setShowEmojiPicker(true)}
                        />
                        <Typography>|</Typography>
                        <SendRoundedIcon
                          fontSize="medium"
                          sx={{
                            flexGrow: 0.5,
                            alignSelf: "center",
                          }}
                          onClick={sendMessage}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>
      {newFunction(
        openGroupPopup,
        handleGroupPopupClose,
        newGroupName,
        handleGroupPopupInputChange,
        handleGroupPopupSubmit,
      )}
    </>
  );
}

export default ChatComponent;
function newFunction(
  openGroupPopup,
  handleGroupPopupClose,
  newGroupName,
  handleGroupPopupInputChange,
  handleGroupPopupSubmit,
) {
  return (
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
  );
}
