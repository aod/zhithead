import "./main.css";

import React from "react";
import ReactDOM from "react-dom/client";

import BreakpointsProvider from "./components/providers/BreakpointsProvider";
import { GlobalStateContext } from "./components/providers/GlobalStateProvider";
import App from "./components/App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BreakpointsProvider>
      <GlobalStateContext.Provider>
        <App />
      </GlobalStateContext.Provider>
    </BreakpointsProvider>
  </React.StrictMode>
);
