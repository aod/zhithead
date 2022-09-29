import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import BreakpointsProvider from "./components/providers/BreakpointsProvider";
import GlobalStateProvider from "./components/providers/GlobalStateProvider";
import "./main.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BreakpointsProvider>
      <GlobalStateProvider>
        <App />
      </GlobalStateProvider>
    </BreakpointsProvider>
  </React.StrictMode>
);
