import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Debut.css';

import imgTimMcGraw from '../../imagens/tim-mcgraw.webp';
import imgTeardrops from '../../imagens/teardrops.jpg';
import imgOurSong from '../../imagens/our-song.jpg';
import imgPictureToBurn from '../../imagens/picture-to-burn.jpg';
import imgShouldveSaidNo from '../../imagens/shouldve-said-no.webp';

import shoot1 from '../../imagens/shoot1.webp';
import shoot2 from '../../imagens/shoot2.webp';
import shoot3 from '../../imagens/shoot3.webp';
import shoot4 from '../../imagens/shoot4.webp';
import shoot5 from '../../imagens/shoot5.webp';
import shoot6 from '../../imagens/shoot6.webp';
import shoot7 from '../../imagens/shoot7.webp';
import shoot8 from '../../imagens/shoot8.webp';
import shoot9 from '../../imagens/shoot9.webp';
import shoot10 from '../../imagens/shoot10.webp';
import shoot11 from '../../imagens/shoot11.webp';
import shoot12 from '../../imagens/shoot12.webp';
import shoot13 from '../../imagens/shoot13.webp';
import shoot14 from '../../imagens/shoot14.webp';
import shoot15 from '../../imagens/shoot15.webp';
import shoot16 from '../../imagens/shoot16.webp';
import shoot17 from '../../imagens/shoot17.webp';
import shoot18 from '../../imagens/shoot18.webp';
import shoot19 from '../../imagens/shoot19.webp';
import shoot20 from '../../imagens/shoot20.webp';

