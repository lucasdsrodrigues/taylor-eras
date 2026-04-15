import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import './Red.css';

import redOG from '../../imagens/red-cover.webp';
import redTV from '../../imagens/red-tv-cover.webp';
import red1 from '../../imagens/red1.jpg';
import red2 from '../../imagens/red2.webp';
import redSF from '../../imagens/red-sf.png';


const redTracks = [
  { id: 1, title: "State of Grace", duration: "4:55", isTV: true, isOG: true, vault: false },
  { id: 2, title: "Red", duration: "3:43", isTV: true, isOG: true, vault: false, single: true },
  { id: 3, title: "Treacherous", duration: "4:02", isTV: true, isOG: true, vault: false },
  { id: 4, title: "I Knew You Were Trouble", duration: "3:39", isTV: true, isOG: true, vault: false, single: true },
  { id: 5, title: "All Too Well", duration: "5:29", isTV: true, isOG: true, vault: false, single: true },
  { id: 6, title: "22", duration: "3:52", isTV: true, isOG: true, vault: false, single: true },
  { id: 7, title: "I Almost Do", duration: "4:04", isTV: true, isOG: true, vault: false },
  { id: 8, title: "We Are Never Ever Getting Back Together", duration: "3:13", isTV: true, isOG: true, vault: false, single: true },
  { id: 9, title: "Stay Stay Stay", duration: "3:25", isTV: true, isOG: true, vault: false },
  { id: 10, title: "The Last Time", feat: "Gary Lightbody", duration: "4:59", isTV: true, isOG: true, vault: false, single: true },
  { id: 11, title: "Holy Ground", duration: "3:22", isTV: true, isOG: true, vault: false },
  { id: 12, title: "Sad Beautiful Tragic", duration: "4:44", isTV: true, isOG: true, vault: false },
  { id: 13, title: "The Lucky One", duration: "4:00", isTV: true, isOG: true, vault: false },
  { id: 14, title: "Everything Has Changed", feat: "Ed Sheeran", duration: "4:05", isTV: true, isOG: true, vault: false, single: true },
  { id: 15, title: "Starlight", duration: "3:40", isTV: true, isOG: true, vault: false },
  { id: 16, title: "Begin Again", duration: "3:57", isTV: true, isOG: true, vault: false, single: true },
  { id: 17, title: "The Moment I Knew", duration: "4:46", isTV: true, isOG: true, vault: false },
  { id: 18, title: "Come Back... Be Here", duration: "3:43", isTV: true, isOG: true, vault: false },
  { id: 19, title: "Girl At Home", duration: "3:40", isTV: true, isOG: true, vault: false },
  { id: 20, title: "State of Grace (Acoustic)", duration: "5:21", isTV: true, isOG: true, vault: false },
  { id: 21, title: "Ronan", duration: "4:24", isTV: true, isOG: false, vault: true },
  { id: 22, title: "Better Man", duration: "4:57", isTV: true, isOG: false, vault: true },
  { id: 23, title: "Nothing New", feat: "Phoebe Bridgers", duration: "4:18", isTV: true, isOG: false, vault: true },
  { id: 24, title: "Babe", duration: "3:44", isTV: true, isOG: false, vault: true },
  { id: 25, title: "Message In A Bottle", duration: "3:45", isTV: true, isOG: false, vault: true, single: true },
  { id: 26, title: "I Bet You Think About Me", feat: "Chris Stapleton", duration: "4:45", isTV: true, isOG: false, vault: true, single: true },
  { id: 27, title: "Forever Winter", duration: "4:23", isTV: true, isOG: false, vault: true },
  { id: 28, title: "Run", feat: "Ed Sheeran", duration: "4:00", isTV: true, isOG: false, vault: true },
  { id: 29, title: "The Very First Night", duration: "3:20", isTV: true, isOG: false, vault: true },
  { id: 30, title: "All Too Well (10 Minute Version)", duration: "10:13", isTV: true, isOG: false, vault: true, single: true },
];

