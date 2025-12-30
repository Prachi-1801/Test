import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

export default function AlertDialog() {
  const [openGroupPopup, setOpenGroupPopup] = React.useState(false);
  const [groupName, setGroupName] = React.useState("");

  const handleGroupPopupClickOpen = () => {
    setOpenGroupPopup(true);
  };

  const handleGroupPopupClose = () => {
    setOpenGroupPopup(false);
    // Optional: clear input on close
    setGroupName("");
  };

  const handleGroupPopupSubmit = () => {
    console.log("Submitted input:", groupName);
    handleGroupPopupClose();
  };

  const handleGroupPopupInputChange = (event) => {
    setGroupName(event.target.value);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleGroupPopupClickOpen}>
        Open Form Dialog
      </Button>
      <Dialog
        open={openGroupPopup}
        onClose={handleGroupPopupClose}
        slotProps={{ paper: { sx: { minWidth: 445 } } }}
      >
        <DialogTitle>Create Group</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>Enter Group Name</DialogContentText> */}
          <TextField
            autoFocus // Automatically focuses the input field when the dialog opens
            margin="dense"
            id="name"
            label="Enter Group Name"
            type="email"
            fullWidth
            variant="standard"
            value={groupName}
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
    </div>
  );
}
