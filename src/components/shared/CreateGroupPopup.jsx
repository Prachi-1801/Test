import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const CreateGroupPopup = (
  openGroupPopup,
  handleGroupPopupClose,
  newGroupName,
  handleGroupPopupInputChange,
  handleGroupPopupSubmit,
) => {
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
};

export default CreateGroupPopup;
