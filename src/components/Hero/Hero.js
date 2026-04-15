import React from "react";
import './hero.css';
import logo from '../../imagens/logo.png'; // ajuste o caminho conforme sua pasta imagens

function Hero() {
  return (
    <header className="hero">
      <img src={logo} alt="Taylor Swift Logo" className="logo" />

      <span className="hero-eyebrow">discografia</span>

      <h1>As Eras da Taylor Swift</h1>

      <p>
        Um passeio pela evolução artística, estética e musical
        da maior artista de sua geração.
      </p>
    </header>
  );
}

export default Hero;