// Importo o React pra usar JSX e componentes
import React from "react";
// Importo o ReactDOM pra renderizar a aplicação no navegador
import ReactDOM from "react-dom/client";
// Importo o componente principal da aplicação (App)
import App from "./App";
// Importo o CSS global que aplica estilos em toda a aplicação
import "./index.css";
// Importo a textura de ruído (noise) pra dar aquele efeito visual granulado na tela inteira
import noiseTexture from "./imagens/noise.png";

// Crio a raiz do React apontando pro elemento "root" que tá no index.html
const root = ReactDOM.createRoot(document.getElementById("root"));

// Renderizo a aplicação dentro de uma div que posiciona tudo relativamente
root.render(
  <div style={{ position: "relative" }}>
    {/* Aqui fica a aplicação inteira com todas as rotas e páginas */}
    <App />
    {/* Essa div invisível cria o efeito de textura granulada por cima de tudo */}
    {/* Ela fica fixa na tela, não bloqueia cliques (pointerEvents: none) e tem opacidade baixa */}
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
