// Importo o React pra criar o componente
import React from "react";
// Importo o CSS da timeline
import "./timeline.css";

// Lista de todas as eras da Taylor Swift com ano, nome e classe CSS pra estilização
const timelineItems = [
  { year: 2006, name: "Debut", className: "debut" },
  { year: 2008, name: "Fearless", className: "fearless" },
  // Speak Now tem um easter egg: trecho da música "Long Live"
  { year: 2010, name: "Speak Now", className: "speaknow", easter: "long live the walls we crashed through" },
  { year: 2012, name: "Red", className: "red" },
  { year: 2014, name: "1989", className: "n1989" },
  { year: 2017, name: "Reputation", className: "reputation" },
  { year: 2019, name: "Lover", className: "lover" },
  { year: 2020, name: "Folklore", className: "folklore" },
  { year: 2020, name: "Evermore", className: "evermore" },
  { year: 2022, name: "Midnights", className: "midnights" },
  { year: 2024, name: "TTPD", className: "ttpd" },
  { year: 2025, name: "TLOAS", className: "showgirl" },
];

// Componente Timeline — mostra a linha do tempo das eras embaixo do carrossel
// Recebe o índice atual e uma função pra selecionar a era quando o usuário clica
function Timeline({ currentIndex, onSelectEra }) {
  return (
    <section className="timeline-section">
      {/* Título da seção */}
      <h2 className="timeline-title">Uma jornada pelas eras</h2>
      <div className="timeline">
        {/* Renderizo cada item da timeline */}
        {timelineItems.map((item, index) => (
          <div 
            key={index} 
            // Adiciono a classe 'active-era' se esse item é o que tá selecionado no carrossel
            className={`timeline-item ${item.className} ${index === currentIndex ? 'active-era' : ''}`}
            // Ao clicar, mudo o carrossel pra essa era
            onClick={() => onSelectEra(index)}
          >
            {/* Ano da era */}
            <span>{item.year}</span>
            {/* Nome da era */}
            <p>{item.name}</p>
            {/* Se tem easter egg, mostro o texto escondido */}
            {item.easter && <span className="easter-text">{item.easter}</span>}
          </div>
        ))}
      </div>
    </section>
  );
}

// Exporto o componente Timeline
export default Timeline;