const redMusicVideos = [
  {
    title: "We Are Never Ever Getting Back Together",
    desc: "O início de uma revolução pop",
    thumb: "https://i.ytimg.com/vi/WA4iX5D9Z64/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=WA4iX5D9Z64"
  },
  {
    title: "Begin Again",
    desc: "Um recomeço em Paris",
    thumb: "https://i.ytimg.com/vi/cMPEd8m79Hw/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=cMPEd8m79Hw"
  },
  {
    title: "22",
    desc: "A celebração da juventude",
    thumb: "https://i.ytimg.com/vi/AgFeZr5ptV8/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=AgFeZr5ptV8"
  },
  {
    title: "I Knew You Were Trouble",
    desc: "O arrependimento em forma de clipe",
    thumb: "https://i.ytimg.com/vi/vNoKguSdy4Y/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=vNoKguSdy4Y"
  },
  {
    title: "Everything Has Changed",
    desc: "feat. Ed Sheeran — Uma amizade atemporal",
    thumb: "https://i.ytimg.com/vi/w1oM3kQpXRo/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=w1oM3kQpXRo"
  },
  {
    title: "Red",
    desc: "O vermelho que define tudo",
    thumb: "https://i.ytimg.com/vi/Zlot0i3Zykw/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=Zlot0i3Zykw"
  },
  {
    title: "The Last Time",
    desc: "feat. Gary Lightbody — O último adeus",
    thumb: "https://i.ytimg.com/vi/QuijXg8wm28/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=QuijXg8wm28"
  },
  {
    title: "I Bet You Think About Me",
    desc: "(Taylor's Version) feat. Chris Stapleton",
    thumb: "https://i.ytimg.com/vi/5UMCrq-bBCg/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=5UMCrq-bBCg"
  },
  {
    title: "All Too Well: The Short Film",
    desc: "10 minutos de cinema puro",
    thumb: "https://i.ytimg.com/vi/tollGa3S0o8/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=tollGa3S0o8"
  },
];

