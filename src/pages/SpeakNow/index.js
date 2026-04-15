import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './SpeakNow.css';

import speakNowCover from '../../imagens/speak-now-album.png';
import speakNowTVCover from '../../imagens/speak-now-tv.webp';
import taylorStoryImg from '../../imagens/speaknow1.jpg';
import taylorVaultImg from '../../imagens/speak-now-tv-hed.png';
import sn1 from '../../imagens/sn1.webp';
import sn2 from '../../imagens/sn2.webp';
import sn3 from '../../imagens/sn3.webp';
import sn4 from '../../imagens/sn4.webp';
import sn5 from '../../imagens/sn5.webp';
import sn6 from '../../imagens/sn6.webp';
import sn7 from '../../imagens/sn7.webp';
import sn8 from '../../imagens/sn8.webp';
import sn9 from '../../imagens/sn9.webp';
import sn10 from '../../imagens/sn10.webp';
import sn11 from '../../imagens/sn11.webp';
import sn12 from '../../imagens/sn12.webp';
import sn13 from '../../imagens/sn13.webp';
import sn14 from '../../imagens/sn14.webp';
import sn15 from '../../imagens/sn15.webp';
import sn16 from '../../imagens/sn16.webp';
import sn17 from '../../imagens/sn17.webp';
import sn18 from '../../imagens/sn18.webp';
import sn19 from '../../imagens/sn19.webp';
import sn20 from '../../imagens/sn20.webp';

// Hook customizado para animações de scroll
const useInView = (options = {}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.15, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
};

