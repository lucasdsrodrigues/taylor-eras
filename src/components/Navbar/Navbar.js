// Importo o React pra criar o componente
import React from "react";
// Importo o CSS da barra de navegação
import './navbar.css';

// Componente da barra de navegação do topo (navbar)
export default function Navbar() {
  return (
    <header className="topbar">
      <nav className="nav">
        {/* Logo com as iniciais T.S (Taylor Swift) */}
        <a href="#" className="nav-logo">T.S</a>

        {/* Links de navegação */}
        <ul className="nav-links">
          <li><a href="#eras">Eras</a></li>
          <li><a href="#sobre">Sobre</a></li>
          <li><a href="#galeria">Galeria</a></li>
        </ul>

        {/* Botão de call-to-action (contato) */}
        <a href="#contato" className="nav-cta">Contato</a>
      </nav>

    </header>
  );
}