import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
  .withUrl("https://localhost:7173/chatHub", {
    skipNegotiation: true,
    transport: signalR.HttpTransportType.WebSockets,
  })
  .build();

const Chat = () => {
  testConnection();
  //   console.log(sendMessage());
};

const testConnection = async () => {
  connection.on("ReceiveMessage");
  connection
    .start()
    .then(() => {
      console.log("Connected to SignalR hub");
    })
    .catch((err) => console.error("Error connecting to hub:", err));
};

// const sendMessage = async () => {
//   if (connection) {
//     try {
//       await connection.invoke("SendOffersToUser"); // "SendMessage" is a method on your hub
//     } catch (e) {
//       console.error("Error invoking SendMessage: ", e);
//     }
//   }
// };

export default Chat;
