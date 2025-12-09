import React, { useEffect, useState, useContext } from "react";
import * as signalR from "@microsoft/signalr";
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
} from "@mui/material";
import {
  UserDetailsContext,
  ConnectionContext,
  UserNamesContext,
} from "./context";
import AvatarInitial from "./AvatarInitial";

function ChatComponent() {
  const { userDetails } = useContext(UserDetailsContext);
  const { usernames } = useContext(UserNamesContext);
  const connection = useContext(ConnectionContext);

  const [openStartChatPopover, setOpenStartChatPopover] = useState(null);
  const [currentUser, setCurrentUser] = useState("");
  const [messages, setMessages] = useState([]);

  const handleClickStartChatPopover = async (event) => {
    setOpenStartChatPopover(event.currentTarget);
    if (connection) {
      await connection.invoke("GetUsers");
    }
  };

  const handleCloseStartChatPopover = () => {
    setOpenStartChatPopover(null);
  };

  const open = Boolean(openStartChatPopover);
  const id = open ? "start-chat" : undefined;

  return (
    <>
      <Box display={"flex"} flexDirection={"column"}>
        <Box justifyItems={"right"}>
          <AvatarInitial initial={userDetails.Username.slice(0, 1)} />
        </Box>
        <Box height={"100vh"} width={"100%"}>
          <Grid container height={"100%"}>
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
                      {usernames?.length > 0 ? (
                        usernames?.map((user) => {
                          if (user != userDetails.Username)
                            return (
                              <MenuItem value={user} key={user}>
                                {user}
                              </MenuItem>
                            );
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
                  gap={10}
                >
                  <Box
                    display={"flex"}
                    flexDirection={"row"}
                    alignItems={"center"}
                    gap={1}
                  >
                    <AvatarInitial initial={currentUser.slice(0, 1)} />
                    {currentUser}
                  </Box>
                  <TextField id="outlined-basic" variant="outlined" />
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
