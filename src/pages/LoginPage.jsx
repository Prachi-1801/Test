import BackgroundBlobs from "../components/BackgroundBlobs";
import TrianglesLayer from "../components/TrianglesLayer";
import LoginPopup from "../components/LoginPopup";
import "./LoginPage.css";

const LoginPage = () => {
  return (
    <div className="page">
      <BackgroundBlobs />
      <TrianglesLayer />
      <LoginPopup />
    </div>
  );
};

export default LoginPage;
