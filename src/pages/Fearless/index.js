import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Fearless.css';

import fearlessCover from '../../imagens/fearless.webp';
import fearlessTVCover from '../../imagens/fearless-tv.png';
import fearlessTour from '../../imagens/fearless-tour.jpg';
import vmas2009 from '../../imagens/vmas-2009.webp';
import grammys2010 from '../../imagens/grammys-2010.jpg';
import clipLoveStory from '../../imagens/lovestory.jpg';
import clipYBWM from '../../imagens/ybwm.jpg';
import clipWhiteHorse from '../../imagens/whitehorse.jpg';
import clipFifteen from '../../imagens/fifteen.jpg';
import clipFearless from '../../imagens/fearless-mv.jpg';
import clipBestDay from '../../imagens/thebestday.jpg';
import clipChange from '../../imagens/change.jpg';

const Fearless = () => {
  const [isTV, setIsTV] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const scrollContainer = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) setShowTopBtn(true);
      else setShowTopBtn(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scroll = (direction) => {
    if (scrollContainer.current) {
      const scrollAmount = 450;
      scrollContainer.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const toggleVersion = (status) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setIsTV(status);
    }, 600);
  };
  

  const tracks = [
    { no: "01", title: "Fearless", duration: "4:01" },
    { no: "02", title: "Fifteen", duration: "4:54" },
    { no: "03", title: "Love Story", duration: "3:55" },
    { no: "04", title: "Hey Stephen", duration: "4:14" },
    { no: "05", title: "White Horse", duration: "3:54" },
    { no: "06", title: "You Belong With Me", duration: "3:51" },
    { no: "07", title: "Breathe", duration: "4:23" },
    { no: "08", title: "Tell Me Why", duration: "3:20" },
    { no: "09", title: "You're Not Sorry", duration: "4:22" },
    { no: "10", title: "The Way I Loved You", duration: "4:04" },
    { no: "11", title: "Forever & Always", duration: "3:45" },
    { no: "12", title: "The Best Day", duration: "4:05" },
    { no: "13", title: "Change", duration: "4:40" }
  ];

  const vaultTracks = [
    { no: "01", title: "Fearless", duration: "4:01" },
    { no: "02", title: "Fifteen", duration: "4:54" },
    { no: "03", title: "Love Story", duration: "3:55" },
    { no: "04", title: "Hey Stephen", duration: "4:14" },
    { no: "05", title: "White Horse", duration: "3:54" },
    { no: "06", title: "You Belong With Me", duration: "3:51" },
    { no: "07", title: "Breathe", duration: "4:23" },
    { no: "08", title: "Tell Me Why", duration: "3:20" },
    { no: "09", title: "You're Not Sorry", duration: "4:22" },
    { no: "10", title: "The Way I Loved You", duration: "4:04" },
    { no: "11", title: "Forever & Always", duration: "3:45" },
    { no: "12", title: "The Best Day", duration: "4:05" },
    { no: "13", title: "Change", duration: "4:40" },
    { no: "14", title: "Jump Then Fall", duration: "3:57" },
    { no: "15", title: "Untouchable", duration: "5:12" },
    { no: "16", title: "Forever & Always (Piano Version)", duration: "4:27" },
    { no: "17", title: "Come In With The Rain", duration: "3:57" },
    { no: "18", title: "Superstar", duration: "4:23" },
    { no: "19", title: "The Other Side Of The Door", duration: "3:58" },
    { no: "20", title: "Today Was A Fairytale", duration: "4:01" },
    { no: "21", title: "You All Over Me", duration: "3:40" },
    { no: "22", title: "Mr. Perfectly Fine", duration: "4:37" },
    { no: "23", title: "We Were Happy", duration: "4:04" },
    { no: "24", title: "That's When", duration: "3:09" },
    { no: "25", title: "Don't You", duration: "3:28" },
    { no: "26", title: "Bye Bye Baby", duration: "4:02" }
  ];

  const musicVideos = [
    {
      title: "Love Story",
      desc: "A Regency Fairytale",
      thumb: clipLoveStory,
      url: "https://www.youtube.com/watch?v=8xg3vE8Ie_E&list=RD8xg3vE8Ie_E&start_radio=1"
    },
    {
      title: "You Belong With Me",
      desc: "The Girl Next Door",
      thumb: clipYBWM,
      url: "https://www.youtube.com/watch?v=VuNIsY6JdUw&list=RDVuNIsY6JdUw&start_radio=1"
    },
    {
      title: "White Horse",
      desc: "A Lost Reality",
      thumb: clipWhiteHorse,
      url: "https://www.youtube.com/watch?v=D1Xr-JFLxik&list=RDD1Xr-JFLxik&start_radio=1"
    },
    {
      title: "Fifteen",
      desc: "High School Memories",
      thumb: clipFifteen,
      url: "https://www.youtube.com/watch?v=Pb-K2tXWK4w&list=RDPb-K2tXWK4w&start_radio=1"
    },
    {
      title: "Fearless",
      desc: "Tour Life",
      thumb: clipFearless,
      url: "https://www.youtube.com/watch?v=ptSjNWnzpjg&list=RDptSjNWnzpjg&start_radio=1"
    },
    {
      title: "The Best Day",
      desc: "Home Movies",
      thumb: clipBestDay,
      url: "https://www.youtube.com/watch?v=l4_6eQm7RTQ&list=RDl4_6eQm7RTQ&start_radio=1"
    },
    {
      title: "Change",
      desc: "Olympic Spirit",
      thumb: clipChange,
      url: "https://www.youtube.com/watch?v=B1jYllE0T-k&list=RDB1jYllE0T-k&start_radio=1"
    }
  ];

  return (
    <div className={`f-stage-root ${isTV ? 'f-tv-active' : ''} ${loaded ? 'f-loaded' : ''}`}>
      <div className="f-spotlight-top"></div>
      <div className="f-glitter-dust"></div>

      <nav className="f-nav-glass">
        <Link to="/debut" className="f-nav-link">← CAPÍTULO 01</Link>
        <div className="f-nav-center">{isTV ? "FEARLESS (TAYLOR'S VERSION)" : "THE FEARLESS CHAPTER"}</div>
        <Link to="/speak-now" className="f-nav-link">CAPÍTULO 03 →</Link>
      </nav>

      <header className="f-hero-gold">
        <div className="f-texture-overlay"></div>
        
        {/* Dynamic Golden Sparkle Bursts */}
        <svg className="f-sparkle-burst f-sparkle-burst--left" viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg">
           {/* Radiating arcs */}
           <path d="M 350 600 Q 200 500, 100 300 Q 50 150, 200 0" stroke="url(#fSparkleGrad)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
           <path d="M 400 550 Q 300 400, 150 250 Q 50 120, 100 0" stroke="url(#fSparkleGrad)" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.3" />
           {/* Scattered star dots */}
           <circle cx="100" cy="300" r="3" fill="#ffdf00" className="f-sparkle-dot" />
           <circle cx="200" cy="150" r="2" fill="#fff" className="f-sparkle-dot" />
           <circle cx="150" cy="450" r="4" fill="#d4af37" className="f-sparkle-dot" />
           <circle cx="300" cy="200" r="2.5" fill="#ffdf00" className="f-sparkle-dot" />
           <circle cx="250" cy="500" r="3" fill="#fff" className="f-sparkle-dot" />
           <circle cx="80" cy="100" r="2" fill="#d4af37" className="f-sparkle-dot" />
           <circle cx="320" cy="350" r="3.5" fill="#ffdf00" className="f-sparkle-dot" />
           <defs>
               <linearGradient id="fSparkleGrad" x1="0.5" y1="1" x2="0.5" y2="0">
                   <stop offset="0%" stopColor="#d4af37" stopOpacity="0"/>
                   <stop offset="50%" stopColor="#ffdf00" />
                   <stop offset="100%" stopColor="#d4af37" stopOpacity="0"/>
               </linearGradient>
           </defs>
        </svg>

        <svg className="f-sparkle-burst f-sparkle-burst--right" viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path d="M 50 600 Q 200 450, 300 250 Q 350 100, 200 0" stroke="url(#fSparkleGrad2)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
           <path d="M 0 500 Q 100 350, 250 200 Q 350 80, 300 0" stroke="url(#fSparkleGrad2)" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.25" />
           <circle cx="300" cy="250" r="3" fill="#ffdf00" className="f-sparkle-dot" />
           <circle cx="200" cy="400" r="2" fill="#fff" className="f-sparkle-dot" />
           <circle cx="250" cy="100" r="4" fill="#d4af37" className="f-sparkle-dot" />
           <circle cx="100" cy="300" r="2.5" fill="#ffdf00" className="f-sparkle-dot" />
           <circle cx="150" cy="500" r="3" fill="#fff" className="f-sparkle-dot" />
           <circle cx="350" cy="150" r="2" fill="#d4af37" className="f-sparkle-dot" />
           <defs>
               <linearGradient id="fSparkleGrad2" x1="0.5" y1="1" x2="0.5" y2="0">
                   <stop offset="0%" stopColor="#ffdf00" stopOpacity="0"/>
                   <stop offset="50%" stopColor="#d4af37" />
                   <stop offset="100%" stopColor="#ffdf00" stopOpacity="0"/>
               </linearGradient>
           </defs>
        </svg>

        <div className="f-hero-main">
          <div className="f-album-spotlight">
            <div className="f-neon-frame">
              <img
                src={isTV ? fearlessTVCover : fearlessCover}
                alt="Fearless Album Cover"
                className="f-album-image"
              />
              <div className="f-album-glow-effect"></div>

              <div className="f-glow-line"></div>
            </div>
            <div className="f-floor-reflection"></div>
          </div>

          <div className="f-hero-text-block">
            <span className="f-pre-title">TAYLOR SWIFT</span>
            <h1 className="f-main-display">
               <span className="f-title-shimmer" data-text="Fearless">Fearless</span>
            </h1>
            {isTV && <h2 className="f-tv-subtitle">(TAYLOR'S VERSION)</h2>}

            <div className="f-info-pill-container">
              <div className="f-pill">{isTV ? "2021" : "2008"}</div>
              <div className="f-pill">COUNTRY POP</div>
              <div className="f-pill">{isTV ? "1:46:22" : "53:41"}</div>
            </div>

            <div className="f-description-box">
              <p>
                {isTV
                  ? "A primeira regravação. Taylor retoma sua narrativa com 26 faixas, incluindo tesouros diretamente do cofre."
                  : "O álbum country mais premiado da história, onde contos de fadas encontram a realidade dos degraus da escola."}
              </p>
              {isTV ? (
                <button className="f-back-original" onClick={() => toggleVersion(false)}>
                  ← BACK TO ORIGINAL ALBUM
                </button>
              ) : (
                <div className="f-award-badge">ALBUM OF THE YEAR</div>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="f-tracklist-section">
        <div className="f-section-divider">
          <div className="f-line-gold"></div>
          <h2 className="f-track-header">{isTV ? "THE VAULT & MORE" : "THE TRACKLIST"}</h2>
          <div className="f-line-gold"></div>
        </div>

        <div className="f-tracks-container">
          {(isTV ? vaultTracks : tracks).map((track) => (
            <div key={track.no} className="f-track-item">
              <span className="f-track-number">{track.no}</span>
              <div className="f-track-info">
                <h3 className="f-track-name">
                  {track.title} {isTV && "(Taylor's Version)"}
                </h3>
                <div className="f-track-glow"></div>
              </div>
              <span className="f-track-length">{track.duration}</span>
            </div>
          ))}
        </div>

        {!isTV && (
          <div className="f-vault-teaser">
            <button className="f-vault-button" onClick={() => toggleVersion(true)}>
              <span className="f-lock-icon">🔒</span>
              UNLOCK THE VAULT (TAYLOR'S VERSION)
            </button>
          </div>
        )}
      </section>

      {isTV ? (
        <>
          <section className="f-re-record-info">
            <div className="f-info-content">
              <h2 className="f-section-title-gold">Por que regravar?</h2>
              <p>
                Após a venda de seus masters originais sem seu consentimento em 2019, Taylor embarcou em uma jornada
                histórica para recuperar a propriedade de sua arte. Fearless (TV) marcou o início dessa revolução,
                provando que um artista deve possuir o que cria e que sua voz não pode ser silenciada por contratos antigos.
              </p>
            </div>
          </section>

          <section className="f-announcement-section">
            <div className="f-announcement-card">
              <h2 className="f-section-title-gold">A Carta do Cofre</h2>
              <div className="f-letter-body">
                <p>"Fearless era um álbum cheio de magia e curiosidade, a ansiedade e o caos da juventude."</p>
                <p>"Foi um diário das aventuras e explorações de uma adolescente que estava aprendendo lições minúsculas pelas rachaduras de um final de conto de fadas que ela tinha visto nos filmes."</p>
                <p>"Decidi que quero que vocês tenham toda a história, que vejam a imagem vívida completa e que entrem em todo o mundo luminoso que é o meu álbum Fearless."</p>
                <p className="f-letter-signature">Com amor, Taylor.</p>
              </div>
              <div className="f-announcement-date">RELEASED: APRIL 9, 2021</div>
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="f-lyric-wall">
            <div className="f-rain-container">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="f-confetti-gold" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s`, animationDuration: `${3 + Math.random() * 2}s` }}></div>
              ))}
            </div>
            <div className="f-lyrics-float">
              <p className="f-lyric-line">"In a storm in my best dress..."</p>
              <h2 className="f-lyric-main">FEARLESS</h2>
              <p className="f-lyric-line">"...and I don't know why but with you I'd dance."</p>
            </div>
          </section>

          <section className="f-videos-section">
            <h2 className="f-section-title-gold">The Cinematic Era</h2>
            <div className="f-carousel-wrapper">
              <button className="f-nav-btn prev" onClick={() => scroll('left')}>‹</button>
              <button className="f-nav-btn next" onClick={() => scroll('right')}>›</button>
              <div className="f-video-grid" ref={scrollContainer}>
                {musicVideos.map((video, index) => (
                  <a
                    key={index}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="f-video-card"
                  >
                    <div className="f-video-thumb">
                      <img src={video.thumb} alt={video.title} />
                      <div className="f-play-overlay">▶</div>
                    </div>
                    <h3>{video.title}</h3>
                    <p>{video.desc}</p>
                  </a>
                ))}
              </div>
            </div>
          </section>

          <section className="f-legacy-section">
            <div className="f-legacy-grid">
              <div className="f-awards-column">
                <h2 className="f-legacy-title">Conquistas</h2>
                <div className="f-award-item">
                  <div className="f-award-photo-frame">
                    <img src={grammys2010} alt="Taylor Grammy 2010" className="f-award-img" />
                  </div>
                  <div className="f-award-card">
                    <span className="f-award-year">2010</span>
                    <h3>GRAMMYs: Album of the Year</h3>
                  </div>
                </div>
                <div className="f-award-item">
                  <div className="f-award-photo-frame">
                    <img src={vmas2009} alt="Taylor VMA 2009" className="f-award-img" />
                  </div>
                  <div className="f-award-card">
                    <span className="f-award-year">2009</span>
                    <h3>VMAs: Best Female Video</h3>
                  </div>
                </div>
              </div>

              <div className="f-tour-column">
                <h2 className="f-legacy-title">A turnê mundial</h2>
                <div className="f-tour-photo-main">
                  <img src={fearlessTour} alt="Fearless Tour Stage" className="f-tour-img" />
                </div>
                <div className="f-tour-stats">
                  <div className="f-tour-stat-item">
                    <span className="f-stat-number">105</span>
                    <span className="f-stat-label">SHOWS</span>
                  </div>
                </div>
                <p className="f-tour-desc">A primeira grande turnê mundial, onde o "Heart Hand" se tornou marca registrada.</p>
              </div>
            </div>

            <div className="f-gallery-portal">
              <Link to="/fearless-gallery" className="f-portal-button">
                <span className="f-portal-text">VISIT THE PHOTO ARCHIVE</span>
                <div className="f-portal-glow"></div>
              </Link>
            </div>
          </section>
        </>
      )}

{/* NOVA SEÇÃO: EXPLORAR OUTRAS ERAS (PADRONIZADA) */}
<section className="fe-eras-section">
        <div className="fe-eras-inner">
          <span className="fe-nav-label">NAVEGUE</span>
          <h2 className="fe-nav-title">OUTRAS ERAS</h2>
          <div className="fe-eras-grid">
            {[
              { name: "Debut", year: "2006", path: "/debut", color: "#50c878" },
              { name: "Speak Now", year: "2010", path: "/speak-now", color: "#db7ca5" },
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
              <Link key={i} to={era.path} className="fe-era-card" style={{ '--era-color': era.color }}>
                <span className="fe-era-year">{era.year}</span>
                <span className="fe-era-name">{era.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NOVO FOOTER ELEGANTE */}
      <footer className="fe-footer">
        <div className="fe-footer-inner">
          <p className="fe-footer-cursive">Fearless</p> 
          <p className="fe-footer-copy">© 2026 · Conteúdo para fins educacionais</p>
          <div className="fe-footer-links">
            <a href="https://www.taylorswift.com" target="_blank" rel="noopener noreferrer">Site Oficial</a>
            <span>·</span>
            <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer">Spotify</a>
          </div>
        </div>
      </footer>

      {/* BOTÃO VOLTAR AO TOPO */}
      {showTopBtn && (
        <button 
          className="fe-top-btn" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          aria-label="Voltar ao topo"
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default Fearless;