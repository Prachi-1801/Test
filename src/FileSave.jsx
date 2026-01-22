// import { useState } from "react";
// import { saveAs } from "file-saver"; // Import the saveAs function
// import { Box, Chip, Input } from "@mui/material";
// import { BorderBottom } from "@mui/icons-material";
// import AttachmentOutlinedIcon from "@mui/icons-material/AttachmentOutlined";

// const FileSaverComponent = () => {
//   const [selectedFile, setSelectedFile] = useState(null);

//   // Handler for file input change
//   const handleFileChange = (event) => {
//     // Get the first selected file
//     setSelectedFile(event.target.files[0]);
//   };

//   // Handler for the save button click
//   const handleSave = () => {
//     if (selectedFile) {
//       // The selected file is already a File object, which is a type of Blob
//       // Use the saveAs function to prompt the user to save the file
//       saveAs(selectedFile, selectedFile.name);
//     } else {
//       alert("Please select a file first!");
//     }
//   };

//   return (
//     <div>
//       <h2>Save Uploaded File</h2>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleSave} disabled={!selectedFile}>
//         Save File
//       </button>
//       <Box margin={1} border={1} display={"flex"} flexDirection={"column"}>
//         <Input disableUnderline />
//         <Box>
//           {selectedFile && (
//             <Chip label={selectedFile && selectedFile.name}></Chip>
//           )}
//           <AttachmentOutlinedIcon
//             fontSize="large"
//             sx={{ alignSelf: "center" }}
//           />
//         </Box>
//       </Box>
//     </div>
//   );
// };

// export default FileSaverComponent;

// Example React component
import React, { useState, useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";

const FileUploadComponent = () => {
  const [connection, setConnection] = useState(null);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://192.168.0.75:7173/chatHub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => console.log("SignalR Connected."))
        .catch((err) => console.error("Connection failed: ", err));
    }
  }, [connection]);

  const sendFile = async () => {
    console.log("tdt");
    const file = fileInputRef.current.files[0];
    if (!file || !connection) return;

    const reader = new FileReader();

    reader.onload = async (event) => {
      const arrayBuffer = event.target.result;
      const uint8Array = new Uint8Array(arrayBuffer);
      const formData = new FormData();
      formData.append("formFile", file); // "formFile" matches the backend parameter name
      formData.append("fileName", "fileName");

      console.log("Formdata", formData);
      try {
        console.log("tdt");
        // Invoke the server-side method named 'UploadFile'
        await connection.invoke("UploadFile", file.name, uint8Array);
        console.log("File sent successfully!");
      } catch (err) {
        console.error("Error sending file:", err);
      }
    };

    // Read the file as an ArrayBuffer
    reader.readAsArrayBuffer(file);
  };

  const handleFileChange = () => {
    // const file = e.target.files[0];
    const file = selectedFile;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64String = reader.result.split(",")[1]; // remove prefix

      if (connection) {
        await connection.invoke("UploadFile", {
          fileName: file.name,
          fileType: file.type,
          fileData: base64String,
        });
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
      <button onClick={handleFileChange}>Send File via SignalR</button>
    </div>
  );
};

export default FileUploadComponent;
