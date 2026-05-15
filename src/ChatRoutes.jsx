import { Route, Routes } from "react-router-dom";
import LoginForm from "./Login";
import ChatComponent from "./Chat";
import Register from "./Register";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./components/RegisterPage";

const ChatRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/chat" element={<ChatComponent />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
};

export default ChatRoutes;
