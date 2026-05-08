import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { Provider } from "react-redux";
import { store } from "./store/store.js";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
