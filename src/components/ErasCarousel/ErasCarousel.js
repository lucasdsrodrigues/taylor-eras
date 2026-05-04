import React, { useEffect, useRef, useCallback } from "react";
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

  const dragState = useRef({ isDragging: false, startX: 0, delta: 0, didDrag: false });

  const eraColors = [
    '#6aebb4', '#f7c948', '#c77dff', '#e74c3c', '#74b9ff', '#2d3436',
    '#ffb6c1', '#b8cbb8', '#7d8f69', '#1e3799', '#3d3d3d', '#c75b12'
  ];

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

      const distance = index - currentIndex;
      slide.style.setProperty('--parallax-bg', `${distance * 30}px`);
      const content = slide.querySelector('.era-content');
      if (content) {
        content.style.setProperty('--parallax-text', `${distance * -8}px`);
      }
    });
  };

  const handleMouseMove = useCallback((e, index) => {
    if (dragState.current.isDragging) return;
    const slide = e.currentTarget;
    const rect = slide.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const isActive = index === currentIndex;
    const maxDeg = isActive ? 6 : 2;
    const rotateY = (x - 0.5) * maxDeg * 2;
    const rotateX = (0.5 - y) * maxDeg * 2;
    slide.style.setProperty('--tilt-x', `${rotateX}deg`);
    slide.style.setProperty('--tilt-y', `${rotateY}deg`);
  }, [currentIndex]);

  const handleMouseLeave = useCallback((e) => {
    const slide = e.currentTarget;
    slide.style.setProperty('--tilt-x', '0deg');
    slide.style.setProperty('--tilt-y', '0deg');
  }, []);

  const handlePointerDown = useCallback((e) => {
    if (e.target.closest('.carousel-controls')) return;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    dragState.current = { isDragging: true, startX: clientX, delta: 0, didDrag: false };
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      if (!dragState.current.isDragging) return;
      const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      const delta = clientX - dragState.current.startX;
      dragState.current.delta = delta;
      if (Math.abs(delta) > 5) dragState.current.didDrag = true;
      const track = trackRef.current;
      const carousel = carouselRef.current;
      if (!track || !carousel) return;
      const slides = Array.from(track.children);
      const activeSlide = slides[currentIndex];
      if (!activeSlide) return;
      track.style.transition = 'none';
      const carouselCenter = carousel.getBoundingClientRect().width / 2;
      const slideCenter = activeSlide.offsetLeft + activeSlide.offsetWidth / 2;
      const baseOffset = slideCenter - carouselCenter;
      track.style.transform = `translateX(${-baseOffset + delta}px)`;
    };

    const onEnd = () => {
      if (!dragState.current.isDragging) return;
      dragState.current.isDragging = false;
      const track = trackRef.current;
      if (track) track.style.transition = '';
      const delta = dragState.current.delta;
      if (Math.abs(delta) > 80) {
        if (delta < 0 && currentIndex < slidesData.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else if (delta > 0 && currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
        } else {
          updateCarousel();
        }
      } else {
        updateCarousel();
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [currentIndex, setCurrentIndex]);

  useEffect(() => {
    updateCarousel();
    window.addEventListener("resize", updateCarousel);
    return () => window.removeEventListener("resize", updateCarousel);
  }, [currentIndex]);

  return (
    <section
      className="eras-section"
      id="eras"
      style={{ '--section-era-color': eraColors[currentIndex] || '#fff' }}
    >
      <div className="eras-section-bg-overlay" />
      <div
        className="eras-carousel"
        ref={carouselRef}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
      >
        <div className="carousel-track" ref={trackRef}>
          {slidesData.map((slide, index) => (
            <div
              key={index}
              className={`carousel-slide ${slide.eraClass}`}
              style={{
                backgroundImage: `url(${slide.img})`,
                cursor: index === currentIndex ? 'pointer' : 'grab'
              }}
              onClick={() => {
                if (dragState.current.didDrag) {
                  dragState.current.didDrag = false;
                  return;
                }
                if (index === currentIndex) {
                  navigate(slide.path);
                } else {
                  setCurrentIndex(index);
                }
              }}
              onMouseDown={(e) => {
                if (index === currentIndex) {
                  e.currentTarget.classList.add('pressing');
                  setTimeout(() => e.currentTarget.classList.remove('pressing'), 150);
                }
              }}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={(e) => handleMouseLeave(e)}
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