import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './lover.css';

import loverCover from '../../imagens/lover.jpg';

// Hook para animações ao scrollar
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

const Lover = () => {
    const [loaded, setLoaded] = useState(false);
    const [playingTrack, setPlayingTrack] = useState(null);
    const [showTopBtn, setShowTopBtn] = useState(false);
    const [previews, setPreviews] = useState({});
    const [activeMv, setActiveMv] = useState(0);
    const audioRef = useRef(null);
    const [tracklistRef, tracklistInView] = useInView();
    const [timelineSectionRef, timelineInView] = useInView();
    const [galleryRef, galleryInView] = useInView();
    const [mvRef, mvInView] = useInView();
    const [tourRef, tourInView] = useInView();

    useEffect(() => {
        const timer = setTimeout(() => setLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const handleScroll = () => setShowTopBtn(window.scrollY > 400);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Petal falling animation
    useEffect(() => {
        if (!loaded) return;

        const createPetal = () => {
            const petal = document.createElement('div');
            petal.classList.add('lover-petal');

            // Random properties
            const size = Math.random() * 15 + 10;
            const left = Math.random() * 100;
            const duration = Math.random() * 5 + 6;
            const delay = Math.random() * 5;
            const opacity = Math.random() * 0.4 + 0.3;

            // Colors from Lover palette
            const colors = ['#ff9ec4', '#ffd1dc', '#b8d4e3', '#fff5f7'];
            const color = colors[Math.floor(Math.random() * colors.length)];

            petal.style.width = `${size}px`;
            petal.style.height = `${size * 0.8}px`;
            petal.style.left = `${left}vw`;
            petal.style.top = `-20px`;
            petal.style.background = color;
            petal.style.opacity = opacity;
            petal.style.animationDuration = `${duration}s`;
            petal.style.animationDelay = `${delay}s`;

            document.querySelector('.lover-hero')?.appendChild(petal);

            setTimeout(() => {
                if (petal && petal.parentNode) {
                    petal.parentNode.removeChild(petal);
                }
            }, (duration + delay) * 1000);
        };

        // Create initial batch
        for (let i = 0; i < 20; i++) {
            createPetal();
        }

        // Continue creating petals
        const interval = setInterval(createPetal, 400);

        return () => clearInterval(interval);
    }, [loaded]);

    // Fetch iTunes previews
    useEffect(() => {
        const fetchPreviews = async () => {
            try {
                const res = await fetch('https://itunes.apple.com/search?term=taylor+swift+lover&entity=song&limit=50&country=US');
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

    const findPreview = (trackName) => {
        const key = trackName.toLowerCase().replace(/['\"!?]/g, '');
        return previews[key] || Object.entries(previews).find(([k]) => k.replace(/['\"!?]/g, '').includes(key) || key.includes(k.replace(/['\"!?]/g, '')))?.[1] || null;
    };

    const handlePlay = (trackName) => {
        if (playingTrack === trackName) {
            audioRef.current?.pause();
            setPlayingTrack(null);
            return;
        }
        const url = findPreview(trackName);
        if (!url) { alert(`Preview de "${trackName}" não disponível no momento.`); return; }
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = url;
            audioRef.current.load();
            audioRef.current.play().catch(e => console.error('Play error:', e));
            audioRef.current.onended = () => setPlayingTrack(null);
        }
        setPlayingTrack(trackName);
    };

    const tracks = [
        { name: "I Forgot That You Existed", single: false },
        { name: "Cruel Summer", single: true },
        { name: "Lover", single: true },
        { name: "The Man", single: true },
        { name: "The Archer", single: false },
        { name: "I Think He Knows", single: false },
        { name: "Miss Americana & the Heartbreak Prince", single: false },
        { name: "Paper Rings", single: false },
        { name: "Cornelia Street", single: false },
        { name: "Death by a Thousand Cuts", single: false },
        { name: "London Boy", single: false },
        { name: "Soon You'll Get Better", feat: "Dixie Chicks", single: false },
        { name: "False God", single: false },
        { name: "You Need to Calm Down", single: true },
        { name: "Afterglow", single: false },
        { name: "ME!", feat: "Brendon Urie", single: true },
        { name: "It's Nice to Have a Friend", single: false },
        { name: "Daylight", single: false }
    ];

    const musicVideos = [
        { id: "FuXNumBwDOM", title: "ME! ft. Brendon Urie", thumb: "https://img.youtube.com/vi/FuXNumBwDOM/sddefault.jpg" },
        { id: "Dkk9gvTmCXY", title: "You Need to Calm Down", thumb: "https://img.youtube.com/vi/Dkk9gvTmCXY/sddefault.jpg" },
        { id: "cvE2IeIO3BM", title: "Lover", thumb: "https://img.youtube.com/vi/cvE2IeIO3BM/sddefault.jpg" },
        { id: "MQEHrR2jHaI", title: "The Man", thumb: "https://img.youtube.com/vi/MQEHrR2jHaI/sddefault.jpg" },
        { id: "ic8j13piAhQ", title: "Cruel Summer", thumb: "https://img.youtube.com/vi/ic8j13piAhQ/sddefault.jpg" }
    ];

    const timeline = [
        { date: "ABR 2019", title: "ME! LANÇADO", desc: "O primeiro single explode com cores, purpurina e Brendon Urie." },
        { date: "JUN 2019", title: "CALM DOWN", desc: "You Need to Calm Down se torna hino LGBTQ+ e vence o VMA." },
        { date: "AGO 2019", title: "LOVER CHEGA", desc: "O álbum é lançado — 18 faixas de amor puro e revolução pessoal." },
        { date: "SET 2019", title: "ARTIST OF THE DECADE", desc: "Taylor recebe o prêmio de Artista da Década no AMA." },
        { date: "JAN 2020", title: "MISS AMERICANA", desc: "Documentário pessoal estreia na Netflix." },
        { date: "JUN 2023", title: "CRUEL SUMMER #1", desc: "Cruel Summer finalmente atinge o #1 da Billboard, 4 anos depois." }
    ];

    const galleryImages = [
        { img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Taylor_Swift_Reputation_Tour%2C_Texas_34_%28cropped%29.jpg/640px-Taylor_Swift_Reputation_Tour%2C_Texas_34_%28cropped%29.jpg", caption: "The Lover Look" },
        { img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Taylor_Swift_at_the_2019_Billboard_Music_Awards.jpg/492px-Taylor_Swift_at_the_Billboard_Music_Awards.jpg", caption: "Billboard Music Awards 2019" },
        { img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Taylor_Swift_GMA_2019.png/480px-Taylor_Swift_GMA_2019.png", caption: "Good Morning America" },
        { img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png/461px-191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png", caption: "Artist of the Decade" },
        { img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Taylor_Swift_2_%2847533615212%29.jpg/480px-Taylor_Swift_2_%2847533615212%29.jpg", caption: "Lover Promo" },
        { img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Taylor_Swift_at_the_2019_American_Music_Awards.png/480px-Taylor_Swift_at_the_2019_American_Music_Awards.png", caption: "AMA Performance" }
    ];

    const goToMv = (index) => setActiveMv(index);
    const prevMv = () => goToMv((activeMv - 1 + musicVideos.length) % musicVideos.length);
    const nextMv = () => goToMv((activeMv + 1) % musicVideos.length);

    return (
        <main className={`lover-page ${loaded ? 'lover-loaded' : ''}`}>
            <audio ref={audioRef} />

            {/* ═══ FLOATING HEARTS BACKGROUND ═══ */}
            <svg className="lover-hearts-bg lover-hearts-bg--left" viewBox="0 0 300 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 150 80 C 150 35, 200 0, 220 40 C 240 80, 190 130, 150 170 C 110 130, 60 80, 80 40 C 100 0, 150 35, 150 80 Z" stroke="url(#heartGradL)" strokeWidth="1" fill="none" opacity="0.3" />
                <path d="M 80 300 C 80 278, 105 260, 115 280 C 125 300, 100 325, 80 345 C 60 325, 35 300, 45 280 C 55 260, 80 278, 80 300 Z" stroke="url(#heartGradL)" strokeWidth="1.5" fill="none" opacity="0.2" />
                <circle cx="200" cy="200" r="2" fill="#ff9ec4" className="lover-float-dot" />
                <circle cx="120" cy="400" r="3" fill="#b8d4e3" className="lover-float-dot" />
                <circle cx="60" cy="150" r="2.5" fill="#ffd1dc" className="lover-float-dot" />
                <circle cx="250" cy="450" r="2" fill="#ff9ec4" className="lover-float-dot" />
                <defs>
                    <linearGradient id="heartGradL" x1="0.5" y1="0" x2="0.5" y2="1">
                        <stop offset="0%" stopColor="#ff9ec4" stopOpacity="0" />
                        <stop offset="50%" stopColor="#ffd1dc" />
                        <stop offset="100%" stopColor="#b8d4e3" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>

            <svg className="lover-hearts-bg lover-hearts-bg--right" viewBox="0 0 300 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 100 120 C 100 75, 150 40, 170 80 C 190 120, 140 170, 100 210 C 60 170, 10 120, 30 80 C 50 40, 100 75, 100 120 Z" stroke="url(#heartGradR)" strokeWidth="1.5" fill="none" opacity="0.25" />
                <path d="M 220 350 C 220 328, 245 310, 255 330 C 265 350, 240 375, 220 395 C 200 375, 175 350, 185 330 C 195 310, 220 328, 220 350 Z" stroke="url(#heartGradR)" strokeWidth="1" fill="none" opacity="0.2" />
                <circle cx="80" cy="250" r="3" fill="#ffd1dc" className="lover-float-dot" />
                <circle cx="200" cy="500" r="2" fill="#ff9ec4" className="lover-float-dot" />
                <circle cx="150" cy="100" r="2.5" fill="#b8d4e3" className="lover-float-dot" />
                <defs>
                    <linearGradient id="heartGradR" x1="0.5" y1="0" x2="0.5" y2="1">
                        <stop offset="0%" stopColor="#b8d4e3" stopOpacity="0" />
                        <stop offset="50%" stopColor="#ff9ec4" />
                        <stop offset="100%" stopColor="#ffd1dc" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>

            {/* ═══ HEADER / NAVEGAÇÃO ═══ */}
            <header className="lover-nav">
                <Link to="/reputation" className="lover-nav-link">
                    <span>←</span> REPUTATION
                </Link>
                <div className="lover-nav-logo">Lover</div>
                <Link to="/folklore" className="lover-nav-link">
                    FOLKLORE <span>→</span>
                </Link>
            </header>

            {/* ═══ HERO SECTION ═══ */}
            <section className="lover-hero">
                <div className="lover-hero-gradient"></div>
                <div className="lover-texture-overlay"></div>

                <div className="lover-hero-container">
                    <div className="lover-hero-titles">
                        <h2 className="lover-hero-artist">TAYLOR SWIFT</h2>
                        <h1 className="lover-hero-title">
                            <span className="lover-title-glow">Lover</span>
                        </h1>
                        <p className="lover-hero-quote">"I want to be defined by the things that I love"</p>
                    </div>

                    <div className="lover-hero-album">
                        <div className="lover-album-showcase">
                            <div className="lover-album-aura"></div>
                            <div className="lover-album-rainbow"></div>
                            <img src={loverCover} alt="Lover Cover" className="lover-album-img" />
                        </div>
                    </div>

                    <div className="lover-hero-info-strip">
                        <div className="lover-info-item">
                            <span className="lover-info-label">LANÇAMENTO</span>
                            <span className="lover-info-value">23 AGO 2019</span>
                        </div>
                        <div className="lover-info-divider">♡</div>
                        <div className="lover-info-item">
                            <span className="lover-info-label">GÊNERO</span>
                            <span className="lover-info-value">POP / SYNTH-POP</span>
                        </div>
                        <div className="lover-info-divider">♡</div>
                        <div className="lover-info-item">
                            <span className="lover-info-label">STATUS</span>
                            <span className="lover-info-value">7º ÁLBUM</span>
                        </div>
                    </div>

                    <div className="lover-scroll-hint">
                        <div className="lover-scroll-line"></div>
                        <span>EXPLORE</span>
                    </div>
                </div>
            </section>

            {/* ═══ TRACKLIST ═══ */}
            <section className={`lover-tracklist-section ${tracklistInView ? 'lover-in-view' : ''}`} ref={tracklistRef}>
                <div className="lover-section-header">
                    <span className="lover-section-tag">♡ THE DIARY</span>
                    <h2 className="lover-section-title">TRACKLIST</h2>
                    <p className="lover-section-sub">18 TRACKS · 61:48 MIN · POP / SYNTH-POP / ELECTROPOP</p>
                </div>

                <div className="lover-tracks-grid">
                    {tracks.map((track, index) => (
                        <div
                            key={index}
                            className={`lover-track-item ${track.single ? 'is-single' : ''} ${playingTrack === track.name ? 'is-playing' : ''}`}
                            style={{ '--delay': `${index * 0.05}s` }}
                        >
                            <span className="lover-track-num">{String(index + 1).padStart(2, '0')}</span>

                            <button
                                className={`lover-track-play ${playingTrack === track.name ? 'active' : ''}`}
                                onClick={() => handlePlay(track.name)}
                                aria-label={`Preview ${track.name}`}
                            >
                                {playingTrack === track.name ? '■' : '▶'}
                                {playingTrack === track.name && (
                                    <div className="lover-sound-wave">
                                        <span></span><span></span><span></span><span></span>
                                    </div>
                                )}
                            </button>

                            <div className="lover-track-info">
                                <span className="lover-track-name">{track.name}</span>
                                {track.feat && <span className="lover-track-feat">feat. {track.feat}</span>}
                            </div>

                            <div className="lover-track-tags">
                                {track.single && <span className="lover-tag-single">♡ SINGLE</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ TIMELINE ═══ */}
            <section className={`lover-timeline-section ${timelineInView ? 'lover-in-view' : ''}`} ref={timelineSectionRef}>
                <div className="lover-section-header">
                    <span className="lover-section-tag">✦ MOMENTOS</span>
                    <h2 className="lover-section-title">TIMELINE</h2>
                </div>

                <div className="lover-timeline">
                    <div className="lover-timeline-line"></div>
                    {timeline.map((item, i) => (
                        <div key={i} className={`lover-timeline-item ${i % 2 === 0 ? 'left' : 'right'}`} style={{ '--delay': `${i * 0.15}s` }}>
                            <div className="lover-timeline-dot"></div>
                            <div className="lover-timeline-card">
                                <span className="lover-timeline-date">{item.date}</span>
                                <h3 className="lover-timeline-card-title">{item.title}</h3>
                                <p className="lover-timeline-desc">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ GALLERY ═══ */}
            <section className={`lover-gallery-section ${galleryInView ? 'lover-in-view' : ''}`} ref={galleryRef}>
                <div className="lover-section-header">
                    <span className="lover-section-tag">📷 A ERA</span>
                    <h2 className="lover-section-title">GALERIA</h2>
                </div>

                <div className="lover-gallery-grid">
                    {galleryImages.map((item, i) => (
                        <div key={i} className="lover-gallery-item" style={{ '--delay': `${i * 0.1}s` }}>
                            <img src={item.img} alt={item.caption} className="lover-gallery-img" />
                            <div className="lover-gallery-overlay">
                                <span>{item.caption}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ MUSIC VIDEOS ═══ */}
            <section className={`lover-mv-section ${mvInView ? 'lover-in-view' : ''}`} ref={mvRef}>
                <div className="lover-section-header">
                    <span className="lover-section-tag">▶ VISUAIS</span>
                    <h2 className="lover-section-title">MUSIC VIDEOS</h2>
                </div>

                <div className="lover-mv-carousel">
                    <button className="lover-mv-arrow lover-mv-arrow--left" onClick={prevMv} aria-label="Anterior">‹</button>

                    <div className="lover-mv-viewport">
                        <div className="lover-mv-track" style={{ transform: `translateX(-${activeMv * 100}%)` }}>
                            {musicVideos.map((video, index) => (
                                <div className={`lover-mv-slide ${activeMv === index ? 'is-active' : ''}`} key={index}>
                                    <div className="lover-mv-frame">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${video.id}`}
                                            title={video.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                            className="lover-mv-iframe"
                                        ></iframe>
                                    </div>
                                    <h3 className="lover-mv-title">{video.title}</h3>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className="lover-mv-arrow lover-mv-arrow--right" onClick={nextMv} aria-label="Próximo">›</button>
                </div>

                <div className="lover-mv-dots">
                    {musicVideos.map((_, index) => (
                        <button
                            key={index}
                            className={`lover-mv-dot ${activeMv === index ? 'is-active' : ''}`}
                            onClick={() => goToMv(index)}
                            aria-label={`Video ${index + 1}`}
                        />
                    ))}
                </div>
            </section>

            {/* ═══ LOVER FEST / TOUR ═══ */}
            <section className={`lover-tour-section ${tourInView ? 'lover-in-view' : ''}`} ref={tourRef}>
                <div className="lover-section-header">
                    <span className="lover-section-tag">🎤 AO VIVO</span>
                    <h2 className="lover-section-title">LOVER FEST</h2>
                    <p className="lover-section-sub">O festival que seria a celebração definitiva do amor - cancelado pela pandemia, mas eternizado nos corações dos Swifties.</p>
                </div>

                <div className="lover-tour-grid">
                    <div className="lover-tour-card">
                        <div className="lover-tour-icon">🏟️</div>
                        <h3>LOVER FEST WEST</h3>
                        <p>SoFi Stadium, Los Angeles</p>
                        <span className="lover-tour-status cancelled">CANCELADO</span>
                    </div>
                    <div className="lover-tour-card">
                        <div className="lover-tour-icon">🗽</div>
                        <h3>LOVER FEST EAST</h3>
                        <p>Gillette Stadium, Foxborough</p>
                        <span className="lover-tour-status cancelled">CANCELADO</span>
                    </div>
                    <div className="lover-tour-card lover-tour-card--highlight">
                        <div className="lover-tour-icon">🌍</div>
                        <h3>ERAS TOUR</h3>
                        <p>Lover ganhou vida nos setlists da Eras Tour (2023-2024)</p>
                        <span className="lover-tour-status live">CRUEL SUMMER AO VIVO ♡</span>
                    </div>
                </div>
            </section>

            {/* ═══ NAVEGUE ENTRE AS ERAS ═══ */}
            <section className="lover-eras-section">
                <div className="lover-section-header">
                    <span className="lover-section-tag">✦ NAVEGUE</span>
                    <h2 className="lover-section-title">OUTRAS ERAS</h2>
                </div>
                <div className="lover-eras-grid">
                    {[
                        { name: "Taylor Swift", year: "2006", path: "/debut", color: "#50c878" },
                        { name: "Fearless", year: "2008", path: "/fearless", color: "#d4af37" },
                        { name: "Speak Now", year: "2010", path: "/speak-now", color: "#8e44ad" },
                        { name: "Red", year: "2012", path: "/red", color: "#8b0000" },
                        { name: "1989", year: "2014", path: "/1989", color: "#87ceeb" },
                        { name: "Reputation", year: "2017", path: "/reputation", color: "#2d2d2d" },
                        { name: "Folklore", year: "2020", path: "/folklore", color: "#8a9a8a" },
                        { name: "Evermore", year: "2020", path: "/evermore", color: "#8b4513" },
                        { name: "Midnights", year: "2022", path: "/midnights", color: "#1c1c4b" },
                        { name: "TTPD", year: "2024", path: "/ttpd", color: "#c8a882" },
                    ].map((era, i) => (
                        <Link key={i} to={era.path} className="lover-era-card" style={{ '--era-accent': era.color }}>
                            <span className="lover-era-year" style={{ color: era.color }}>{era.year}</span>
                            <span className="lover-era-name">{era.name}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ═══ FOOTER ═══ */}
            <footer className="lover-footer">
                <div className="lover-footer-inner">
                    <p className="lover-footer-logo">Lover</p>
                    <p className="lover-footer-copy">© 2026 · Conteúdo para fins educacionais</p>
                    <div className="lover-footer-links">
                        <a href="https://www.taylorswift.com" target="_blank" rel="noopener noreferrer">Site Oficial</a>
                        <span>♡</span>
                        <a href="https://open.spotify.com/album/1NAmidJlEaVgA3MpcPFYGq" target="_blank" rel="noopener noreferrer">Spotify</a>
                        <span>♡</span>
                        <a href="https://music.apple.com/us/album/lover/1468058165" target="_blank" rel="noopener noreferrer">Apple Music</a>
                    </div>
                </div>
            </footer>

            {/* ═══ BACK TO TOP ═══ */}
            {showTopBtn && (
                <button
                    className="lover-top-btn"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    aria-label="Voltar ao topo"
                >
                    ♡
                </button>
            )}
        </main>
    );
};

export default Lover;