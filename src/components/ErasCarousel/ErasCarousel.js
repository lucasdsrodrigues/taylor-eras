import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import './eras.css';

import debutImg from '../../imagens/debut.jpg';
import fearlessImg from '../../imagens/fearless.jpg';
import speaknowImg from '../../imagens/speaknow.jpg';
import redImg from '../../imagens/red.jpg';
import _1989Img from '../../imagens/1989.jpg';
import reputationImg from '../../imagens/reputation.jpg';
import loverImg from '../../imagens/lover.jpg';
import folkloreImg from '../../imagens/folklore.jpg';
import evermoreImg from '../../imagens/evermore.jpg';
import midnightsImg from '../../imagens/midnights.jpg';
import ttpdImg from '../../imagens/ttpd.jpg';
import showgirlImg from '../../imagens/showgirl.jpg';

export default function ErasCarousel({ currentIndex, setCurrentIndex }) {
  const trackRef = useRef(null);
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  const slidesData = [
    { title: "Taylor Swift", text: "A mess of a dreamer, with the nerve to adore you", eraClass: "era-debut", img: debutImg, path: "/debut" },
    { title: "Fearless", text: "All the pages are just slipping through my hands", eraClass: "era-fearless", img: fearlessImg, path: "/fearless" },
    { title: "Speak Now", text: "Long live all the magic we made", eraClass: "era-speak-now", img: speaknowImg, path: "/speak-now" },
    { title: "Red", text: "Love is a ruthless game unless you play it good and right", eraClass: "era-red", img: redImg, path: "/red" },
    { title: "1989", text: "The rumors are terrible and cruel", eraClass: "era-1989", img: _1989Img, path: "/1989" },
    { title: "Reputation", text: "Please don't ever become a stranger", eraClass: "era-reputation", img: reputationImg, path: "/reputation" },
    { title: "Lover", text: "You gotta step into the daylight and let it go", eraClass: "era-lover", img: loverImg, path: "/lover" },
    { title: "Folklore", text: "Living for the hope of it all", eraClass: "era-folklore", img: folkloreImg, path: "/folklore" },
    { title: "Evermore", text: "One for the money, two for the show", eraClass: "era-evermore", img: evermoreImg, path: "/evermore" },
    { title: "Midnights", text: "I'll stare directly at the sun, but never in the mirror", eraClass: "era-midnights", img: midnightsImg, path: "/midnights" },
    { title: "The Tortured Poets Department", text: "Please, i've been on my knees, change the prophecy", eraClass: "era-tortured-poets-department", img: ttpdImg, path: "/ttpd" },
    { title: "The Life of a Showgirl", text: "This empire belongs to me", eraClass: "era-the-life-of-a-showgirl", img: showgirlImg, path: "/showgirl" },
  ];

  const updateCarousel = () => {
    const carousel = carouselRef.current;
    const track = trackRef.current;
    if (!carousel || !track) return;

    const slides = Array.from(track.children);
    const activeSlide = slides[currentIndex];

    if (!activeSlide) return;

    const carouselRect = carousel.getBoundingClientRect();
    const slideRect = activeSlide.getBoundingClientRect();

    const carouselCenter = carouselRect.width / 2;
    const slideCenter = activeSlide.offsetLeft + slideRect.width / 2;

    const offset = slideCenter - carouselCenter;
    track.style.transform = `translateX(${-offset}px)`;

    slides.forEach((slide, index) => {
      slide.classList.remove("active", "near", "far");
      if (index === currentIndex) slide.classList.add("active");
      else if (Math.abs(index - currentIndex) === 1) slide.classList.add("near");
      else if (Math.abs(index - currentIndex) >= 2) slide.classList.add("far");
    });
  };

  useEffect(() => {
    updateCarousel();
    window.addEventListener("resize", updateCarousel);
    return () => window.removeEventListener("resize", updateCarousel);
  }, [currentIndex]);

  return (
    <section className="eras-section" id="eras">
      <div className="eras-carousel" ref={carouselRef}>
        <div className="carousel-track" ref={trackRef}>
          {slidesData.map((slide, index) => (
            <div
              key={index}
              className={`carousel-slide ${slide.eraClass}`}
              style={{ 
                backgroundImage: `url(${slide.img})`,
                cursor: index === currentIndex ? 'pointer' : 'grab'
              }}
              /* Só navega se for o slide do meio (o ativo) */
              onClick={() => {
                if (index === currentIndex) {
                  navigate(slide.path);
                } else {
                  setCurrentIndex(index);
                }
              }}
            >
              <div className="era-content">
                <h3>{slide.title}</h3>
                <p>{slide.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="carousel-controls">
          <button
            className="prev"
            aria-label="Anterior"
            onClick={(e) => {
              e.stopPropagation();
              currentIndex > 0 && setCurrentIndex(currentIndex - 1);
            }}
          >
            ‹
          </button>
          <button
            className="next"
            aria-label="Próximo"
            onClick={(e) => {
              e.stopPropagation();
              currentIndex < slidesData.length - 1 && setCurrentIndex(currentIndex + 1);
            }}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}