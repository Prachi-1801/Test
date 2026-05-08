// Connection.jsx
import * as signalR from "@microsoft/signalr";

export const connectionRef = { current: null }; // module-level ref, importable anywhere

export const buildConnection = (token) => {
  connectionRef.current = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:7272/chatHub", {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .build();
};