const SpeakNow = () => {
  const [isTV, setIsTV] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const [playingTrack, setPlayingTrack] = useState(null);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const audioRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tourScrollRef = useRef(null);
  const photoScrollRef = useRef(null);

  // Refs para animações de scroll
  const [storyRef, storyInView] = useInView();
  const [tracklistRef, tracklistInView] = useInView();
  const [tourRef, tourInView] = useInView();
  const [timelineRef, timelineInView] = useInView();
  const [mvRef, mvInView] = useInView();
  const [concertRef, concertInView] = useInView();

  const scrollToPage = (index) => {
    setActivePage(index);
    if (tourScrollRef.current) {
      const pageWidth = tourScrollRef.current.offsetWidth;
      tourScrollRef.current.scrollTo({
        left: pageWidth * index,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const scrollContainer = photoScrollRef.current;
    if (!scrollContainer) return;

    const handleWheelEvent = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        scrollContainer.scrollLeft += e.deltaY;
      }
    };

    scrollContainer.addEventListener('wheel', handleWheelEvent, { passive: false });

    return () => {
      scrollContainer.removeEventListener('wheel', handleWheelEvent);
    };
  }, []);

  // Pré-carrega todos os previews do álbum Speak Now na montagem
  const [previews, setPreviews] = useState({});
  useEffect(() => {
    const fetchPreviews = async () => {
      try {
        const res = await fetch(
          'https://itunes.apple.com/search?term=taylor+swift+speak+now&entity=song&limit=50&country=US'
        );
        const data = await res.json();
        const map = {};
        data.results?.forEach(r => {
          if (r.previewUrl && r.trackName) {
            map[r.trackName.toLowerCase()] = r.previewUrl;
          }
        });
        setPreviews(map);
      } catch (e) {
        console.error('Erro ao carregar previews:', e);
      }
    };
    fetchPreviews();
  }, []);

  // Encontra o preview mais próximo pelo nome da track
  const findPreview = (trackName) => {
    const key = trackName.toLowerCase();
    return previews[key]
      || Object.entries(previews).find(([k]) => k.includes(key) || key.includes(k))?.[1]
      || null;
  };

  // Player
  const handlePlay = useCallback((trackName) => {
    if (playingTrack === trackName) {
      audioRef.current?.pause();
      setPlayingTrack(null);
      return;
    }
    const url = findPreview(trackName);
    if (!url) { alert(`Preview de "${trackName}" não disponível.`); return; }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = url;
      audioRef.current.load();
      audioRef.current.play().catch(e => console.error('Play error:', e));
      audioRef.current.onended = () => setPlayingTrack(null);
    }
    setPlayingTrack(trackName);
  }, [playingTrack, previews]);

  const albumData = {
    original: {
      released: "25 OUT, 2010",
      duration: "67:02 MIN",
      sales: "1.04M (DEBUT)",
      status: "6X PLATINA",
      buttonText: "UNLOCK THE VAULT"
    },
    tv: {
      released: "07 JUL, 2023",
      duration: "104:33 MIN",
      sales: "716K (DEBUT)",
      status: "RE-RECORDING",
      buttonText: "VINTAGE EDITION"
    }
  };

  const current = isTV ? albumData.tv : albumData.original;

  const standardTracks = [
    { name: "Mine", single: true }, { name: "Sparks Fly", single: true },
    { name: "Back to December", single: true }, { name: "Speak Now", single: false },
    { name: "Dear John", single: false }, { name: "Mean", single: true },
    { name: "The Story of Us", single: true }, { name: "Never Grow Up", single: false },
    { name: "Enchanted", single: false }, { name: "Better Than Revenge", single: false },
    { name: "Innocent", single: false }, { name: "Haunted", single: false },
    { name: "Last Kiss", single: false }, { name: "Long Live", single: false },
    { name: "Ours", single: true }, { name: "If This Was a Movie", single: false }
  ];

  const vaultTracks = [
    { name: "Electric Touch", feat: "feat. Fall Out Boy", single: false },
    { name: "When Emma Falls in Love", single: false },
    { name: "I Can See You", single: true },
    { name: "Castles Crumbling", feat: "feat. Hayley Williams", single: false },
    { name: "Foolish One", single: false },
    { name: "Timeless", single: false }
  ];

  return (
    <div className={`sn-page-container ${loaded ? 'sn-loaded' : ''}`}>
      <audio ref={audioRef} style={{ display: 'none' }} />
      <div className="sn-forest-root">
        {/* Estrelas CSS puras — 2 camadas com ritmo diferente */}
        <div className="sn-stars-layer sn-stars-sm"></div>
        <div className="sn-stars-layer sn-stars-md"></div>
        
        {/* Shooting Stars Layer */}
        <div className="sn-shooting-stars">
          <div className="sn-shooting-star"></div>
          <div className="sn-shooting-star"></div>
          <div className="sn-shooting-star"></div>
          <div className="sn-shooting-star"></div>
          <div className="sn-shooting-star"></div>
        </div>

        <div className="sn-fog-layer"></div>
        <div className="sn-texture-overlay"></div>

        {/* Dynamic Magical Wisps / Aura */}
        <svg className="sn-magic-wisps sn-magic-wisps--left" viewBox="0 0 400 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path 
              d="M 50 1000 C 150 800, -50 600, 150 400 C 350 200, 50 100, 200 -50" 
              stroke="url(#wispGradL)" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.4"
              filter="blur(8px)"
           />
           <path 
              d="M 100 1000 C 250 800, 0 550, 200 350 C 400 150, 100 50, 250 -50" 
              stroke="url(#wispGradL)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6"
           />
           <defs>
               <linearGradient id="wispGradL" x1="0" y1="1" x2="0" y2="0">
                   <stop offset="0%" stopColor="#db7ca5" stopOpacity="0"/>
                   <stop offset="50%" stopColor="#923c81" />
                   <stop offset="100%" stopColor="#cf94b6" stopOpacity="0"/>
               </linearGradient>
           </defs>
        </svg>

        <svg className="sn-magic-wisps sn-magic-wisps--right" viewBox="0 0 400 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path 
              d="M 350 1000 C 250 800, 450 600, 250 400 C 50 200, 350 100, 200 -50" 
              stroke="url(#wispGradR)" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.4"
              filter="blur(10px)"
           />
           <path 
              d="M 300 1000 C 150 800, 400 550, 200 350 C 0 150, 300 50, 150 -50" 
              stroke="url(#wispGradR)" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7"
           />
           <defs>
               <linearGradient id="wispGradR" x1="0" y1="1" x2="0" y2="0">
                   <stop offset="0%" stopColor="#923c81" stopOpacity="0"/>
                   <stop offset="50%" stopColor="#db7ca5" />
                   <stop offset="100%" stopColor="#cf94b6" stopOpacity="0"/>
               </linearGradient>
           </defs>
        </svg>
        <header className="sn-era-nav">
          <Link to="/fearless" className="nav-era-link left">✦ FEARLESS ERA</Link>
          <Link to="/red" className="nav-era-link right">RED ERA ✦</Link>
        </header>

        <div className="sn-main-wrapper">
          <div className="sn-title-area">
            <h1 className="sn-main-title">
               <span className="sn-title-glow" data-text="SPEAK NOW">SPEAK NOW</span>
            </h1>
            <p className="sn-artist-cursive">Taylor Swift</p>
          </div>

          <div className="sn-dynamic-grid">
            <div className="sn-widget pos-1">
              <h4>LANÇAMENTO</h4>
              <p>{current.released}</p>
            </div>
            <div className="sn-widget pos-2">
              <h4>DURAÇÃO</h4>
              <p>{current.duration}</p>
            </div>
            
            <div className="sn-album-wrap" onClick={() => setIsTV(!isTV)}>
              <div className="sn-magic-aura"></div>
              <div className="sn-spinning-rays"></div>
              <img src={isTV ? speakNowTVCover : speakNowCover} className="sn-album-img" alt="Capa" />
            </div>

            <div className="sn-widget pos-3">
              <h4>GÊNERO</h4>
              <p>COUNTRY ROCK</p>
            </div>
            <div className="sn-widget pos-4">
              <h4>STATUS</h4>
              <p>{current.status}</p>
            </div>
          </div>

          <p className="sn-floor-quote">"Long live all the magic we made..."</p>
          <div className="sn-button-row">
            <button
              className="sn-ticket-btn"
              onClick={() => tracklistRef.current?.scrollIntoView({ behavior: 'smooth' })}
            >TRACKLIST</button>
            <button className="sn-cta-main" onClick={() => setIsTV(!isTV)}>{current.buttonText}</button>
            <button className="sn-ticket-btn">VENDAS: {current.sales}</button>
          </div>
        </div>
      </div>

      <section className="sn-story-section" ref={storyRef}>
        <div className="sn-story-container">
          <div className="sn-story-image-area">
            <div className="sn-story-frame">
              <img src={taylorStoryImg} alt="Story" />
            </div>
          </div>
          <div className="sn-story-content">
            <span className="sn-story-subtitle">2010 | 2023</span>
            <h2 className="sn-story-title">A SELF-WRITTEN <br /> MASTERPIECE</h2>
            <p className="sn-story-text">
              Escrito inteiramente por Taylor Swift entre os 18 e 20 anos, Speak Now é o
              testemunho de uma artista que decidiu que ninguém contaria sua história
              além dela mesma. Cada música é uma confissão ou um desabafo corajoso.
            </p>
            <div className="sn-story-quote">"I first made Speak Now, completely self-written..."</div>
          </div>
        </div>
      </section>

      <section className={`sn-tracklist-section scroll-reveal ${tracklistInView ? 'in-view' : ''}`} ref={tracklistRef}>
        <h2 className="sn-tracklist-title">TRACKLIST</h2>
        <div className="sn-tracks-container">
          <div className="sn-track-column">
            {standardTracks.map((track, index) => (
              <div key={index} className={`sn-track-item ${track.single ? 'is-single' : ''} ${playingTrack === track.name ? 'is-playing' : ''}`}>
                <button
                  className={`track-play-btn ${playingTrack === track.name ? 'active' : ''}`}
                  onClick={() => handlePlay(track.name)}
                  aria-label={`Preview ${track.name}`}
                >
                  {playingTrack === track.name ? '■' : '▶'}
                </button>
                <span className="track-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="track-name">
                  {track.name} {track.single && <span className="single-star">✦</span>}
                </span>
                <span className="track-tag">{isTV ? "TV" : "ORIGINAL"}</span>
              </div>
            ))}
          </div>

          <div className="sn-track-column vault">
            <h3 className="vault-header">FROM THE VAULT</h3>
            {vaultTracks.map((track, index) => (
              <div key={index} className={`sn-track-item vault-track ${track.single ? 'is-single' : ''} ${playingTrack === track.name ? 'is-playing' : ''}`}>
                <button
                  className={`track-play-btn ${playingTrack === track.name ? 'active' : ''}`}
                  onClick={() => handlePlay(track.name)}
                  aria-label={`Preview ${track.name}`}
                >
                  {playingTrack === track.name ? '■' : '▶'}
                </button>
                <span className="track-number">{index + 17}</span>
                <span className="track-name">
                  {track.name}
                  {track.feat && <span className="track-feat"> {track.feat}</span>}
                  {track.single && <span className="single-star">✦</span>}
                </span>
                <span className="track-tag gold">FTV</span>
              </div>
            ))}
            <div className="sn-vault-image-container">
              <img src={taylorVaultImg} alt="Vault" className="sn-vault-image" />
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO: TIMELINE DA ERA */}
      <section className={`sn-timeline-section scroll-reveal ${timelineInView ? 'in-view' : ''}`} ref={timelineRef}>
        <div className="sn-timeline-inner">
          <span className="sn-mv-label">HISTÓRIA</span>
          <h2 className="sn-mv-title">TIMELINE DA ERA</h2>
          <div className="sn-timeline">
            {[
              { year: "OUT 2010", icon: "✦", title: "Speak Now é lançado", desc: "O álbum estreia com 1.04 milhão de cópias vendidas na primeira semana — inteiramente escrito por Taylor." },
              { year: "NOV 2010", icon: "🎵", title: "Mine atinge #3 na Billboard", desc: "O primeiro single do álbum consolida o sucesso da era e leva Taylor ao topo das paradas country e pop." },
              { year: "FEV 2011", icon: "🌍", title: "Speak Now World Tour começa", desc: "A turnê mundial estreia em Singapura, com shows grandiosos e cenários de conto de fadas." },
              { year: "ABR 2011", icon: "🏆", title: "Grammy Award: Best Country Album", desc: "Speak Now vence o Grammy de Melhor Álbum Country, confirmando Taylor como uma potência do gênero." },
              { year: "SET 2011", icon: "🎬", title: "Speak Now World Tour Live — DVD", desc: "O concerto filmado é lançado, imortalizando os shows épicos da turnê para os fãs ao redor do mundo." },
              { year: "DEZ 2011", icon: "💿", title: "Fim da turnê — 6x Platina", desc: "A turnê encerra após 111 shows e $123.7M arrecadados. O álbum alcança 6x Platina nos EUA." },
              { year: "JUL 2023", icon: "💜", title: "Speak Now (Taylor's Version)", desc: "A re-gravação é lançada com 6 vault tracks inéditas, incluindo colaborações com Fall Out Boy e Hayley Williams." },
              { year: "2023", icon: "🌟", title: "I Can See You — MV lançado", desc: "O videoclipe de I Can See You é lançado como surpresa, com os membros dos One Direction no elenco." },
            ].map((event, i) => (
              <div key={i} className={`sn-timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}>
                <div className="sn-timeline-node">{event.icon}</div>
                <div className="sn-timeline-card">
                  <span className="sn-timeline-year">{event.year}</span>
                  <h3 className="sn-timeline-event">{event.title}</h3>
                  <p className="sn-timeline-desc">{event.desc}</p>
                </div>
              </div>
            ))}
            <div className="sn-timeline-line" />
          </div>
        </div>
      </section>

      <section className={`sn-tour-section scroll-reveal ${tourInView ? 'in-view' : ''}`} ref={tourRef}>
        <h2 className="sn-section-title-alt">Tour Dates</h2>
        <div className="sn-ticket-wrapper">
          <div className="sn-ticket-body">
            <div className="sn-tour-scroll" ref={tourScrollRef}>
              <>
                <div className="tour-page">
                  <p><strong>Feb 09</strong> - Singapore, SG</p>
                  <p><strong>Feb 11</strong> - Seoul, KR</p>
                  <p><strong>Feb 13</strong> - Osaka, JP</p>
                  <p><strong>Feb 16</strong> - Tokyo, JP</p>
                  <p><strong>Feb 17</strong> - Tokyo, JP</p>
                  <p><strong>Feb 19</strong> - Quezon City, PH</p>
                  <p><strong>Feb 21</strong> - Hong Kong, HK</p>
                  <p><strong>Mar 06</strong> - Brussels, BE</p>
                  <p><strong>Mar 07</strong> - Rotterdam, NL</p>
                  <p><strong>Mar 09</strong> - Oslo, NO</p>
                  <p><strong>Mar 12</strong> - Oberhausen, DE</p>
                  <p><strong>Mar 15</strong> - Milan, IT</p>
                  <p><strong>Mar 17</strong> - Paris, FR</p>
                  <p><strong>Mar 19</strong> - Madrid, ES</p>
                  <p><strong>Mar 22</strong> - Birmingham, UK</p>
                  <p><strong>Mar 25</strong> - Belfast, UK</p>
                  <p><strong>Mar 27</strong> - Dublin, IE</p>
                  <p><strong>Mar 29</strong> - Manchester, UK</p>
                  <p><strong>Mar 30</strong> - London, UK</p>
                  <p><strong>May 21</strong> - Nashville, US</p>
                  <p><strong>May 27</strong> - Omaha, US</p>
                </div>

                <div className="tour-page">
                  <p><strong>May 28</strong> - Omaha, US</p>
                  <p><strong>May 29</strong> - Des Moines, US</p>
                  <p><strong>Jun 02</strong> - Sunrise, US</p>
                  <p><strong>Jun 03</strong> - Sunrise, US</p>
                  <p><strong>Jun 04</strong> - Orlando, US</p>
                  <p><strong>Jun 07</strong> - Columbus, US</p>
                  <p><strong>Jun 08</strong> - Milwaukee, US</p>
                  <p><strong>Jun 11</strong> - Detroit, US</p>
                  <p><strong>Jun 14</strong> - St. Paul, US</p>
                  <p><strong>Jun 15</strong> - St. Paul, US</p>
                  <p><strong>Jun 18</strong> - Pittsburgh, US</p>
                  <p><strong>Jun 21</strong> - Buffalo, US</p>
                  <p><strong>Jun 22</strong> - Hartford, US</p>
                  <p><strong>Jun 25</strong> - Foxborough, US</p>
                  <p><strong>Jun 26</strong> - Foxborough, US</p>
                  <p><strong>Jun 30</strong> - Greensboro, US</p>
                  <p><strong>Jul 01</strong> - Knoxville, US</p>
                  <p><strong>Jul 14</strong> - Montreal, CA</p>
                  <p><strong>Jul 15</strong> - Toronto, CA</p>
                  <p><strong>Jul 16</strong> - Toronto, CA</p>
                  <p><strong>Jul 19</strong> - Newark, US</p>
                </div>

                <div className="tour-page">
                  <p><strong>Jul 20</strong> - Newark, US</p>
                  <p><strong>Jul 23</strong> - Newark, US</p>
                  <p><strong>Jul 24</strong> - Newark, US</p>
                  <p><strong>Jul 28</strong> - Grand Rapids, US</p>
                  <p><strong>Jul 29</strong> - Indianapolis, US</p>
                  <p><strong>Jul 30</strong> - Cleveland, US</p>
                  <p><strong>Aug 02</strong> - Washington, US</p>
                  <p><strong>Aug 03</strong> - Washington, US</p>
                  <p><strong>Aug 06</strong> - Philadelphia, US</p>
                  <p><strong>Aug 07</strong> - Philadelphia, US</p>
                  <p><strong>Aug 09</strong> - Chicago, US</p>
                  <p><strong>Aug 10</strong> - Chicago, US</p>
                  <p><strong>Aug 13</strong> - St. Louis, US</p>
                  <p><strong>Aug 14</strong> - St. Louis, US</p>
                  <p><strong>Aug 18</strong> - Edmonton, CA</p>
                  <p><strong>Aug 19</strong> - Edmonton, CA</p>
                  <p><strong>Aug 23</strong> - Los Angeles, US</p>
                  <p><strong>Aug 24</strong> - Los Angeles, US</p>
                  <p><strong>Aug 27</strong> - Los Angeles, US</p>
                  <p><strong>Aug 28</strong> - Los Angeles, US</p>
                </div>

                <div className="tour-page">
                  <p><strong>Sep 01</strong> - San Jose, US</p>
                  <p><strong>Sep 02</strong> - San Jose, US</p>
                  <p><strong>Sep 03</strong> - Sacramento, US</p>
                  <p><strong>Sep 06</strong> - Portland, US</p>
                  <p><strong>Sep 07</strong> - Tacoma, US</p>
                  <p><strong>Sep 10</strong> - Vancouver, CA</p>
                  <p><strong>Sep 11</strong> - Vancouver, CA</p>
                  <p><strong>Sep 16</strong> - Nashville, US</p>
                  <p><strong>Sep 17</strong> - Nashville, US</p>
                  <p><strong>Sep 20</strong> - Bossier City, US</p>
                  <p><strong>Sep 21</strong> - Tulsa, US</p>
                  <p><strong>Sep 24</strong> - Kansas City, US</p>
                  <p><strong>Sep 27</strong> - Denver, US</p>
                  <p><strong>Sep 28</strong> - Salt Lake City, US</p>
                  <p><strong>Oct 01</strong> - Atlanta, US</p>
                  <p><strong>Oct 02</strong> - Atlanta, US</p>
                  <p><strong>Oct 04</strong> - Little Rock, US</p>
                  <p><strong>Oct 05</strong> - New Orleans, US</p>
                  <p><strong>Oct 08</strong> - Arlington, US</p>
                  <p><strong>Mar 02</strong> - Perth, AU</p>
                  <p><strong>Mar 18</strong> - Auckland, NZ</p>
                </div>
              </>
            </div>

            <div className="tour-pagination">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`dot ${activePage === i ? 'active' : ''}`}
                  onClick={() => scrollToPage(i)}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </section>


      <section className="sn-photos-section">
        <h2 className="sn-section-title-alt dark">Photos</h2>
        <div
          className="sn-photos-gallery"
          ref={photoScrollRef}
        >
          <div className="photo-track">
            {[sn1, sn2, sn3, sn4, sn5, sn6, sn7, sn8, sn9, sn10, sn11, sn12, sn13, sn14, sn15, sn16, sn17, sn18, sn19, sn20].map((foto, i) => (
              <img key={i} src={foto} alt={`Tour ${i}`} className="official-photo" />
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO: VIDEOCLIPES */}
      <section className="sn-mv-section">
        <div className="sn-mv-inner">
          <span className="sn-mv-label">MÍDIA & VISUAL</span>
          <h2 className="sn-mv-title">VIDEOCLIPES OFICIAIS</h2>
          <div className="sn-mv-grid">
            {[
              { title: "Mine", year: "2010", youtubeId: "XPBwXKgDTdE", desc: "1º single — lançado em Agosto de 2010" },
              { title: "Back to December", year: "2010", youtubeId: "QUwxKWT6m7U", desc: "2º single — uma rara canção de desculpas" },
              { title: "Mean", year: "2011", youtubeId: "jYa1eI1hpDE", desc: "3º single — hino contra o cyberbullying" },
              { title: "The Story of Us", year: "2011", youtubeId: "nN6VR92V70M", desc: "4º single — filmado para a era" },
              { title: "Sparks Fly", year: "2011", youtubeId: "oKar-tF__ac", desc: "5º single — clipe ao vivo histórico" },
              { title: "I Can See You (TV)", year: "2023", youtubeId: "lVkKLf4DCn8", desc: "From the Vault — clipe lançado com a TV" },
            ].map((mv, i) => (
              <a
                key={i}
                className="sn-mv-card"
                href={`https://www.youtube.com/watch?v=${mv.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="sn-mv-thumb">
                  <img
                    src={`https://img.youtube.com/vi/${mv.youtubeId}/hqdefault.jpg`}
                    alt={mv.title}
                  />
                  <div className="sn-mv-overlay">
                    <span className="sn-mv-play">▶</span>
                  </div>
                </div>
                <div className="sn-mv-info">
                  <span className="sn-mv-year">{mv.year}</span>
                  <h3 className="sn-mv-name">{mv.title}</h3>
                  <p className="sn-mv-desc">{mv.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO: O FILME DA ERA */}
      <section className="sn-concert-section">
        <div className="sn-concert-glow" />
        <div className="sn-concert-inner">
          <div className="sn-concert-text">
            <span className="sn-mv-label">CONCERTO FILMADO</span>
            <h2 className="sn-concert-title">SPEAK NOW<br />WORLD TOUR LIVE</h2>
            <p className="sn-concert-desc">
              Lançado em 2011, o filme documenta a incrível turnê mundial de Taylor Swift com efeitos
              especiais, castelos cenográficos e a magia única da era Speak Now. Com mais de
              <strong> 111 shows</strong> em todo o mundo, a turnê arrecadou
              <strong> $123,7 milhões</strong> — tornando-se uma das mais lucrativas de sua carreira até então.
            </p>
            <div className="sn-concert-badges">
              <div className="sn-badge">🎬 Lançado em 2011</div>
              <div className="sn-badge">🌍 111 Shows</div>
              <div className="sn-badge">💰 $123.7M Arrecadados</div>
              <div className="sn-badge">🏟️ 5 Continentes</div>
            </div>
            <a
              className="sn-concert-btn"
              href="https://www.youtube.com/watch?v=KFoOCZeKgzQ"
              target="_blank"
              rel="noopener noreferrer"
            >
              ▶ ASSISTIR TRECHO
            </a>
          </div>
          <div className="sn-concert-visual">
            <div className="sn-concert-frame">
              <img
                src={`https://img.youtube.com/vi/KFoOCZeKgzQ/hqdefault.jpg`}
                alt="Speak Now World Tour Live"
              />
              <div className="sn-concert-badge-overlay">WORLD TOUR LIVE</div>
            </div>
          </div>
        </div>
      </section>
      {/* SEÇÃO: AWARDS */}
      <section className="sn-awards-section">
        <div className="sn-awards-inner">
          <span className="sn-mv-label">RECONHECIMENTO</span>
          <h2 className="sn-mv-title">PRÊMIOS & CONQUISTAS</h2>
          <div className="sn-awards-grid">
            {[
              { icon: "🏆", award: "Grammy Award", category: "Best Country Album", year: "2012" },
              { icon: "🎵", award: "American Music Award", category: "Favorite Country Album", year: "2010" },
              { icon: "🌟", award: "Billboard Music Award", category: "Top Country Album", year: "2011" },
              { icon: "🎸", award: "ACM Award", category: "Album of the Year", year: "2011" },
              { icon: "📀", award: "CMT Music Award", category: "Video of the Year — Mean", year: "2012" },
            ].map((item, i) => (
              <div key={i} className="sn-award-card">
                <span className="sn-award-icon">{item.icon}</span>
                <span className="sn-award-year">{item.year}</span>
                <h3 className="sn-award-title">{item.award}</h3>
                <p className="sn-award-cat">{item.category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO: FUN FACTS */}
      <section className="sn-facts-section">
        <div className="sn-facts-inner">
          <span className="sn-mv-label">CURIOSIDADES</span>
          <h2 className="sn-mv-title">VOCÊ SABIA?</h2>
          <div className="sn-facts-grid">
            {[
              { num: "01", fact: "Speak Now foi escrito 100% por Taylor aos 18–20 anos, sem nenhum co-escritor — uma raridade na indústria musical.", icon: "✍️" },
              { num: "02", fact: "A faixa \"Enchanted\" foi inspirada em Adam Young, vocalista do Owl City, que chegou a gravar uma resposta à música.", icon: "🦉" },
              { num: "03", fact: "\"Dear John\" é amplamente interpretada como sendo sobre John Mayer, com quem Taylor namorou em 2009-2010.", icon: "💌" },
              { num: "04", fact: "Taylor se recusou a co-escrever o álbum para provar que era capaz de escrever sozinha após críticas ao Fearless.", icon: "💪" },
            ].map((item, i) => (
              <div key={i} className="sn-fact-card">
                <span className="sn-fact-num">{item.num}</span>
                <span className="sn-fact-emoji">{item.icon}</span>
                <p className="sn-fact-text">{item.fact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sn-eras-section">
        <div className="sn-eras-inner">
          <span className="sn-mv-label">NAVEGUE</span>
          <h2 className="sn-mv-title">OUTRAS ERAS</h2>
          <div className="sn-eras-grid">
            {[
              { name: "Taylor Swift", year: "2006", path: "/debut", color: "#50c878" },
              { name: "Fearless", year: "2008", path: "/fearless", color: "#d4af37" },
              { name: "Red", year: "2012", path: "/red", color: "#8b0000" },
              { name: "1989", year: "2014", path: "/1989", color: "#87ceeb" },
              { name: "Reputation", year: "2017", path: "/reputation", color: "#1a1a1a" },
              { name: "Lover", year: "2019", path: "/lover", color: "#ff9ec4" },
              { name: "Folklore", year: "2020", path: "/folklore", color: "#8a9a8a" },
              { name: "Evermore", year: "2020", path: "/evermore", color: "#8b4513" },
              { name: "Midnights", year: "2022", path: "/midnights", color: "#1c1c4b" },
              { name: "TTPD", year: "2024", path: "/ttpd", color: "#c8a882" },
              { name: "The Life of a Showgirl", year: "2025", path: "/showgirl", color: "#e46c32" },
            ].map((era, i) => (
              <Link key={i} to={era.path} className="sn-era-card" style={{ '--era-color': era.color }}>
                {/* O ano agora recebe a cor definida no objeto acima */}
                <span className="sn-era-year" style={{ color: era.color }}>{era.year}</span>
                <span className="sn-era-name">{era.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* FOOTER */}
      <footer className="sn-footer">
        <div className="sn-footer-inner">
          <p className="sn-footer-cursive">Speak Now</p>
          <p className="sn-footer-copy">
            © 2026 · Conteúdo para fins educacionais
          </p>
          <div className="sn-footer-links">
            <a href="https://www.taylorswift.com" target="_blank" rel="noopener noreferrer">Site Oficial</a>
            <span>·</span>
            <a href="https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02" target="_blank" rel="noopener noreferrer">Spotify</a>
            <span>·</span>
            <a href="https://music.apple.com/us/artist/taylor-swift/159260351" target="_blank" rel="noopener noreferrer">Apple Music</a>
          </div>
        </div>
      </footer>

      {/* BOTÃO VOLTAR AO TOPO */}
      {showTopBtn && (
        <button className="sn-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Voltar ao topo">
          ↑
        </button>
      )}

    </div>
  );
};

export default SpeakNow;