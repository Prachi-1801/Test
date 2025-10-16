import React, { useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr";

function SignalRComponent() {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);

  // Set up the SignalR connection
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7173/chatHub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      }) // Replace with your hub URL
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  // Handle connection and define server-to-client handlers
  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connected to SignalR hub");

          // Define method to receive messages from the hub
          connection.on("ReceiveMessage", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
          });
        })
        .catch((err) => console.error("SignalR connection error: ", err));
    }
  }, [connection]);

  // Function to call the server-side method
  const invokeServerMethod = () => {
    console.log("test");
    if (connection) {
      console.log("test1");
      try {
        var x = connection.invoke("SendOffersToUser", ["dfvcfv"]);
        console.log(x);
      } catch (err) {
        console.error("Error invoking server method:", err);
      }
    }
  };

  return (
    <div>
      <h1>SignalR Example</h1>
      <button
        onClick={() => {
          fetch("https://localhost:7173/api/Chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // body: JSON.stringify({ user: "API", text: "Hello from API!" }),
          }).then((t) => setMessages([t]));
        }}
      >
        Send Message via API
      </button>
      <button onClick={invokeServerMethod}>Invoke Server API</button>

      <h2>Received Messages:</h2>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
}

export default SignalRComponent;

// import * as signalR from "@microsoft/signalr";

// const connection = new signalR.HubConnectionBuilder()
//   .withUrl("https://localhost:7173/chatHub", {
//     skipNegotiation: true,
//     transport: signalR.HttpTransportType.WebSockets,
//   })
//   .build();

// const Chat = () => {
//   testConnection();
//   //   console.log(sendMessage());
// };

// const testConnection = async () => {
//   connection.on("ReceiveMessage");
//   connection
//     .start()
//     .then(() => {
//       console.log("Connected to SignalR hub");
//     })
//     .catch((err) => console.error("Error connecting to hub:", err));
// };

// // const sendMessage = async () => {
// //   if (connection) {
// //     try {
// //       await connection.invoke("SendOffersToUser"); // "SendMessage" is a method on your hub
// //     } catch (e) {
// //       console.error("Error invoking SendMessage: ", e);
// //     }
// //   }
// // };

// export default Chat;
