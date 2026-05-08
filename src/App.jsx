import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { useState } from "react";
import { UserDetailsContext } from "./context";
import { createTheme, ThemeProvider } from "@mui/material";
import ChatRoutes from "./ChatRoutes";

function App() {
  const [userDetails, setUserDetails] = useState({
    Username: "",
    UserId: "",
    Usernames: {},
    Groupnames: [],
    Password: "",
  });

  const theme = createTheme({
    colorSchemes: {
      light: true,
    },
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <UserDetailsContext value={{ userDetails, setUserDetails }}>
          <BrowserRouter>
            <ChatRoutes />
          </BrowserRouter>
        </UserDetailsContext>
      </ThemeProvider>
    </>
  );
}

export default App;
