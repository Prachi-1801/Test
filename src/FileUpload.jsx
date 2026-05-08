import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

const ProfilePhotoUpload = () => {
  const [open, setOpen] = useState(false); // State for dialog open/close
  const [file, setFile] = useState(null); // State for storing selected file

  // Function to handle Box click (open dialog)
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Function to handle closing the dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Function to handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(URL.createObjectURL(file)); // Preview the selected image (optional)
    }
  };

  // Function to handle file upload submission (if required)
  const handleUpload = () => {
    // Upload logic here (e.g., send file to a server)
    setOpen(false);
  };

  return (
    <div>
      {/* Box that opens the dialog on click */}
      <Box
        sx={{
          width: 200,
          height: 200,
          backgroundColor: "lightgray",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={handleClickOpen}
      >
        <span>Upload Profile Photo</span>
      </Box>

      {/* Dialog for photo upload */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Upload Profile Photo</DialogTitle>
        <DialogContent>
          {/* Input field for file selection */}
          <TextField
            type="file"
            fullWidth
            onChange={handleFileChange}
            inputProps={{
              accept: "image/*", // Restrict file selection to images
            }}
          />
          {/* If a file is selected, show a preview */}
          {file && (
            <Box
              sx={{
                marginTop: 2,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img
                src={file}
                alt="Preview"
                style={{ width: 100, height: 100, objectFit: "cover" }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {/* Close the dialog */}
          <Button onClick={handleClose}>Cancel</Button>
          {/* Trigger upload (this could be connected to your file upload logic) */}
          <Button onClick={handleUpload} disabled={!file}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProfilePhotoUpload;