const Debut = () => {
  const [easterEggAtivo, setEasterEggAtivo] = useState(false);
  const [galeriaAberta, setGaleriaAberta] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  /* 1. EFEITO DO BOTÃO VOLTAR AO TOPO */
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  /* 2. EFEITO DA NATUREZA (VAGALUMES) */
  useEffect(() => {
    let active = true;
    const launchNatureEffects = () => {
      if (!active) return;

      const amount = 20;
      const colors = ['#eaffd0', '#f4ffaa', '#d4ffb2', '#ffffff', '#a8e4a0'];

      for (let i = 0; i < amount; i++) {
        setTimeout(() => {
          if (!active) return;
          const element = document.createElement('div');
          element.className = 'nature-firefly';

          element.style.left = (Math.random() * 100) + 'vw';
          element.style.top = (Math.random() * 100) + 'vh';
          element.style.background = colors[Math.floor(Math.random() * colors.length)];
          const size = Math.random() * 4 + 2 + 'px';
          element.style.width = size;
          element.style.height = size;
          document.body.appendChild(element);

          const animation = element.animate([
            { transform: 'translate(0, 0)', opacity: 0 },
            { opacity: Math.random() * 0.8 + 0.5, offset: 0.5 },
            { transform: `translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px)`, opacity: 0 }
          ], { duration: Math.random() * 6000 + 4000, easing: 'ease-in-out' });

          animation.onfinish = () => { if (document.body.contains(element)) element.remove(); };
        }, i * 200);
      }
    };

    // Initial burst
    launchNatureEffects();

    // Continuous spawning
    const interval = setInterval(() => {
      launchNatureEffects();
    }, 8000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const musicVideos = [
    { titulo: "Tim McGraw", ano: "2006", diretor: "Trey Fanjoy", thumb: imgTimMcGraw, url: "https://www.youtube.com/watch?v=GkD20ajVxnY" },
    { titulo: "Teardrops On My Guitar", ano: "2007", diretor: "Trey Fanjoy", thumb: imgTeardrops, url: "https://www.youtube.com/watch?v=xKCek6ndSA0" },
    { titulo: "Our Song", ano: "2007", diretor: "Trey Fanjoy", thumb: imgOurSong, url: "https://www.youtube.com/watch?v=Jb2stN7kH28" },
    { titulo: "Picture To Burn", ano: "2008", diretor: "Trey Fanjoy", thumb: imgPictureToBurn, url: "https://www.youtube.com/watch?v=yBCP26Ti6nY" },
    { titulo: "Should've Said No", ano: "2008", diretor: "ACM Awards", thumb: imgShouldveSaidNo, url: "https://www.youtube.com/watch?v=mE9O9uY_kRk" }
  ];

  const photoshootImages = [
    { src: shoot1, rot: "-2deg", text: "He said the way my blue eyes shined" },
    { src: shoot2, rot: "3deg", text: "When you think Tim McGraw" },
    { src: shoot3, rot: "-3deg", text: "I hope you think of me" },
    { src: shoot4, rot: "2deg", text: "I'm just a girl on a mission" },
    { src: shoot5, rot: "1deg", text: "Our song is a slamming screen door" },
    { src: shoot6, rot: "-4deg", text: "Drew looks at me" },
    { src: shoot7, rot: "3deg", text: "Burn, burn, burn, baby, burn" },
    { src: shoot8, rot: "-2deg", text: "Just a place in this world" },
    { src: shoot9, rot: "2deg", text: "Stay beautiful" },
    { src: shoot10, rot: "-3deg", text: "You're beautiful, every little piece" },
    { src: shoot11, rot: "1deg", text: "Take me back to the creek beds" },
    { src: shoot12, rot: "-2deg", text: "I was right there by your side" },
    { src: shoot13, rot: "4deg", text: "She's the star of a bad show" },
    { src: shoot14, rot: "-3deg", text: "Tied together with a smile" },
    { src: shoot15, rot: "2deg", text: "I should've said no" },
    { src: shoot16, rot: "-1deg", text: "The outside looking in" },
    { src: shoot17, rot: "3deg", text: "He's the reason for the teardrops" },
    { src: shoot18, rot: "-4deg", text: "I’m only up when you’re not here" },
    { src: shoot19, rot: "2deg", text: "Friday night beneath the stars" },
    { src: shoot20, rot: "-2deg", text: "It's the first time for everything" }
  ];

  const trilhasCompletas = [
    { no: "01", titulo: "Tim McGraw", tema: "Nostalgia", nota: "Escrita na aula de mAtEMática.", rot: "-2deg" },
    { no: "02", titulo: "Picture To Burn", tema: "Vingança", nota: "QUeimei as fotos.", rot: "3deg" },
    { no: "03", titulo: "Teardrops on My Guitar", tema: "Amor Não Correspondido", nota: "DrEw...", rot: "-1.5deg" },
    { no: "04", titulo: "A Place In This World", tema: "Identidade", nota: "A jOrnada começa.", rot: "2.5deg" },
    { no: "05", titulo: "Cold As You", tema: "Coração Partido", nota: "Letras mais afiadas.", rot: "-3deg" },
    { no: "06", titulo: "The Outside", tema: "Solidão", nota: "Escrita aos 12 anos.", rot: "2deg" },
    { no: "07", titulo: "Tied Together with a Smile", tema: "Pressão", nota: "Para uma amiga.", rot: "-2.5deg" },
    { no: "08", titulo: "Stay Beautiful", tema: "Admiração", nota: "Sobre o Cory.", rot: "1.5deg" },
    { no: "09", titulo: "Should've Said No", tema: "Infidelidade", nota: "O momEnTo da chuva.", rot: "-3.5deg" },
    { no: "10", titulo: "Mary's Song", tema: "Amor Eterno", nota: "HiStória real.", rot: "3deg" },
    { no: "11", titulo: "Our Song", tema: "Amor Jovem", nota: "MúsiCa do show de talentos.", rot: "-2deg" }
  ];

  return (
    <div className={`debut-ultra-archive ${easterEggAtivo ? 'show-secret' : ''} ${loaded ? 'debut-loaded' : ''}`}>
      <div className="grain-overlay"></div>
      <div className="debut-texture-overlay"></div>

      {/* Cinematic SVGs at the Background */}
      <svg className="debut-slither-bg debut-slither-bg--left" viewBox="0 0 200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 150 0 C 80 100, 180 200, 100 300 C 20 400, 150 500, 80 600 C 10 700, 140 800, 100 900"
          stroke="url(#vineGradientL)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.4"
        />
        {/* Extra tendril */}
        <path
          d="M 100 300 C 60 350, 80 420, 40 450"
          stroke="url(#vineGradientL)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.25"
        />
        <path
          d="M 80 600 C 130 640, 100 680, 140 720"
          stroke="url(#vineGradientL)" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.2"
        />
        {/* Small leaf dots */}
        <circle cx="40" cy="450" r="3" fill="#50c878" opacity="0.4" />
        <circle cx="140" cy="720" r="2.5" fill="#8fbc8f" opacity="0.3" />
        <circle cx="100" cy="300" r="2" fill="#d4af37" opacity="0.3" />
        <defs>
          <linearGradient id="vineGradientL" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#50c878" />
            <stop offset="50%" stopColor="#8fbc8f" />
            <stop offset="100%" stopColor="#2d3e2d" />
          </linearGradient>
        </defs>
      </svg>

      <svg className="debut-slither-bg debut-slither-bg--right" viewBox="0 0 200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 50 0 C 120 150, 40 250, 150 350 C 260 450, 80 550, 160 650 C 240 750, 100 850, 150 950"
          stroke="url(#vineGradientR)" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.3"
        />
        <path
          d="M 150 350 C 180 400, 200 430, 170 480"
          stroke="url(#vineGradientR)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.2"
        />
        <path
          d="M 160 650 C 120 690, 145 730, 110 760"
          stroke="url(#vineGradientR)" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.15"
        />
        <circle cx="170" cy="480" r="3" fill="#8fbc8f" opacity="0.3" />
        <circle cx="110" cy="760" r="2" fill="#50c878" opacity="0.25" />
        <defs>
          <linearGradient id="vineGradientR" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8fbc8f" />
            <stop offset="50%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#50c878" />
          </linearGradient>
        </defs>
      </svg>

      {galeriaAberta && (
        <div className="photo-overlay" onClick={() => setGaleriaAberta(false)}>
          <div className="photo-content" onClick={e => e.stopPropagation()}>
            <button className="close-gallery-top" onClick={() => setGaleriaAberta(false)}>VOLTAR PARA O ÁLBUM ×</button>
            <h2 className="glitter-title" style={{ fontSize: '3.5rem', marginTop: '40px' }}>THE 2006 SESSIONS</h2>
            <div className="photo-masonry">
              {photoshootImages.map((img, index) => (
                <div key={index} className="polaroid-item" style={{ '--r': img.rot }}>
                  <img src={img.src} alt={img.text} />
                  <p className="handwritten-caption">{img.text}</p>
                </div>
              ))}
            </div>
            <footer className="gallery-footer">
              <p>End of 2006 Archives</p>
              <button className="close-gallery-bottom" onClick={() => setGaleriaAberta(false)}>FECHAR X</button>
            </footer>
          </div>
        </div>
      )}

      <nav className="binder-nav">
        <Link to="/" className="tab-link">ÍNDICE DE ERAS</Link>
        <div className="current-era-badge" onClick={() => setEasterEggAtivo(!easterEggAtivo)}>
          CAPÍTULO 01: A ERA {easterEggAtivo ? 'MÁGICA' : 'AUTOTITULADA'}
        </div>
        <Link to="/fearless" className="tab-link gold-tab">PRÓXIMO: FEARLESS →</Link>
      </nav>

      <section className="hero-archive">
        <div className="hero-layout">
          <div className="cover-box">
            <img src="https://upload.wikimedia.org/wikipedia/en/1/1f/Taylor_Swift_-_Taylor_Swift.png" alt="Debut" />
            <div className="debut-album-glow"></div>

            <div className="label-sticker">7x PLATINA</div>
          </div>
          <div className="hero-info">
            <h1 className="debut-main-title">
              <span className="debut-title-ink">Taylor</span>
              <br />
              <span className="debut-title-ink">Swift</span>
            </h1>
            <div className="specs-grid">
              <div className="spec-item"><span>LANÇAMENTO</span> 24 Out, 2006</div>
              <div className="spec-item"><span>GÊNERO</span> Country / Pop</div>
              <div className="spec-item"><span>PRODUTOR</span> Nathan Chapman</div>
              <div className="spec-item"><span>DURAÇÃO</span> 40:28</div>
            </div>
            <button className="photoshoot-btn" onClick={() => setGaleriaAberta(true)}>
              VER PHOTOSHOOT COMPLETO 📷
            </button>
          </div>
        </div>
      </section>

      <section className="memory-box-dark">
        <h2 className="glitter-title">A CAIXA DE MEMÓRIAS</h2>
        <div className="cards-wrapper">
          <div className="m-card">
            <div className="m-icon">🎸</div>
            <h3>Instrumental</h3>
            <p>Banjo, Violino e Violões definem o som desta era.</p>
          </div>
          <div className="m-card">
            <div className="m-icon">🦋</div>
            <h3>Mensagens Ocultas</h3>
            <p>As letras maiúsculas nos papéis abaixo formam uma palavra secreta...</p>
          </div>
          <div className="m-card">
            <div className="m-icon">👢</div>
            <h3>Moda</h3>
            <p>Vestidos de verão e botas de cowboy eram o uniforme de 2006.</p>
          </div>
        </div>
      </section>

      <section className="spotify-preview-section">
        <div className="spotify-container">
          <h2 className="glitter-title">OUÇA O ÁLBUM</h2>
          <iframe
            style={{ borderRadius: '12px' }}
            src="https://open.spotify.com/embed/album/5eyZZoQEFQWRHkV2xgAeBw?utm_source=generator"
            width="100%"
            height="352"
            frameBorder="0"
            allowFullScreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify Preview"
          ></iframe>
        </div>
      </section>

      <section className="film-vault">
        <h2 className="section-subtitle">O COFRE DE FILMES (CLIPES)</h2>
        <div className="video-scroll">
          {musicVideos.map((video, i) => (
            <div key={i} className="video-card-container">
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="video-card"
              >
                <div className="video-tape" style={{ backgroundImage: `url("${video.thumb}")` }}>
                  <div className="play-overlay">▶</div>
                </div>
                <h4>{video.titulo}</h4>
                <p>Direção: {video.diretor}</p>
                <span className="v-year">{video.ano}</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="lyricist-den">
        <h2 className="handwritten-heading">O Processo de Composição</h2>
        <div className="scraps-wall">
          {trilhasCompletas.map((t, index) => (
            <div
              key={t.no}
              className={`scrap-paper paper-${index % 4}`}
              style={{
                '--r': t.rot,
                '--delay': `${index * 0.2}s`
              }}
            >
              <div className="paper-pin"></div>
              <span className="p-no">{t.no}</span>
              <h3>{t.titulo}</h3>
              <p className="p-theme">Tema: {t.tema}</p>
              <div className="p-scribble">Nota: {t.nota}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="debut-achievements">
        <div className="achievement-overlay">
          <h2 className="glitter-title">AWARDS & MILESTONES</h2>
          <div className="stats-container">
            <div className="stat-box">
              <span className="stat-number">275</span>
              <p>Semanas na Billboard 200</p>
            </div>
            <div className="stat-box">
              <span className="stat-number">7x</span>
              <p>Certificado de Platina pela RIAA</p>
            </div>
            <div className="stat-box">
              <span className="stat-number">#1</span>
              <p>Álbum Country mais vendido (2007-08)</p>
            </div>
          </div>
          <div className="awards-highlight">
            <h3 className="awards-subtitle">PRINCIPAIS RECONHECIMENTOS</h3>
            <div className="awards-grid">
              <div className="award-item">
                <span className="award-icon">🏆</span>
                <h4>GRAMMY AWARDS</h4>
                <p>Nomeada como Best New Artist (2008)</p>
              </div>
              <div className="award-item">
                <span className="award-icon">🏆</span>
                <h4>AMA</h4>
                <p>Favorite Country Female Artist</p>
              </div>
              <div className="award-item">
                <span className="award-icon">🏆</span>
                <h4>CMA AWARDS</h4>
                <p>Horizon Award (Revelação do Ano)</p>
              </div>
              <div className="award-item">
                <span className="award-icon">🏆</span>
                <h4>BMI AWARDS</h4>
                <p>Song of the Year ("Teardrops on My Guitar")</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="db-eras-section">
        <div className="db-eras-inner">
          <span className="db-mv-label">NAVEGUE</span>
          <h2 className="db-mv-title">OUTRAS ERAS</h2>
          <div className="db-eras-grid">
            {[
              { name: "Debut", year: "2006", path: "/debut", color: "#50c878" },
              { name: "Fearless", year: "2008", path: "/fearless", color: "#d4af37" },
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
              <Link key={i} to={era.path} className="db-era-card" style={{ '--era-color': era.color }}>
                <span className="db-era-year" style={{ color: era.color }}>{era.year}</span>
                <span className="db-era-name">{era.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="db-footer">
        <div className="db-footer-inner">
          <p className="db-footer-cursive">Taylor Swift</p>
          <p className="db-footer-copy">© 2026 · Conteúdo para fins educacionais</p>
          <div className="db-footer-links">
            <a href="https://www.taylorswift.com" target="_blank" rel="noopener noreferrer">Site Oficial</a>
            <span>·</span>
            <a href="https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02" target="_blank" rel="noopener noreferrer">Spotify</a>
            <span>·</span>
            <a href="https://music.apple.com/us/artist/taylor-swift/159260351" target="_blank" rel="noopener noreferrer">Apple Music</a>
          </div>
        </div>
      </footer>

      {showTopBtn && (
        <button
          className="db-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Voltar ao topo"
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default Debut;