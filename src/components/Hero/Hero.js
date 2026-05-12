// Importo o React pra criar o componente
import React from "react";
// Importo o CSS do hero
import './hero.css';
// Importo a logo da Taylor Swift que fica no topo
import logo from '../../imagens/logo.png'; 

// Componente Hero — é o banner principal que aparece no topo da página inicial
function Hero() {
  return (
    <header className="hero">
      {/* Logo da Taylor Swift */}
      <img src={logo} alt="Taylor Swift Logo" className="logo" />
      {/* Texto pequeno acima do título */}
      <span className="hero-eyebrow">discografia</span>
      {/* Título principal */}
      <h1>As Eras da Taylor Swift</h1>
      {/* Descrição curta do projeto */}
      <p>
        Um passeio pela evolução artística, estética e musical
        da maior artista de sua geração.
      </p>
    </header>
  );
}

// Exporto o componente Hero
export default Hero;