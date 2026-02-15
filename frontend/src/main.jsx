import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
// Import your provider
import { XpProvider } from "./XPContext.jsx"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Wrap App here so all pages can see the XP */}
    <XpProvider>
      <App />
    </XpProvider>
  </React.StrictMode>
);