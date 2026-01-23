import React, { useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { saveAs } from "file-saver";

const FileUploadComponent = () => {
  const [connection, setConnection] = useState(null);

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

  useEffect(() => {
    if (connection) {
      connection.on("FileUploaded", (fileName, fileType, fileData) => {
        var binaryString = atob(fileData);
        var bytes = new Uint8Array(binaryString.length);
        for (var i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        var blob = new Blob([bytes], { type: fileType });
        saveAs(blob, fileName);
      });
    }
  }, [connection]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file || !connection) return;

    const reader = new FileReader();

    reader.onload = async () => {
      const base64Data = reader.result.split(",")[1];

      try {
        await connection.invoke("UploadFile", file.name, file.type, base64Data);
      } catch (err) {
        console.error("Upload failed:", err.toString());
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
};

export default FileUploadComponent;