const Red = () => {
  const [isTV, setIsTV] = useState(false);
  const audioRef = useRef(null);
  const [playingTrack, setPlayingTrack] = useState(null);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const tracklistRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const mvScrollRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollMV = (direction) => {
    if (mvScrollRef.current) {
      const scrollAmount = mvScrollRef.current.clientWidth;
      mvScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Autumn leaves effect
  useEffect(() => {
    let active = true;
    const launchLeaves = () => {
      if (!active) return;
      
      const amount = 12;
      const colors = ['#8b0000', '#ff4d4d', '#c0392b', '#d35400', '#e67e22', '#6b0000'];
      
      for (let i = 0; i < amount; i++) {
        setTimeout(() => {
          if (!active) return;
          const leaf = document.createElement('div');
          leaf.className = 'red-falling-leaf';
          leaf.style.left = (Math.random() * 100) + 'vw';
          leaf.style.top = '-10vh';
          leaf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          
          // Randomize leaf size and shape slightly
          const size = Math.random() * 15 + 10;
          leaf.style.width = size + 'px';
          leaf.style.height = size + 'px';
          // Make it look like a leaf using border-radius
          leaf.style.borderRadius = `${Math.random() * 50 + 50}% ${Math.random() * 50}% ${Math.random() * 50 + 50}% ${Math.random() * 50}%`;
          
          document.body.appendChild(leaf);
          
          const animation = leaf.animate([
            { transform: `translate3d(0, 0, 0) rotate(0deg) scale(0.5)`, opacity: 0 },
            { opacity: 0.8, offset: 0.1 },
            { opacity: 0.8, offset: 0.9 },
            { transform: `translate3d(${Math.random() * 300 - 150}px, 110vh, 0) rotate(${Math.random() * 720 - 360}deg) scale(${Math.random() * 0.5 + 0.8})`, opacity: 0 }
          ], { duration: Math.random() * 8000 + 8000, easing: 'linear' });
          
          animation.onfinish = () => { if (document.body.contains(leaf)) leaf.remove(); };
        }, i * 400); // Stagger the falling
      }
    };
    
    launchLeaves();
    const interval = setInterval(launchLeaves, 6000);
    
    return () => {
      active = false;
      clearInterval(interval);
      // Clean up any remaining leaves
      document.querySelectorAll('.red-falling-leaf').forEach(leaf => leaf.remove());
    };
  }, []);

  return (
    <div className={`red-page-container ${loaded ? 'red-loaded' : ''}`}>
      <div className="red-grain-texture"></div>

      <nav className="red-navigation">
        <Link to="/speak-now" className="red-nav-item">PREV CHAPTER</Link>
        <div className="red-nav-center">
          RED ERA
        </div>
        <Link to="/1989" className="red-nav-item">NEXT CHAPTER</Link>
      </nav>

      <div className="red-texture-overlay"></div>

      {/* Dynamic Wind Swirls SVGs */}
      <svg className="red-wind-swirl red-wind-swirl--left" viewBox="0 0 400 800" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path 
            d="M 400 0 C 200 100, 350 300, 100 400 C -50 500, 300 600, 150 800" 
            stroke="url(#redWindL)" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.5"
         />
         <path 
            d="M 350 -50 C 100 150, 300 350, 50 500 C -100 650, 250 700, 200 850" 
            stroke="url(#redWindL)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3"
         />
         <defs>
             <linearGradient id="redWindL" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="0%" stopColor="#ff4d4d" stopOpacity="0"/>
                 <stop offset="40%" stopColor="#8b0000" />
                 <stop offset="100%" stopColor="#ff4d4d" stopOpacity="0"/>
             </linearGradient>
         </defs>
      </svg>

      <svg className="red-wind-swirl red-wind-swirl--right" viewBox="0 0 400 800" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path 
            d="M 0 0 C 200 150, 50 300, 300 450 C 450 600, 100 700, 250 800" 
            stroke="url(#redWindR)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.4"
         />
         <path 
            d="M 50 -50 C 300 100, 100 300, 350 500 C 500 650, 150 750, 200 850" 
            stroke="url(#redWindR)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.25"
         />
         <defs>
             <linearGradient id="redWindR" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="0%" stopColor="#8b0000" stopOpacity="0"/>
                 <stop offset="50%" stopColor="#ff4d4d" />
                 <stop offset="100%" stopColor="#8b0000" stopOpacity="0"/>
             </linearGradient>
         </defs>
      </svg>

      <header className="red-hero-main">
        <div className="red-hero-visual">
          <div className="red-glow-aura"></div>
          <div className="red-double-frame"></div>

          <div className="red-vinyl-record">
            <div className="red-vinyl-center"></div>
          </div>

          <div className="red-cover-wrapper">
            <img
              src={isTV ? redTV : redOG}
              alt="Red Album Cover"
              className="red-image-element"
            />
            <div className="red-cover-glow"></div>
          </div>
        </div>

        <div className="red-hero-info">
          <div className="red-text-content">
            <h1 className="red-main-title">
              <span className="red-title-slam" data-text="RED">RED</span>
            </h1>
            <p className="red-subtitle-tag">{isTV ? "TAYLOR'S VERSION" : "TAYLOR SWIFT"}</p>

            <div className="red-version-switch">
              <button
                className={!isTV ? "active" : ""}
                onClick={() => setIsTV(false)}
              >
                ORIGINAL
              </button>
              <button
                className={isTV ? "active" : ""}
                onClick={() => setIsTV(true)}
              >
                TAYLOR'S VERSION
              </button>
            </div>

            <p className="red-lyrics-quote">
              {isTV
                ? "“And you were tossing me the car keys, 'fuck the patriarchy' keychain on the ground. And I was thinking on the drive down, any time now, he's gonna say it's love.”"
                : "“Losing him was blue like I’d never known. Missing him was dark grey, all alone. But loving him was red.”"
              }
            </p>

            <div className="red-quick-stats">
              <div className="red-stat-item">
                <span>LANÇAMENTO</span>
                <p>{isTV ? "NOV 12, 2021" : "OCT 22, 2012"}</p>
              </div>
              <div className="red-stat-item">
                <span>GÊNERO</span>
                <p>COUNTRY • POP • ROCK</p>
              </div>
              <div className="red-stat-item">
                <span>DURAÇÃO</span>
                <p>{isTV ? "130:26" : "65:09"}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="red-tracklist-section">
        <div className="red-tracklist-container">
          <h2 className="red-tracklist-label">
            {isTV ? "30 TRACKS • TAYLOR'S VERSION" : "20 TRACKS • ORIGINAL VERSION + DELUXE"}
          </h2>

          <div className="red-tracks-grid">
            {redTracks
              .filter(track => (isTV ? track.isTV : track.isOG))
              .map((track, index) => (
                <div
                  key={track.id}
                  className={`red-track-row ${track.vault ? 'is-vault' : ''} ${track.single ? 'is-single' : ''}`}
                >
                  <span className="track-id">{(index + 1).toString().padStart(2, '0')}</span>

                  <div className="track-main-info">
                    <div className="track-title-line">
                      <span className="track-name-text">{track.title}</span>
                      {track.feat && <span className="track-feat-name">feat. {track.feat}</span>}
                      {track.vault && <span className="track-vault-badge">FROM THE VAULT</span>}
                    </div>
                  </div>

                  <span className="track-time">{track.duration}</span>
                </div>
              ))}
          </div>
        </div>
      </section>

      <section className="red-gallery-lyrics">
        <div className="red-vignette-overlay"></div>

        <div className="gallery-container">
          {/* Bloco 1: Foto + Letra Sobreposta */}
          <div className="gallery-item item-large">
            <div className="gallery-photo-wrapper">
              {/* Usando a imagem redTV que você já importou lá no topo */}
              <div
                className="gallery-img-div"
                style={{ backgroundImage: `url(${red2})` }}
              ></div>
              <div className="photo-overlay-text">
                <p>"And I can picture it after all these days."</p>
              </div>
            </div>
          </div>

          {/* Bloco 2: Só Letra com Tipografia Forte */}
          <div className="gallery-item item-text-only">
            <span className="gallery-tag">01. ALL TOO WELL</span>
            <h2 className="gallery-big-lyric">
              AUTUMN LEAVES FALLING DOWN LIKE <span className="outline-text">PIECES</span> INTO PLACE.
            </h2>
          </div>

          {/* Bloco 3: Foto Menor (Vibe Curta Metragem) */}
          <div className="gallery-item item-small">
            <div className="gallery-photo-wrapper">
              <div
                className="gallery-img-div"
                style={{ backgroundImage: `url(${red1})` }}
              ></div>
            </div>
            <p className="item-caption">"The scarf at your sister's house."</p>
          </div>

          {/* Bloco 4: Outra Letra Marcante */}
          <div className="gallery-item item-quote">
            <div className="quote-line"></div>
            <p className="quote-text">"Love is a ruthless game unless you play it good and right."</p>
            <span className="quote-song">— State of Grace</span>
          </div>
        </div>
      </section>

      <section className="atw-cinematic-section">
        <div className="atw-container">

          <div className="atw-header">
            <span className="atw-tag">A SHORT FILM BY TAYLOR SWIFT</span>
            <h2 className="atw-title">All Too Well</h2>
          </div>

          <div className="atw-cinematic-layout">
            {/* LADO ESQUERDO */}
            <div className="atw-side-info left">
              <div className="info-block">
                <h3>O Roteiro</h3>
                <p>Escrito e dirigido pela própria Taylor, o filme transforma a letra de 10 minutos em uma narrativa visual sobre o colapso de um relacionamento.</p>
              </div>
              <div className="info-block">
                <h3>A Redenção</h3>
                <p>Após a versão original do álbum perder tudo no Grammy de 2014, o curta finalmente venceu como <strong>Best Music Video</strong> em 2023.</p>
              </div>
            </div>

            {/* CENTRO: PLAYER COM THUMBNAIL (SOLUÇÃO PARA O ERRO) */}
            <div className="atw-main-visual">
              <a
                href="https://www.youtube.com/watch?v=tollGa3S0o8&list=RDtollGa3S0o8&start_radio=1"
                target="_blank"
                rel="noopener noreferrer"
                className="atw-player-wrapper thumbnail-mode"
              >
                <div className="atw-video-thumbnail">
                  <div className="play-button-overlay">
                    <div className="play-icon"></div>
                  </div>
                  <img
                    src={redSF}
                    alt="All Too Well Short Film Thumbnail"
                  />
                </div>
                <span className="play-hint">ASSISTIR NO YOUTUBE</span>
              </a>
            </div>

            {/* LADO DIREITO */}
            <div className="atw-side-info right">
              <div className="info-block">
                <h3>O Elenco</h3>
                <p>Sadie Sink e Dylan O'Brien foram as únicas escolhas. Se eles não aceitassem, o projeto nem teria sido realizado.</p>
              </div>
              <div className="info-block">
                <h3>Simbologia</h3>
                <p>O carro Mercedes de 1989 e a película 35mm evocam a nostalgia de uma memória que não se apaga.</p>
              </div>
            </div>
          </div>

          {/* PARTE INFERIOR: CURIOSIDADES */}
          <div className="atw-trivia-grid">
            <div className="trivia-item">
              <span className="trivia-number">01</span>
              <p>Filmado em 35mm para capturar a textura nostálgica e quente do outono de upstate New York.</p>
            </div>
            <div className="trivia-item">
              <span className="trivia-number">02</span>
              <p>A cena da briga na cozinha foi quase totalmente improvisada pelos atores para manter o realismo da tensão.</p>
            </div>
            <div className="trivia-item">
              <span className="trivia-number">03</span>
              <p>O livro "All Too Well" no final é uma referência à transição de Taylor para diretora e autora da sua própria história.</p>
            </div>
          </div>

        </div>
      </section>

      <section className="red-mv-section">
        <div className="red-mv-container">
          <span className="red-mv-tag">MUSIC VIDEOS</span>
          <h2 className="red-mv-title">Os Clipes da Era Red</h2>

          <div className="red-mv-carousel-wrapper">
            <button className="red-mv-nav-btn prev" onClick={() => scrollMV('left')}>‹</button>
            <button className="red-mv-nav-btn next" onClick={() => scrollMV('right')}>›</button>

            <div className="red-mv-grid" ref={mvScrollRef}>
              {redMusicVideos.map((video, index) => (
                <a
                  key={index}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="red-mv-card"
                >
                  <div className="red-mv-thumb">
                    <img src={video.thumb} alt={video.title} />
                    <div className="red-mv-play-overlay">
                      <div className="red-mv-play-icon"></div>
                    </div>
                  </div>
                  <h3>{video.title}</h3>
                  <p>{video.desc}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SEÇÃO: THE RED TOUR ===== */}
      <section className="red-tour-section">
        <div className="red-tour-container">

          <span className="red-tour-tag">THE RED TOUR</span>
          <h2 className="red-tour-title">A Turnê Que Fez História</h2>
          <p className="red-tour-subtitle">
            Março de 2013 — Junho de 2014 &bull; A maior turnê country de todos os tempos
          </p>

          {/* STATS BAR */}
          <div className="red-tour-stats">
            <div className="tour-stat">
              <span className="stat-number">86</span>
              <span className="stat-label">Shows</span>
            </div>
            <div className="tour-stat">
              <span className="stat-number">12</span>
              <span className="stat-label">Países</span>
            </div>
            <div className="tour-stat">
              <span className="stat-number">$150.2M</span>
              <span className="stat-label">Faturamento</span>
            </div>
            <div className="tour-stat">
              <span className="stat-number">1.7M</span>
              <span className="stat-label">Fãs</span>
            </div>
          </div>

          {/* INFO GRID */}
          <div className="red-tour-info-grid">

            <div className="tour-info-card">
              <span className="info-card-icon">🎤</span>
              <h3>Sobre a Turnê</h3>
              <p>
                A terceira turnê de Taylor Swift, em suporte ao álbum <em>Red</em> (2012), começou em 13 de março de 2013 em Omaha, Nebraska,
                e terminou em 12 de junho de 2014 em Singapura. Passou por América do Norte, Oceania, Europa e Ásia, tornando-se a
                turnê country com maior bilheteria de todos os tempos, superando a Soul2Soul II Tour de Tim McGraw e Faith Hill.
              </p>
            </div>

            <div className="tour-info-card">
              <span className="info-card-icon">🎶</span>
              <h3>Setlist Icônica</h3>
              <p>
                O setlist trazia 68.5% de músicas do álbum Red, incluindo State of Grace, Holy Ground, Red, 22, I Knew You Were Trouble,
                All Too Well e We Are Never Getting Back Together como encore. Uma música surpresa acústica era tocada em cada show,
                baseada em pedidos dos fãs.
              </p>
            </div>

            <div className="tour-info-card">
              <span className="info-card-icon">🌟</span>
              <h3>Abertura e Convidados</h3>
              <p>
                <strong>Ed Sheeran</strong> foi a abertura de todos os shows na América do Norte. Outros artistas incluíram
                Austin Mahone, Florida Georgia Line, Brett Eldredge, Casey James, Neon Trees, The Vamps e Andreas Bourani.
                Diversos convidados especiais fizeram duetos durante a turnê.
              </p>
            </div>

            <div className="tour-info-card">
              <span className="info-card-icon">🏆</span>
              <h3>Recordes</h3>
              <p>
                Taylor foi a <strong>primeira mulher a lotear estádios na Austrália desde Madonna em 1993</strong>, e a primeira
                a esgotar o Allianz Stadium em Sydney desde sua inauguração em 1988. A turnê venceu o prêmio "Top Package" no
                Billboard Touring Awards de 2013.
              </p>
            </div>

            <div className="tour-info-card">
              <span className="info-card-icon">🎪</span>
              <h3>Palco e Produção</h3>
              <p>
                O palco tinha formato de U com dois fossos e uma passarela, além de um guindaste usado em músicas como
                <em> Treacherous</em> e <em> We Are Never Getting Back Together</em>. A designer Marina Toybina criou
                <strong> 128 figurinos</strong> — 23 para Taylor e 103 para os dançarinos. A produção incluía elementos
                circenses e pirotecnia avançada.
              </p>
            </div>

            <div className="tour-info-card">
              <span className="info-card-icon">❤️</span>
              <h3>Club Red</h3>
              <p>
                O espaço dedicado de meet & greet para fãs sortudos foi batizado de "Club Red". Taylor pessoalmente
                selecionava fãs para o encontro após cada show. Curiosamente, a Red Tour é a única turnê de Taylor Swift
                que <strong>não teve um filme/registro oficial de concerto lançado</strong>.
              </p>
            </div>

          </div>

          {/* VÍDEOS DA TURNÊ */}
          <div className="red-tour-videos">
            <h3 className="tour-videos-title">Momentos Inesquecíveis</h3>
            <div className="tour-videos-grid">
              <div className="tour-video-card">
                <div className="tour-video-wrapper">
                  <iframe
                    src="https://www.youtube.com/embed/UcFIw85wGiI"
                    title="The Red Tour - Concert Highlights"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <p className="tour-video-caption">Highlights da Red Tour</p>
              </div>
              <div className="tour-video-card">
                <div className="tour-video-wrapper">
                  <iframe
                    src="https://www.youtube.com/embed/ksJnIs6FbKQ"
                    title="22 - Live from The Red Tour"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <p className="tour-video-caption">22 — Live at The Red Tour</p>
              </div>
              <div className="tour-video-card">
                <div className="tour-video-wrapper">
                  <iframe
                    src="https://www.youtube.com/embed/4UhNsKHxKP8"
                    title="I Knew You Were Trouble - Live from The Red Tour"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <p className="tour-video-caption">I Knew You Were Trouble — Live</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ===== SEÇÃO: GALERIA ===== */}
      <section className="red-gallery-section">
        <div className="red-gallery-container">
          <span className="red-tour-tag">GALERIA</span>
          <h2 className="red-tour-title">Momentos da Era Red</h2>
          <p className="red-tour-subtitle">Uma coleção de momentos icônicos que definiram a era</p>

          <div className="red-gallery-masonry">
            {[
              { src: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Taylor_Swift_-_Red_Tour_13.jpg", caption: "Red Tour — Performance", span: "tall" },
              { src: "https://upload.wikimedia.org/wikipedia/commons/4/41/Taylor_Swift_-_Red_Tour_08.jpg", caption: "Red Tour — Guitar & Hat", span: "" },
              { src: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Taylor_Swift_GMA_2012.jpg", caption: "Good Morning America, 2012", span: "" },
              { src: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Taylor_Swift_-_Red_Tour_in_LA_-_B-stage_with_guitar_%28original_size%29_%28cropped%29.jpg", caption: "Red Tour — B-Stage Acoustic", span: "wide" },
              { src: "https://upload.wikimedia.org/wikipedia/commons/3/37/Taylor_Swift_-_Red_Tour_19.jpg", caption: "Red Tour — Opening Look", span: "tall" },
              { src: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Taylor_Swift_at_the_2012_MTV_Video_Music_Awards.jpg", caption: "MTV VMAs 2012", span: "" },
              { src: "https://upload.wikimedia.org/wikipedia/commons/9/95/Taylor_Swift_perfoming_at_MTV_EMA_2012.png", caption: "MTV EMA Performance, 2012", span: "" },
              { src: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Taylor_Swift_Concert_Red_Tour.jpg", caption: "Red Tour — Stadium Overview", span: "wide" },
              { src: "https://upload.wikimedia.org/wikipedia/commons/9/91/Taylor_Swift_RED_Tour_2014%2C_Singapore.jpg", caption: "Red Tour — Singapore, 2014", span: "" },
              { src: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Taylor_Swift_-_Red_Tour_-_Sparks_Fly_-_Live_in_Los_Angeles.jpg", caption: "Sparks Fly — Live in LA", span: "" },
            ].map((photo, i) => (
              <div key={i} className={`red-gallery-item ${photo.span}`}>
                <img src={photo.src} alt={photo.caption} loading="lazy" />
                <div className="red-gallery-overlay">
                  <span className="red-gallery-caption">{photo.caption}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SEÇÃO: OUTRAS ERAS ===== */}
      <section className="red-eras-section">
        <div className="red-eras-inner">
          <span className="red-tour-tag">NAVEGUE</span>
          <h2 className="red-tour-title">OUTRAS ERAS</h2>
          <div className="red-eras-grid">
            {[
              { name: "Taylor Swift", year: "2006", path: "/debut", color: "#50c878" },
              { name: "Fearless", year: "2008", path: "/fearless", color: "#d4af37" },
              { name: "Speak Now", year: "2010", path: "/speaknow", color: "#9b59b6" },
              { name: "1989", year: "2014", path: "/1989", color: "#87ceeb" },
              { name: "Reputation", year: "2017", path: "/reputation", color: "#1a1a1a" },
              { name: "Lover", year: "2019", path: "/lover", color: "#ff9ec4" },
              { name: "Folklore", year: "2020", path: "/folklore", color: "#8a9a8a" },
              { name: "Evermore", year: "2020", path: "/evermore", color: "#8b4513" },
              { name: "Midnights", year: "2022", path: "/midnights", color: "#1c1c4b" },
              { name: "TTPD", year: "2024", path: "/ttpd", color: "#c8a882" },
              { name: "The Life of a Showgirl", year: "2025", path: "/showgirl", color: "#e46c32" },
            ].map((era, i) => (
              <Link key={i} to={era.path} className="red-era-card" style={{ '--era-color': era.color }}>
                <span className="red-era-year" style={{ color: era.color }}>{era.year}</span>
                <span className="red-era-name">{era.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="red-footer">
        <div className="red-footer-inner">
          <p className="red-footer-cursive">Red</p>
          <p className="red-footer-copy">
            © 2026 · Conteúdo para fins educacionais
          </p>
          <div className="red-footer-links">
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
        <button className="red-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Voltar ao topo">
          ↑
        </button>
      )}

    </div>
  );
};

export default Red;