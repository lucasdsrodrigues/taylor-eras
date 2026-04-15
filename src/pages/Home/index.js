import React, { useState, useEffect } from "react";
import ErasCarousel from "../../components/ErasCarousel/ErasCarousel";
import Timeline from "../../components/Timeline/Timeline";
import './home.css';

/* ═══ DATA ═══ */
const ERA_COLORS = [
    { name: "Debut", color: "#7ec8a0" },
    { name: "Fearless", color: "#c9a227" },
    { name: "Speak Now", color: "#a855f7" },
    { name: "Red", color: "#991b1b" },
    { name: "1989", color: "#87ceeb" },
    { name: "Reputation", color: "#2d2d2d" },
    { name: "Lover", color: "#ff9ec4" },
    { name: "Folklore", color: "#8a9a8a" },
    { name: "Evermore", color: "#cc621b" },
    { name: "Midnights", color: "#7b8aff" },
    { name: "TTPD", color: "#a79e8f" },
    { name: "Showgirl", color: "#e46c32" },
];

const STATS = [
    { icon: "💿", big: "200M+", desc: "Discos vendidos mundialmente", color: "#c9a227" },
    { icon: "🏆", big: "14", desc: "Grammy Awards", color: "#a855f7" },
    { icon: "🎵", big: "12", desc: "Álbuns de estúdio", color: "#e46c32" },
    { icon: "🎪", big: "$2B+", desc: "Bilheteria da Eras Tour", color: "#ff9ec4" },
    { icon: "🥇", big: "4", desc: "Album of the Year (recorde)", color: "#7b8aff" },
    { icon: "🎧", big: "100B+", desc: "Streams globais", color: "#87ceeb" },
];

const JOURNEY = [
    { year: "2006 — 2010", title: "A Ascensão Country", desc: "De uma adolescente de 16 anos em Nashville que escrevia músicas no caderno ao fenômeno que redefiniu o country-pop com Fearless — o álbum mais jovem a ganhar o Grammy de Álbum do Ano.", color: "#7ec8a0" },
    { year: "2014 — 2017", title: "A Transição Pop", desc: "1989 marcou a reinvenção total: de Nashville para Nova York, de country para synth-pop. Reputation respondeu ao mundo que tentou cancelá-la — e ela voltou mais forte que nunca.", color: "#87ceeb" },
    { year: "2019 — 2020", title: "Queda e Renascimento", desc: "Lover trouxe liberdade criativa. Depois, em plena pandemia, Folklore e Evermore nasceram como cartas de amor à introspecção — provando que Taylor poderia dominar qualquer gênero.", color: "#8a9a8a" },
    { year: "2022 — 2024", title: "A Poeta Torturada", desc: "Midnights quebrou recordes na primeira semana. A Eras Tour se tornou a maior turnê da história. TTPD revelou a poeta por trás dos holofotes, vendendo 2 milhões na primeira semana.", color: "#7b8aff" },
    { year: "2025", title: "A Showgirl", desc: "The Life of a Showgirl encerrou uma era e abriu um novo capítulo — o álbum mais teatral, visceral e confessional de sua carreira. O palco é dela, sempre foi.", color: "#e46c32" },
];

const PARTICLE_COUNT = 30;

