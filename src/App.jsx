import ChatComponent from "./Chat";
import LoginForm from "./Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
// import { useState } from "react";
import { UserDetailsContext } from "./context";
import Connection from "./Connection";
import AudioCall from "./AudioCall";

function App() {
  // const [userDetails, setUserDetails] = useState({
  //   Username: "",
  //   UserId: "",
  //   Usernames: {},
  //   Groupnames: [],
  // });

  return (
    <>
      <AudioCall />
      {/* <Connection>
        <UserDetailsContext value={{ userDetails, setUserDetails }}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LoginForm />} />
              <Route path="/chat" element={<ChatComponent />} />
            </Routes>
          </BrowserRouter>
        </UserDetailsContext>
      </Connection> */}
    </>
  );
}

export default App;
