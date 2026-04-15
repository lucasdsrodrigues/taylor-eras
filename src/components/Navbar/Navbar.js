import React from "react";
import './navbar.css';

export default function Navbar() {
  return (
    <header className="topbar">
      <nav className="nav">
        <a href="#" className="nav-logo">T.S</a>

        <ul className="nav-links">
          <li><a href="#eras">Eras</a></li>
          <li><a href="#sobre">Sobre</a></li>
          <li><a href="#galeria">Galeria</a></li>
        </ul>

        <a href="#contato" className="nav-cta">Contato</a>
      </nav>

    </header>
  );
}