import ChatComponent from "./Chat";
import LoginForm from "./Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { useState } from "react";
import { UserDetailsContext, UserNamesContext } from "./context";
import Connection from "./Connection";

function App() {
  const [userDetails, setUserDetails] = useState({
    Username: "",
    Password: "",
    UserId: "",
  });
  const [usernames, setUsernames] = useState({});

  return (
    <>
      <Connection>
        <UserDetailsContext value={{ userDetails, setUserDetails }}>
          <UserNamesContext value={{ usernames, setUsernames }}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<LoginForm />} />
                {/* <Route path="/test" element={<ShowForm />} /> */}
                <Route path="/chat" element={<ChatComponent />} />
                {/* <Route
            path="/test"
            element={
              <StyledEngineProvider injectFirst>
                <CustomizedMenus />
              </StyledEngineProvider>
            }
          /> */}
              </Routes>
            </BrowserRouter>
          </UserNamesContext>
        </UserDetailsContext>
      </Connection>
    </>
  );
  // return <LoginForm />;
  // return <CalculateEMI />;
  // return <ShowForm />;
  // return <Chat />;
  // return <SignalRComponent />;
}

export default App;
