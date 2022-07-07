import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import GlobalStateProvider from "./GlobalStateProvider";
import "./main.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlobalStateProvider>
      <App />
    </GlobalStateProvider>
  </React.StrictMode>
);
