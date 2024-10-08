import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./popup/app";
const entry = document.getElementById("main");
if (entry) {
  const root = ReactDOM.createRoot(entry);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
