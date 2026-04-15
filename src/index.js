import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import paperTexture from "./imagens/paper-vintage.png";
import noiseTexture from "./imagens/noise.png";

// Criar root
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <div
    style={{
      backgroundImage: `url(${paperTexture})`,
      backgroundRepeat: "repeat",
      backgroundSize: "420px",
      position: "relative",
    }}
  >
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
