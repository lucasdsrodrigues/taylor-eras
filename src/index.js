import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import noiseTexture from "./imagens/noise.png";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <div style={{ position: "relative" }}>
    <App />
    <div
      style={{
        content: '""',
        position: "fixed",
        inset: 0,
        backgroundImage: `url(${noiseTexture})`,
        opacity: 0.035,
        pointerEvents: "none",
        zIndex: 999,
      }}
    />
  </div>
);
