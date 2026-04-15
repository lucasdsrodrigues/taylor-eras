import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './Reputation.css';

import reputationcover from '../../imagens/reputationcover.webp';

// Hook para animações de scroll
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

const Reputation = () => {
    const [loaded, setLoaded] = useState(false);
    const [playingTrack, setPlayingTrack] = useState(null);
    const [showTopBtn, setShowTopBtn] = useState(false);
    const audioRef = useRef(null);
    const [tracklistRef, tracklistInView] = useInView();

    useEffect(() => {
        const handleScroll = () => setShowTopBtn(window.scrollY > 400);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // MV Carousel State
    const [activeMv, setActiveMv] = useState(0);

    const musicVideos = [
        {
            id: "3tmd-ClpJxA",
            title: "Look What You Made Me Do",
            thumb: "https://img.youtube.com/vi/3tmd-ClpJxA/sddefault.jpg"
        },
        {
            id: "wIft-t-MQuE",
            title: "...Ready For It?",
            thumb: "https://img.youtube.com/vi/wIft-t-MQuE/sddefault.jpg"
        },
        {
            id: "dfnCAmr569k",
            title: "End Game ft. Ed Sheeran & Future",
            thumb: "https://img.youtube.com/vi/dfnCAmr569k/sddefault.jpg"
        },
        {
            id: "tCXGJQYZ9JA",
            title: "Delicate",
            thumb: "https://img.youtube.com/vi/tCXGJQYZ9JA/sddefault.jpg"
        }
    ];

    const goToMv = (index) => {
        setActiveMv(index);
    };

    const prevMv = () => goToMv((activeMv - 1 + musicVideos.length) % musicVideos.length);
    const nextMv = () => goToMv((activeMv + 1) % musicVideos.length);

    // Timeline Scroll State
    const timelineRef = useRef(null);
    const [timelineProgress, setTimelineProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!timelineRef.current) return;
            const rect = timelineRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            const startScroll = windowHeight / 1.5;
            const totalScroll = rect.height;

            let progress = (startScroll - rect.top) / totalScroll;
            progress = Math.max(0, Math.min(1, progress));

            setTimelineProgress(prev => Math.max(prev, progress));
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Previews do iTunes
    const [previews, setPreviews] = useState({});
    useEffect(() => {
        const timer = setTimeout(() => setLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchPreviews = async () => {
            try {
                const res = await fetch(
                    'https://itunes.apple.com/search?term=taylor+swift+reputation&entity=song&limit=50&country=US'
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

    const findPreview = (trackName) => {
        const key = trackName.toLowerCase();
        return previews[key]
            || Object.entries(previews).find(([k]) => k.includes(key) || key.includes(k))?.[1]
            || null;
    };

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

    const tracks = [
        { name: "...Ready for It?", single: true },
        { name: "End Game", feat: "feat. Ed Sheeran & Future", single: true },
        { name: "I Did Something Bad", single: false },
        { name: "Don't Blame Me", single: false },
        { name: "Delicate", single: true },
        { name: "Look What You Made Me Do", single: true },
        { name: "So It Goes...", single: false },
        { name: "Gorgeous", single: true },
        { name: "Getaway Car", single: false },
        { name: "King of My Heart", single: false },
        { name: "Dancing with Our Hands Tied", single: false },
        { name: "Dress", single: false },
        { name: "This Is Why We Can't Have Nice Things", single: false },
        { name: "Call It What You Want", single: true },
        { name: "New Year's Day", single: false },
    ];

    return (
        <main className={`era-rep-page ${loaded ? 'rep-loaded' : ''}`}>
            <audio ref={audioRef} style={{ display: 'none' }} />

            {/* ═══ CAMADAS DE TEXTURA DE FUNDO ═══ */}
            <div className="rep-noise-overlay"></div>
            <div className="rep-newspaper-overlay"></div>

            {/* ═══ COBRAS SVG DECORATIVAS ao fundo ═══ */}
            <svg className="rep-snake-bg rep-snake-bg--left" viewBox="0 0 200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M100 0 C60 80, 150 160, 80 240 C10 320, 160 400, 100 480 C40 560, 150 640, 100 720 L100 800"
                    stroke="url(#snakeGrad1)" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.3"
                />
                <defs>
                    <linearGradient id="snakeGrad1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6b8e23" />
                        <stop offset="50%" stopColor="#c0392b" />
                        <stop offset="100%" stopColor="#2c3e50" />
                    </linearGradient>
                </defs>
            </svg>
            <svg className="rep-snake-bg rep-snake-bg--right" viewBox="0 0 200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M100 0 C140 100, 50 200, 120 300 C190 400, 40 500, 100 600 C160 700, 80 750, 100 800"
                    stroke="url(#snakeGrad2)" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.25"
                />
                <defs>
                    <linearGradient id="snakeGrad2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8e44ad" />
                        <stop offset="50%" stopColor="#d4af37" />
                        <stop offset="100%" stopColor="#1abc9c" />
                    </linearGradient>
                </defs>
            </svg>

            {/* ═══ HEADER / NAVEGAÇÃO ═══ */}
            <header className="era-rep-nav">
                <Link to="/1989" className="nav-rep-link">
                    <span className="nav-rep-arrow">←</span> 1989
                </Link>

                <div className="rep-logo-group">
                    <svg className="rep-logo-snake" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 18 C8 4, 18 20, 26 8 C34 -4, 44 20, 52 10 L56 6" stroke="url(#logoSnakeG)" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="56" cy="6" r="2" fill="#6b8e23" />
                        <defs>
                            <linearGradient id="logoSnakeG" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#2d2d2d" />
                                <stop offset="100%" stopColor="#6b8e23" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="rep-logo">reputation</div>
                </div>

                <Link to="/lover" className="nav-rep-link">
                    LOVER <span className="nav-rep-arrow">→</span>
                </Link>
            </header>

            {/* ═══ HERO SECTION ═══ */}
            <section className="rep-hero">
                <div className="rep-hero-gradient"></div>

                <div className="rep-clipping rep-clipping--1">BREAKING NEWS</div>
                <div className="rep-clipping rep-clipping--2">EXCLUSIVE</div>
                <div className="rep-clipping rep-clipping--3">SCANDAL</div>
                <div className="rep-clipping rep-clipping--4">EXPOSED</div>
                <div className="rep-clipping rep-clipping--5">THE TRUTH</div>

                <div className="rep-hero-container">
                    <div className="rep-titles-box">
                        <div className="rep-glitch-line"></div>
                        <h2 className="rep-subtitle">
                            <span className="rep-subtitle-inner">THERE WILL BE NO EXPLANATION</span>
                        </h2>
                        <h1 className="rep-main-title">
                            THERE WILL
                            <br />
                            JUST BE
                            <br />
                            <span className="rep-title-accent">REPUTATION</span>
                        </h1>
                        <div className="rep-glitch-line"></div>

                        <svg className="rep-title-snake" viewBox="0 0 200 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 15 C20 5, 40 25, 60 15 C80 5, 100 25, 120 15 C140 5, 160 25, 180 15 L200 15"
                                stroke="url(#titleSnakeG)" strokeWidth="1.5" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="titleSnakeG" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="transparent" />
                                    <stop offset="20%" stopColor="#6b8e23" />
                                    <stop offset="80%" stopColor="#c0392b" />
                                    <stop offset="100%" stopColor="transparent" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    <div className="rep-album-display">
                        <div className="rep-album-glow"></div>
                        <div className="rep-album-glow rep-album-glow--accent"></div>
                        <div className="rep-image-frame">
                            <div className="rep-frame-texture"></div>
                            <img
                                src={reputationcover}
                                alt="Reputation Album Cover"
                                className="rep-cover-img"
                            />
                            <svg className="rep-frame-snake" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M0 2 C40 15, 80 -5, 120 8 C160 21, 200 -3, 240 10 C280 23, 320 -1, 360 12 L400 2"
                                    stroke="url(#frameSnakeG)" strokeWidth="1.5" strokeLinecap="round"
                                />
                                <path
                                    d="M400 400 C360 385, 320 405, 280 392 C240 379, 200 403, 160 390 C120 377, 80 401, 40 388 L0 398"
                                    stroke="url(#frameSnakeG2)" strokeWidth="1.5" strokeLinecap="round"
                                />
                                <defs>
                                    <linearGradient id="frameSnakeG" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#6b8e23" stopOpacity="0.6" />
                                        <stop offset="100%" stopColor="#c0392b" stopOpacity="0.6" />
                                    </linearGradient>
                                    <linearGradient id="frameSnakeG2" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#c0392b" stopOpacity="0.6" />
                                        <stop offset="100%" stopColor="#6b8e23" stopOpacity="0.6" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>

                        <div className="rep-album-meta">
                            <span className="rep-meta-date">NOV 10, 2017</span>
                            <span className="rep-meta-divider">|</span>
                            <span className="rep-meta-label">6TH STUDIO ALBUM</span>
                        </div>
                    </div>
                </div>

                <div className="rep-hero-quote-wrapper">
                    <div className="rep-quote-line"></div>
                    <p className="rep-hero-quote">
                        "I'm sorry, the old Taylor can't come to the phone right now..."
                        <span className="rep-quote-highlight"> Why? Oh, 'cause she's dead."</span>
                    </p>
                    <div className="rep-quote-line"></div>
                </div>

                <div className="rep-scroll-indicator">
                    <div className="rep-scroll-line"></div>
                    <span>SCROLL</span>
                </div>
            </section>

            {/* ═══ TRACKLIST SECTION ═══ */}
            <section className={`rep-tracklist-section ${tracklistInView ? 'rep-in-view' : ''}`} ref={tracklistRef}>


                <div className="rep-tracklist-inner">
                    {/* Cabeçalho da seção */}
                    <div className="rep-tracklist-header">
                        <span className="rep-section-label">THE SETLIST</span>
                        <h2 className="rep-tracklist-title">TRACKLIST</h2>
                        <p className="rep-tracklist-subtitle">
                            15 TRACKS · 55:38 MIN · POP / ELECTROPOP
                        </p>
                    </div>

                    {/* Grade principal de tracks */}
                    <div className="rep-tracks-grid">
                        {/* Recorte decorativo de jornal no fundo */}
                        <div className="rep-tracks-newspaper-bg">
                            <span>LOOK WHAT YOU MADE ME DO</span>
                            <span>THE OLD TAYLOR IS DEAD</span>
                            <span>READY FOR IT</span>
                            <span>DELICATE</span>
                            <span>END GAME</span>
                        </div>

                        {tracks.map((track, index) => (
                            <div
                                key={index}
                                className={`rep-track-item ${track.single ? 'is-single' : ''} ${playingTrack === track.name ? 'is-playing' : ''}`}
                                style={{ '--delay': `${index * 0.07}s`, '--track-index': index }}
                            >
                                {/* Efeito shimmer ao hover — luz que passa */}
                                <div className="rep-track-shimmer"></div>

                                {/* Número da track */}
                                <span className="rep-track-number">
                                    {String(index + 1).padStart(2, '0')}
                                </span>

                                {/* Botão play */}
                                <button
                                    className={`rep-track-play ${playingTrack === track.name ? 'active' : ''}`}
                                    onClick={() => handlePlay(track.name)}
                                    aria-label={`Preview ${track.name}`}
                                >
                                    <span className="rep-play-icon">
                                        {playingTrack === track.name ? '■' : '▶'}
                                    </span>
                                    {playingTrack === track.name && (
                                        <div className="rep-sound-wave">
                                            <span></span><span></span><span></span><span></span><span></span>
                                        </div>
                                    )}
                                    {/* Círculo pulsante quando tocando */}
                                    {playingTrack === track.name && (
                                        <div className="rep-play-pulse"></div>
                                    )}
                                </button>

                                {/* Info da track */}
                                <div className="rep-track-info">
                                    <span className="rep-track-name">{track.name}</span>
                                    {track.feat && (
                                        <span className="rep-track-feat">
                                            <span className="rep-feat-dot"></span>
                                            {track.feat}
                                        </span>
                                    )}
                                </div>

                                {/* Tags */}
                                <div className="rep-track-tags">
                                    {track.single && (
                                        <span className="rep-tag-single">
                                            <span className="rep-tag-pulse"></span>
                                            ★ SINGLE
                                        </span>
                                    )}
                                </div>

                                {/* Linha de gradiente lateral ao hover */}
                                <div className="rep-track-glow-line"></div>

                                {/* Fragmento de letra no fundo (apenas singles) */}
                                {track.single && (
                                    <div className="rep-track-lyric-ghost">{track.name}</div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Rodapé da tracklist com stats */}
                    <div className="rep-tracklist-footer">
                        <div className="rep-stat-box">
                            <span className="rep-stat-number">4.5M</span>
                            <span className="rep-stat-label">CÓPIAS VENDIDAS</span>
                        </div>
                        <div className="rep-stat-divider">
                            <svg viewBox="0 0 2 40" width="2" height="40">
                                <line x1="1" y1="0" x2="1" y2="40" stroke="#2a2a2a" strokeWidth="1" />
                            </svg>
                        </div>
                        <div className="rep-stat-box">
                            <span className="rep-stat-number">#1</span>
                            <span className="rep-stat-label">BILLBOARD 200</span>
                        </div>
                        <div className="rep-stat-divider">
                            <svg viewBox="0 0 2 40" width="2" height="40">
                                <line x1="1" y1="0" x2="1" y2="40" stroke="#2a2a2a" strokeWidth="1" />
                            </svg>
                        </div>
                        <div className="rep-stat-box">
                            <span className="rep-stat-number">6</span>
                            <span className="rep-stat-label">SINGLES</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ THE OLD TAYLOR IS DEAD (TIMELINE) ═══ */}
            <section
                className="rep-timeline-section"
                ref={timelineRef}
                style={{
                    '--scroll-progress': timelineProgress,
                    '--theme-blend': `rgba(10, 10, 10, ${timelineProgress})`
                }}
            >
                {/* Dynamic background overlay that darkens based on scroll */}
                <div className="rep-timeline-bg-transition"></div>

                <div className="rep-timeline-container">
                    <div className="rep-timeline-line">
                        <div className="rep-timeline-line-fill" style={{ height: `${timelineProgress * 100}%` }}></div>
                    </div>

                    <div className={`rep-time-item ${timelineProgress > 0.1 ? 'is-active' : ''}`}>
                        <div className="rep-time-dot rep-dot-pastel"></div>
                        <div className="rep-time-content rep-content-pastel">
                            <h3>2014 - 1989 ERA</h3>
                            <p>America's sweetheart. Bright colors, perfect polaroids, and a flawless public image.</p>
                        </div>
                    </div>

                    <div className={`rep-time-item ${timelineProgress > 0.4 ? 'is-active' : ''}`}>
                        <div className="rep-time-dot rep-dot-glitch"></div>
                        <div className="rep-time-content rep-content-glitch">
                            <h3>2016 - THE FALLOUT</h3>
                            <p>The media turns. Overexposure. Edited phone calls. <span className="rep-snake-emoji">🐍</span></p>
                        </div>
                    </div>

                    <div className={`rep-time-item ${timelineProgress > 0.75 ? 'is-active' : ''}`}>
                        <div className="rep-time-dot rep-dot-dark"></div>
                        <div className="rep-time-content rep-content-dark">
                            <h3>2017 - REPUTATION</h3>
                            <p>Blackout. Deleting all social media. "There will be no further explanation."</p>
                        </div>
                    </div>
                </div>

                <div className={`rep-timeline-climax ${timelineProgress > 0.85 ? 'is-revealed' : ''}`}>
                    <h2 className="rep-climax-text">THE OLD TAYLOR CAN'T COME TO THE PHONE.</h2>
                </div>
            </section>

            {/* ═══ NEWSPAPER HEADLINES SECTION ═══ */}
            <section className="rep-headlines-section">
                <div className="rep-headlines-header">
                    <h2 className="rep-headlines-title">THE GOSSIP</h2>
                    <p className="rep-headlines-subtitle">HOVER TO REVEAL THE TRUTH</p>
                </div>

                <div className="rep-headlines-grid">
                    {[
                        {
                            title: "IS SHE PLAYING THE VICTIM?",
                            text: "Sources say the pop star is manipulating the media narrative once again. Friends claim she is orchestrating drama behind the scenes while pretending to be the innocent party.",
                            revealType: "lyric",
                            lyric: "THEY'RE BURNING ALL THE WITCHES"
                        },
                        {
                            title: "SQUAD DIVIDED",
                            text: "Exclusive reports confirm major infighting among her famous friend group. Loyalties are being tested as everyone takes a side in the latest feud that shook the internet.",
                            revealType: "lyric",
                            lyric: "I DON'T TRUST NOBODY AND NOBODY TRUSTS ME"
                        },
                        {
                            title: "THE END OF AN ERA?",
                            text: "After months of absolute silence, insiders whisper that her career is finally over. The public has moved on and there's allegedly no coming back from the latest scandal.",
                            revealType: "lyric",
                            lyric: "MY REPUTATION'S NEVER BEEN WORSE"
                        },
                        {
                            title: "SECRET LOVER REVEALED",
                            text: "Paparazzi catch glimpses of a mysterious new man holding her hand in London. Is this just another PR stunt or the real deal this time? Fans are frantically searching for clues.",
                            revealType: "lyric",
                            lyric: "STARING AT THE CEILING WITH YOU"
                        }
                    ].map((item, index) => (
                        <div key={index} className="rep-headline-card">
                            <div className="rep-headline-front">
                                <h3 className="rep-headline-card-title">{item.title}</h3>
                                <div className="rep-headline-divider"></div>
                                <p className="rep-headline-card-text">{item.text}</p>
                                <span className="rep-headline-readmore">READ FULL STORY ↘</span>
                            </div>

                            <div className={`rep-headline-reveal ${item.revealType === 'lyric' ? 'is-lyric' : 'is-image'}`}>
                                {item.revealType === 'image' ? (
                                    <div className="rep-reveal-image-container">
                                        <img src={item.imgUrl} alt="Truth revealed" className="rep-reveal-img" />
                                        <div className="rep-reveal-glitch-overlay"></div>
                                    </div>
                                ) : (
                                    <div className="rep-reveal-lyric">
                                        "{item.lyric}"
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ SECRET MESSAGES & LYRIC GLITCH SECTION ═══ */}
            <section className="rep-secret-messages-section">
                <div className="rep-secret-bg-text rep-secret-bg-text--1">TAYLOR TAYLOR TAYLOR TAYLOR TAYLOR TAYLOR</div>
                <div className="rep-secret-bg-text rep-secret-bg-text--2">TAYLOR TAYLOR TAYLOR TAYLOR TAYLOR TAYLOR</div>
                <div className="rep-secret-bg-text rep-secret-bg-text--3">TAYLOR TAYLOR TAYLOR TAYLOR TAYLOR TAYLOR</div>
                <div className="rep-secret-bg-text rep-secret-bg-text--4">TAYLOR TAYLOR TAYLOR TAYLOR TAYLOR TAYLOR</div>
                <div className="rep-secret-bg-text rep-secret-bg-text--5">TAYLOR TAYLOR TAYLOR TAYLOR TAYLOR TAYLOR</div>

                <div className="rep-secret-center-content">
                    <h2 className="rep-secret-main-title" data-text="REPUTATION">REPUTATION</h2>
                    <p className="rep-secret-sub">THERE WILL BE NO EXPLANATION.</p>
                </div>
            </section>

            {/* ═══ THE REPUTATION STADIUM TOUR ═══ */}
            <section className="rep-tour-section">
                <div className="rep-tour-content">
                    <div className="rep-tour-header">
                        <h2 className="rep-tour-title">THE REPUTATION STADIUM TOUR</h2>
                        <h3 className="rep-tour-subtitle">THE BIGGEST TOUR IN US HISTORY</h3>
                    </div>

                    <div className="rep-tour-grid">
                        <div className="rep-tour-text-box">
                            <p>
                                A Reputation Stadium Tour não foi apenas um show, foi um espetáculo teatral massivo que redefiniu o que uma turnê pop poderia ser. Com palcos gigantescos, pirotecnia de cair o queixo, e claro, cobras infláveis gigantescas (incluindo a icônica Karyn com mais de 20 metros de altura).
                            </p>
                            <p>
                                A turnê quebrou o recorde de maior arrecadação na história dos Estados Unidos, provando que o silêncio absoluto e o desaparecimento midiático de Taylor culminaram no retorno mais triunfal possível. O palco principal contava com telas de vídeo de 33 metros de altura, criando um castelo digital que se transformava a cada música.
                            </p>
                            <div className="rep-tour-stats">
                                <div className="rep-tour-stat">
                                    <span className="rep-tour-stat-number">53</span>
                                    <span className="rep-tour-stat-label">SHOWS</span>
                                </div>
                                <div className="rep-tour-stat">
                                    <span className="rep-tour-stat-number">2.88M</span>
                                    <span className="rep-tour-stat-label">PÚBLICO</span>
                                </div>
                                <div className="rep-tour-stat">
                                    <span className="rep-tour-stat-number">$345M</span>
                                    <span className="rep-tour-stat-label">ARRECADAÇÃO</span>
                                </div>
                            </div>
                        </div>

                        <div className="rep-tour-video-wrapper">
                            <svg className="rep-tour-snake-bg" viewBox="0 0 500 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M-20 150 C30 50, 100 250, 170 120 C240 -10, 310 280, 380 150 C450 20, 500 200, 540 100"
                                    stroke="url(#tourSnakeG)" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4"
                                />
                                <path
                                    d="M-10 200 C50 100, 120 300, 200 180 C280 60, 350 250, 420 130 C490 10, 530 220, 550 150"
                                    stroke="url(#tourSnakeG2)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.25"
                                />
                                <defs>
                                    <linearGradient id="tourSnakeG" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#6b8e23" stopOpacity="0.6" />
                                        <stop offset="50%" stopColor="#c0392b" stopOpacity="0.8" />
                                        <stop offset="100%" stopColor="#8e44ad" stopOpacity="0.5" />
                                    </linearGradient>
                                    <linearGradient id="tourSnakeG2" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#d4af37" stopOpacity="0.4" />
                                        <stop offset="100%" stopColor="#6b8e23" stopOpacity="0.3" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="rep-tour-video-container">
                                <div className="rep-video-border"></div>
                                <div className="rep-video-border rep-video-border-2"></div>
                                <iframe
                                    src="https://www.youtube.com/embed/HIb_TlK2HAI"
                                    title="reputation Stadium Tour Trailer"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    className="rep-tour-iframe"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ MUSIC VIDEOS CAROUSEL ═══ */}
            <section className="rep-music-videos-section">
                <div className="rep-mv-header">
                    <h2 className="rep-mv-title">THE VISUALS</h2>
                    <p className="rep-mv-subtitle">MUSIC VIDEOS</p>
                </div>

                <div className="rep-mv-slider-wrapper">
                    <button className="rep-mv-arrow rep-mv-arrow--left" onClick={prevMv} aria-label="Previous">
                        <span>‹</span>
                    </button>

                    <div className="rep-mv-slider-viewport">
                        <div
                            className="rep-mv-slider-track"
                            style={{ transform: `translateX(-${activeMv * 100}%)` }}
                        >
                            {musicVideos.map((video, index) => (
                                <div className={`rep-mv-slide ${activeMv === index ? 'is-active' : ''}`} key={index}>
                                    <div className="rep-mv-slide-inner">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${video.id}`}
                                            title={video.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                            className="rep-mv-iframe"
                                        ></iframe>
                                    </div>
                                    <h3 className="rep-mv-slide-title">{video.title}</h3>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className="rep-mv-arrow rep-mv-arrow--right" onClick={nextMv} aria-label="Next">
                        <span>›</span>
                    </button>
                </div>

                <div className="rep-mv-dots">
                    {musicVideos.map((_, index) => (
                        <button
                            key={index}
                            className={`rep-mv-dot ${activeMv === index ? 'is-active' : ''}`}
                            onClick={() => goToMv(index)}
                            aria-label={`Go to video ${index + 1}`}
                        />
                    ))}
                </div>
            </section>

            {/* ═══ ERA GALLERY ═══ */}
            <section className="rep-gallery-section">
                <div className="rep-gallery-header">
                    <h2 className="rep-gallery-title">THE ERA</h2>
                    <p className="rep-gallery-subtitle">GALERIA</p>
                </div>
                <div className="rep-gallery-grid">
                    {[
                        { img: "https://commons.wikimedia.org/wiki/Special:FilePath/Taylor_Swift_-_Reputation_Tour_Seattle_-_End_Game_(cropped).jpg?width=1000", caption: "End Game Live" },
                        { img: "https://commons.wikimedia.org/wiki/Special:FilePath/Taylor_Swift_performing_Fearless_during_Reputation_Stadium_Tour_-_New_Jersey,_2018.jpg?width=1000", caption: "Fearless Performance" },
                        { img: "https://commons.wikimedia.org/wiki/Special:FilePath/Taylor_Swift_performs_Delicate_during_Reputation_Stadium_Tour_in_Minneapolis_-_2018-3.jpg?width=1000", caption: "Delicate Live" },
                        { img: "https://commons.wikimedia.org/wiki/Special:FilePath/Taylor_Swift_Reputation_Tour_stage_in_Minneapolis_2018.jpg?width=1000", caption: "Stadium Stage View" },
                        { img: "https://commons.wikimedia.org/wiki/Special:FilePath/Taylor_Swift_performs_Delicate_during_Taylor_Swift_Reputation_Tour_in_Minneapolis_-_2018.jpg?width=1000", caption: "Minneapolis Show" },
                        { img: "https://commons.wikimedia.org/wiki/Special:FilePath/Taylor_Swift_performs_Delicate_during_Reputation_Stadium_Tour_in_Minneapolis_-_2018-2.jpg?width=1000", caption: "Delicate Performance" },
                        { img: "https://commons.wikimedia.org/wiki/Special:FilePath/Taylor_Swift_-_Reputation_Tour_Seattle_-_Long_Live-New_Years_Day_(cropped).jpg?width=1000", caption: "Long Live / New Year's Day" },
                        { img: "https://commons.wikimedia.org/wiki/Special:FilePath/Taylor_Swift_-_Reputation_Tour_Seattle_-_Look_What_You_Made_Me_Do.jpg?width=1000", caption: "Look What You Made Me Do" },
                        { img: "https://commons.wikimedia.org/wiki/Special:FilePath/Taylor_Swift_-_Reputation_Tour_Seattle_-_Getaway_Car.jpg?width=1000", caption: "Getaway Car Live" },
                        { img: "https://commons.wikimedia.org/wiki/Special:FilePath/Taylor_Swift_Reputation_Tour_Minneapolis_(29461127377).jpg?width=1000", caption: "Minneapolis Stadium" },
                        { img: "https://commons.wikimedia.org/wiki/Special:FilePath/Taylor_Swift_-_Reputation_Tour_Seattle_-_I_Did_Something_Bad_(uncropped).jpg?width=1000", caption: "I Did Something Bad Live" },
                        { img: "https://commons.wikimedia.org/wiki/Special:FilePath/Taylor_Swift_2018.jpg?width=1000", caption: "Reputation Era" }
                    ].map((item, i) => (
                        <div key={i} className="rep-gallery-item">
                            <img src={item.img} alt={item.caption} className="rep-gallery-img" />
                            <div className="rep-gallery-overlay">
                                <span className="rep-gallery-caption">{item.caption}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ NAVEGUE ENTRE AS ERAS ═══ */}
            <section className="rep-eras-section">
                <div className="rep-eras-inner">
                    <span className="rep-eras-label">NAVEGUE</span>
                    <h2 className="rep-eras-title">OUTRAS ERAS</h2>
                    <div className="rep-eras-grid">
                        {[
                            { name: "Taylor Swift", year: "2006", path: "/debut", color: "#50c878" },
                            { name: "Fearless", year: "2008", path: "/fearless", color: "#d4af37" },
                            { name: "Speak Now", year: "2010", path: "/speaknow", color: "#8e44ad" },
                            { name: "Red", year: "2012", path: "/red", color: "#8b0000" },
                            { name: "1989", year: "2014", path: "/1989", color: "#87ceeb" },
                            { name: "Lover", year: "2019", path: "/lover", color: "#ff9ec4" },
                            { name: "Folklore", year: "2020", path: "/folklore", color: "#8a9a8a" },
                            { name: "Evermore", year: "2020", path: "/evermore", color: "#8b4513" },
                            { name: "Midnights", year: "2022", path: "/midnights", color: "#1c1c4b" },
                            { name: "TTPD", year: "2024", path: "/ttpd", color: "#c8a882" },
                            { name: "The Life of a Showgirl", year: "2025", path: "/showgirl", color: "#e46c32" },
                        ].map((era, i) => (
                            <Link key={i} to={era.path} className="rep-era-card" style={{ '--era-accent': era.color }}>
                                <span className="rep-era-year" style={{ color: era.color }}>{era.year}</span>
                                <span className="rep-era-name">{era.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ FOOTER ═══ */}
            <footer className="rep-footer">
                <div className="rep-footer-inner">
                    <p className="rep-footer-logo">reputation</p>
                    <p className="rep-footer-copy">
                        © 2026 · Conteúdo para fins educacionais
                    </p>
                    <div className="rep-footer-links">
                        <a href="https://www.taylorswift.com" target="_blank" rel="noopener noreferrer">Site Oficial</a>
                        <span>·</span>
                        <a href="https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02" target="_blank" rel="noopener noreferrer">Spotify</a>
                        <span>·</span>
                        <a href="https://music.apple.com/us/artist/taylor-swift/159260351" target="_blank" rel="noopener noreferrer">Apple Music</a>
                    </div>
                </div>
            </footer>

            {/* ═══ BACK TO TOP ═══ */}
            {showTopBtn && (
                <button
                    className="rep-top-btn"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    aria-label="Voltar ao topo"
                >
                    ↑
                </button>
            )}

        </main>
    );
};

export default Reputation;