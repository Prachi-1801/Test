import { HubConnectionBuilder, HttpTransportType } from "@microsoft/signalr";
import React, { useState, useEffect } from "react";

const GroupChat = () => {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputUser, setInputUser] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [inputGroup, setInputGroup] = useState("PublicGroup"); // Default group

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://192.168.0.75:7173/chatHub", {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connected!");

          // Join the default group immediately after connection is established
          connection
            .invoke("JoinGroup", inputGroup)
            .catch((err) => console.error(err));

          // Listen for "ReceiveMessage" events from the hub
          connection.on("ReceiveMessage", (user, message) => {
            setMessages((prevMessages) => [...prevMessages, { user, message }]);
          });

         
        })
        .catch((e) => console.log("Connection failed: ", e));
    }
  }, [connection, inputGroup]);

  const sendMessageToGroup = async () => {
    if (connection) {
      try {
        // Invoke the server-side method "SendMessageToGroup"
        await connection.invoke(
          "SendMessageToGroup",
          inputGroup,
          inputUser,
          inputMessage
        );
        setInputMessage("");
      } catch (e) {
        console.error(e);
      }
    } else {
      alert("No connection to server yet.");
    }
  };

  return (
    <div>
      <h2>Group Chat</h2>
      <div>
        User:{" "}
        <input
          value={inputUser}
          onChange={(e) => setInputUser(e.target.value)}
        />
        Group:{" "}
        <input
          value={inputGroup}
          onChange={(e) => setInputGroup(e.target.value)}
        />
        <button onClick={() => connection.invoke("JoinGroup", inputGroup)}>
          Join New Group
        </button>
      </div>
      <div>
        Message:{" "}
        <input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button onClick={sendMessageToGroup}>Send to Group</button>
      </div>
      <hr />
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.user}:</strong> {msg.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupChat;
