import { useState } from "react";
import { saveAs } from "file-saver"; // Import the saveAs function
import { Box, Chip, Input } from "@mui/material";
import { BorderBottom } from "@mui/icons-material";
import AttachmentOutlinedIcon from "@mui/icons-material/AttachmentOutlined";

const FileSaverComponent = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  // Handler for file input change
  const handleFileChange = (event) => {
    // Get the first selected file
    setSelectedFile(event.target.files[0]);
  };

  // Handler for the save button click
  const handleSave = () => {
    if (selectedFile) {
      // The selected file is already a File object, which is a type of Blob
      // Use the saveAs function to prompt the user to save the file
      saveAs(selectedFile, selectedFile.name);
    } else {
      alert("Please select a file first!");
    }
  };

  return (
    <div>
      <h2>Save Uploaded File</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSave} disabled={!selectedFile}>
        Save File
      </button>
      <Box margin={1} border={1} display={"flex"} flexDirection={"column"}>
        <Input disableUnderline />
        <Box>
          {selectedFile && (
            <Chip label={selectedFile && selectedFile.name}></Chip>
          )}
          <AttachmentOutlinedIcon
            fontSize="large"
            sx={{ alignSelf: "center" }}
          />
        </Box>
      </Box>
    </div>
  );
};

export default FileSaverComponent;
