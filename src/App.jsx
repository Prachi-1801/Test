// import CalculateEMI from "./CalculateEMI";
// import ShowForm from "./BasicCrudWithTable";
// import ShowForm from "./BasicCrud";
import ShowForm from "./Test";
import SignalRComponent from "./Chat";
import LoginForm from "./Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CustomizedMenus from "./DownloadButton";
import { StyledEngineProvider } from "@mui/material/styles";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/test" element={<ShowForm />} />
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
    </>
  );
  // return <LoginForm />;
  // return <CalculateEMI />;
  // return <ShowForm />;
  // return <Chat />;
  // return <SignalRComponent />;
}

export default App;
