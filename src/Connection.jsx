import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { ConnectionContext } from "./context";

const Connection = ({ children }) => {
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
        .then(() => {
          console.log("Connection established");
        })
        .catch((e) => console.log("Connection failed:", e));
    }

  }, [connection]);

  return (
    <ConnectionContext.Provider value={connection}>
      {children}
    </ConnectionContext.Provider>
  );
};

export default Connection;
