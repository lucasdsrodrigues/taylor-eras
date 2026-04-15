import React from "react";
import "./timeline.css";

const timelineItems = [
  { year: 2006, name: "Debut", className: "debut" },
  { year: 2008, name: "Fearless", className: "fearless" },
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

function Timeline({ currentIndex, onSelectEra }) {
  return (
    <section className="timeline-section">
      <h2 className="timeline-title">Uma jornada pelas eras</h2>
      <div className="timeline">
        {timelineItems.map((item, index) => (
          <div 
            key={index} 
            className={`timeline-item ${item.className} ${index === currentIndex ? 'active-era' : ''}`}
            onClick={() => onSelectEra(index)}
          >
            <span>{item.year}</span>
            <p>{item.name}</p>
            {item.easter && <span className="easter-text">{item.easter}</span>}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Timeline;