/* ═══ COMPONENT ═══ */
function Home() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setTimeout(() => setLoaded(true), 100);
        document.body.style.backgroundColor = '#0a0a0f';
        document.body.style.backgroundImage = 'none';
        return () => { document.body.style.backgroundColor = ''; document.body.style.backgroundImage = ''; };
    }, []);

    useEffect(() => {
        const els = document.querySelectorAll('.home-about, .home-stats, .home-journey');
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('home-visible'); });
        }, { threshold: 0.1 });
        els.forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    /* Particles */
    const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        left: `${Math.random() * 100}%`,
        color: ERA_COLORS[i % ERA_COLORS.length].color,
        size: `${3 + Math.random() * 5}px`,
        dur: `${6 + Math.random() * 10}s`,
        delay: `${Math.random() * 12}s`,
    }));

    return (
        <main className={`home-page ${loaded ? 'home-loaded' : ''}`}>

            {/* ═══ PARTICLES ═══ */}
            <div className="home-particles">
                {particles.map((p, i) => (
                    <div key={i} className="home-particle" style={{
                        left: p.left,
                        '--pc': p.color,
                        '--ps': p.size,
                        '--pd': p.dur,
                        '--pdelay': p.delay,
                    }} />
                ))}
            </div>

            {/* ═══ HERO ═══ */}
            <header className="home-hero">
                {/* SVG spotlights from each era */}
                <svg className="home-hero-svg" viewBox="0 0 1200 800" preserveAspectRatio="none">
                    <polygon points="100,0 0,800 200,800" fill="url(#hsp0)" opacity="0.03" />
                    <polygon points="300,0 200,800 400,800" fill="url(#hsp1)" opacity="0.025" />
                    <polygon points="500,0 400,800 600,800" fill="url(#hsp2)" opacity="0.02" />
                    <polygon points="700,0 600,800 800,800" fill="url(#hsp3)" opacity="0.025" />
                    <polygon points="900,0 800,800 1000,800" fill="url(#hsp4)" opacity="0.02" />
                    <polygon points="1100,0 1000,800 1200,800" fill="url(#hsp5)" opacity="0.03" />
                    <defs>
                        <radialGradient id="hsp0" cx="50%" cy="0%" r="80%"><stop offset="0%" stopColor="#7ec8a0" /><stop offset="100%" stopColor="transparent" /></radialGradient>
                        <radialGradient id="hsp1" cx="50%" cy="0%" r="80%"><stop offset="0%" stopColor="#c9a227" /><stop offset="100%" stopColor="transparent" /></radialGradient>
                        <radialGradient id="hsp2" cx="50%" cy="0%" r="80%"><stop offset="0%" stopColor="#a855f7" /><stop offset="100%" stopColor="transparent" /></radialGradient>
                        <radialGradient id="hsp3" cx="50%" cy="0%" r="80%"><stop offset="0%" stopColor="#87ceeb" /><stop offset="100%" stopColor="transparent" /></radialGradient>
                        <radialGradient id="hsp4" cx="50%" cy="0%" r="80%"><stop offset="0%" stopColor="#7b8aff" /><stop offset="100%" stopColor="transparent" /></radialGradient>
                        <radialGradient id="hsp5" cx="50%" cy="0%" r="80%"><stop offset="0%" stopColor="#e46c32" /><stop offset="100%" stopColor="transparent" /></radialGradient>
                    </defs>
                </svg>

                <span className="home-hero-tag">12 ÁLBUNS · 18 ANOS · 1 LENDA</span>
                <h1 className="home-hero-title">Taylor Swift</h1>
                <p className="home-hero-sub">The story of the greatest musical phenomenon of our generation</p>

                {/* Era color strip */}
                <div className="home-era-strip">
                    {ERA_COLORS.map((e, i) => (
                        <div key={i} className="home-era-bar" style={{ background: e.color, '--eb': e.color }} title={e.name} />
                    ))}
                </div>

                {/* Scroll cue */}
                <div className="home-scroll-cue">
                    <div className="home-scroll-line" />
                    <span>SCROLL</span>
                </div>
            </header>

            {/* ═══ ABOUT ═══ */}
            <section className="home-about">
                <div className="home-about-inner">
                    <div className="home-about-photo">
                        <div className="home-about-glow" />
                        <img
                            src="https://forbes.com.br/wp-content/uploads/2026/01/taylor-swift-forbes.jpg"
                            alt="Taylor Swift"
                            className="home-about-img"
                        />
                    </div>
                    <div className="home-about-text">
                        <span className="home-label">quem é ela?</span>
                        <h2 className="home-title">A Maior Artista da Sua Geração</h2>
                        <p className="home-about-p">
                            <strong>Taylor Alison Swift</strong> nasceu em <em>13 de dezembro de 1989</em>, em West Reading,
                            Pensilvânia. De uma fazenda de árvores de Natal a estádios lotados ao redor do mundo, Taylor
                            redefiniu o que significa ser artista no século XXI.
                        </p>
                        <p className="home-about-p">
                            Compositora desde os 12 anos, ela é a <strong>única artista na história a ganhar 4 Grammys
                            de Álbum do Ano</strong> — e a primeira a ter 5 álbuns vendendo mais de 1 milhão de cópias
                            na primeira semana.
                        </p>
                        <div className="home-about-facts">
                            <div className="home-mini-stat">
                                <span className="home-mini-num">1989</span>
                                <span className="home-mini-label">NASCIMENTO</span>
                            </div>
                            <div className="home-mini-stat">
                                <span className="home-mini-num">2006</span>
                                <span className="home-mini-label">DEBUT</span>
                            </div>
                            <div className="home-mini-stat">
                                <span className="home-mini-num">18a</span>
                                <span className="home-mini-label">CARREIRA</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ STATS ═══ */}
            <section className="home-stats">
                <div className="home-stats-header">
                    <span className="home-label">os números</span>
                    <h2 className="home-title">Uma Carreira em Números</h2>
                </div>
                <div className="home-stats-grid">
                    {STATS.map((s, i) => (
                        <div key={i} className="home-stat-card" style={{ '--sc': s.color }}>
                            <div className="home-stat-icon">{s.icon}</div>
                            <h3 className="home-stat-big">{s.big}</h3>
                            <p className="home-stat-desc">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ JOURNEY ═══ */}
            <section className="home-journey">
                <div className="home-journey-inner">
                    <div className="home-journey-header">
                        <span className="home-label">de nashville ao mundo</span>
                        <h2 className="home-title">A Jornada</h2>
                    </div>
                    <div className="home-journey-list">
                        {JOURNEY.map((j, i) => (
                            <div key={i} className="home-journey-item" style={{ '--jc': j.color }}>
                                <span className="home-journey-year">{j.year}</span>
                                <h3 className="home-journey-title">{j.title}</h3>
                                <p className="home-journey-desc">{j.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ CAROUSEL & TIMELINE ═══ */}
            <div className="home-carousel-wrap">
                <ErasCarousel
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                />
                <Timeline
                    currentIndex={currentIndex}
                    onSelectEra={(index) => setCurrentIndex(index)}
                />
            </div>

            {/* ═══ FOOTER ═══ */}
            <footer className="home-footer">
                <div className="home-footer-left">
                    <p className="home-footer-logo">Taylor Swift — Eras</p>
                    <p className="home-footer-copy">© 2026 · Conteúdo para fins educacionais</p>
                    <p className="home-footer-easter">long story short, i survived</p>
                </div>
                <div className="home-footer-links">
                    <a href="https://www.taylorswift.com" target="_blank" rel="noopener noreferrer">Site Oficial</a>
                    <a href="https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02" target="_blank" rel="noopener noreferrer">Spotify</a>
                    <a href="https://music.apple.com/us/artist/taylor-swift/159260351" target="_blank" rel="noopener noreferrer">Apple Music</a>
                    <button className="home-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
                </div>
            </footer>
        </main>
    );
}

export default Home;