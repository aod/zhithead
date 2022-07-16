import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import GlobalStateProvider from "./components/GlobalStateProvider";
import "./main.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlobalStateProvider>
      <App />
    </GlobalStateProvider>
  </React.StrictMode>
);
