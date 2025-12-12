import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { BrowserRouter } from "react-router-dom";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

createRoot(document.getElementById("root")).render(<App />);
