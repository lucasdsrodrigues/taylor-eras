import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './midnights.css';

// Hook reutilizável de IntersectionObserver
const useInView = (options = {}) => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
            { threshold: 0.15, ...options }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return [ref, inView];
};

/** Página da era Midnights (2022) — tema noturno, estrelas e estética lavanda/azul */
const Midnights = () => {
    const [loaded, setLoaded] = useState(false);
    const [playingTrack, setPlayingTrack] = useState(null);
    const [showTopBtn, setShowTopBtn] = useState(false);
    const audioRef = useRef(null);
    const [aboutRef, aboutInView] = useInView();
    const [mayhemRef, mayhemInView] = useInView();
    const [diaryRef, diaryInView] = useInView();
    const [awardsRef, awardsInView] = useInView();
    const [activeMv, setActiveMv] = useState(0);
    const [activeNight, setActiveNight] = useState(0);

    /* Mayhem State */
    const [revealedTracks, setRevealedTracks] = useState([]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [currentBall, setCurrentBall] = useState(null);

    useEffect(() => {
        setTimeout(() => setLoaded(true), 100);
        window.scrollTo(0, 0);

        // Midnights needs a solid black background to avoid index.css paper leak
        document.body.style.backgroundColor = '#000';
        document.body.style.backgroundImage = 'none';

        return () => {
            document.body.style.backgroundColor = '';
            document.body.style.backgroundImage = '';
        };
    }, []);
    useEffect(() => {
        const h = () => setShowTopBtn(window.scrollY > 2000);
        window.addEventListener('scroll', h);
        return () => window.removeEventListener('scroll', h);
    }, []);

    /* iTunes */
    const [previews, setPreviews] = useState({});
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('https://itunes.apple.com/search?term=taylor+swift+midnights&entity=song&limit=50&country=US');
                const data = await res.json();
                const map = {};
                data.results?.forEach(r => { if (r.previewUrl && r.trackName) map[r.trackName.toLowerCase()] = r.previewUrl; });
                setPreviews(map);
            } catch (e) { console.error(e); }
        })();
    }, []);
    const findPreview = (name) => { const k = name.toLowerCase(); return previews[k] || Object.entries(previews).find(([p]) => p.includes(k) || k.includes(p))?.[1] || null; };
    const handlePlay = useCallback((name) => {
        if (playingTrack === name) { audioRef.current?.pause(); setPlayingTrack(null); return; }
        const url = findPreview(name);
        if (!url) return;
        if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = url; audioRef.current.load(); audioRef.current.play().catch(() => { }); audioRef.current.onended = () => setPlayingTrack(null); }
        setPlayingTrack(name);
    }, [playingTrack, previews]);

    const tracks = [
        { num: 1, name: "Lavender Haze", single: true },
        { num: 2, name: "Maroon" },
        { num: 3, name: "Anti-Hero", single: true },
        { num: 4, name: "Snow On The Beach", feat: "feat. Lana Del Rey" },
        { num: 5, name: "You're On Your Own, Kid" },
        { num: 6, name: "Midnight Rain" },
        { num: 7, name: "Question...?" },
        { num: 8, name: "Vigilante Shit" },
        { num: 9, name: "Bejeweled", single: true },
        { num: 10, name: "Labyrinth" },
        { num: 11, name: "Karma", feat: "feat. Ice Spice", single: true },
        { num: 12, name: "Sweet Nothing" },
        { num: 13, name: "Mastermind" },
    ];

    /* Mayhem — reveal one track at a time */
    const spinMayhem = () => {
        if (isSpinning || revealedTracks.length >= 13) return;
        setIsSpinning(true);
        setCurrentBall(null);
        const unrevealed = tracks.filter(t => !revealedTracks.includes(t.num));
        const pick = unrevealed[Math.floor(Math.random() * unrevealed.length)];
        setTimeout(() => {
            setCurrentBall(pick.num);
            setTimeout(() => {
                setRevealedTracks(prev => [...prev, pick.num]);
                setIsSpinning(false);
            }, 1200);
        }, 1500);
    };

    const resetMayhem = () => { setRevealedTracks([]); setCurrentBall(null); setIsSpinning(false); };
    const revealAll = () => { setRevealedTracks(tracks.map(t => t.num)); setCurrentBall(null); setIsSpinning(false); };

    const [sparkles] = useState(() => Array.from({ length: 80 }, (_, i) => ({
        id: i, left: Math.random() * 100, delay: Math.random() * 20,
        dur: 3 + Math.random() * 5, size: 4 + Math.random() * 12,
        type: Math.random() > 0.5 ? '✦' : '✧',
    })));

    const musicVideos = [
        { id: "b7QlX3yR2xs", title: "Bejeweled" },
        { id: "h8DLofLM7No", title: "Lavender Haze" },
        { id: "b1kbLwvqugk", title: "Anti-Hero" },
        { id: "XzOvgu3GPwY", title: "Karma" },
    ];
    const prevMv = () => setActiveMv((activeMv - 1 + musicVideos.length) % musicVideos.length);
    const nextMv = () => setActiveMv((activeMv + 1) % musicVideos.length);

    const nights = [
        { n: 1, song: "Lavender Haze", theme: "Proteção", lyric: "I've been under scrutiny, you handle it beautifully" },
        { n: 2, song: "Maroon", theme: "Memória", lyric: "The burgundy on my t-shirt when you splashed your wine into me" },
        { n: 3, song: "Anti-Hero", theme: "Autoestima", lyric: "It's me, hi, I'm the problem, it's me" },
        { n: 4, song: "Snow On The Beach", theme: "Encantamento", lyric: "I saw flecks of what could've been lights, but it might just have been you" },
        { n: 5, song: "You're On Your Own, Kid", theme: "Crescimento", lyric: "From sprinkler splashes to fireplace ashes, I gave my blood, sweat, and tears for this" },
        { n: 6, song: "Midnight Rain", theme: "Ambição", lyric: "He wanted it comfortable, I wanted that pain" },
        { n: 7, song: "Question...?", theme: "Dúvida", lyric: "Did you ever have someone kiss you in a crowded room?" },
        { n: 8, song: "Vigilante Shit", theme: "Vingança", lyric: "Don't get sad, get even" },
        { n: 9, song: "Bejeweled", theme: "Autoconfiança", lyric: "Best believe I'm still bejeweled when I walk in the room" },
        { n: 10, song: "Labyrinth", theme: "Medo", lyric: "It only hurts this much right now, was what I was thinking the whole time" },
        { n: 11, song: "Karma", theme: "Justiça", lyric: "Karma is a cat purring in my lap 'cause it loves me" },
        { n: 12, song: "Sweet Nothing", theme: "Refúgio", lyric: "On the way home I wrote a poem, you say 'what a mind'" },
        { n: 13, song: "Mastermind", theme: "Controle", lyric: "What if I told you I'm a mastermind? And now you're mine" },
    ];

    const galleryImages = [
        "https://static.wikia.nocookie.net/taylor-swift/images/6/60/Midnights-Shoot-13.JPG/revision/latest/scale-to-width-down/1000?cb=20240201180836",
        "https://static.wikia.nocookie.net/taylor-swift/images/f/fe/Midnights-Shoot-41.JPG/revision/latest/scale-to-width-down/1000?cb=20230106101347",
        "https://static.wikia.nocookie.net/taylor-swift/images/6/6b/Midnights-Shoot-14.jpg/revision/latest/scale-to-width-down/1000?cb=20221021191016",
        "https://static.wikia.nocookie.net/taylor-swift/images/2/2d/Midnights-Shoot-39.jpg/revision/latest/scale-to-width-down/1000?cb=20240202160721",
        "https://static.wikia.nocookie.net/taylor-swift/images/0/0c/Midnights-SHoot-23.jpeg/revision/latest/scale-to-width-down/1000?cb=20221021191751",
        "https://static.wikia.nocookie.net/taylor-swift/images/7/7e/Midnights-Shoot-6.jpg/revision/latest/scale-to-width-down/1000?cb=20240202161503",
        "https://static.wikia.nocookie.net/taylor-swift/images/8/88/Midnights-Shoot-25.jpeg/revision/latest/scale-to-width-down/1000?cb=20250426102348",
        "https://static.wikia.nocookie.net/taylor-swift/images/4/4a/Midnights-Shoot-15.jpg/revision/latest/scale-to-width-down/1000?cb=20221021190737",
        "https://static.wikia.nocookie.net/taylor-swift/images/7/76/Midnights-Shoot-33.jpeg/revision/latest/scale-to-width-down/1000?cb=20250415222812",
        "https://static.wikia.nocookie.net/taylor-swift/images/6/6b/Midnights-Shoot-44.jpeg/revision/latest/scale-to-width-down/1000?cb=20240405120810",
    ];

    return (
        <main className={`era-mid-page ${loaded ? 'mid-loaded' : ''}`}>
            <audio ref={audioRef} style={{ display: 'none' }} />

            {/* ═══ SPARKLES ═══ */}
            <div className="mid-sparkles">
                {sparkles.map(s => (
                    <span key={s.id} className="mid-sparkle" style={{
                        left: `${s.left}%`, animationDelay: `${s.delay}s`,
                        animationDuration: `${s.dur}s`, fontSize: `${s.size}px`,
                    }}>{s.type}</span>
                ))}
            </div>

            {/* ═══ LAVENDER HAZE ═══ */}
            <div className="mid-haze"></div>
            <div className="mid-haze mid-haze--2"></div>

            {/* ═══ CLOCKS SVG ═══ */}
            <svg className="mid-clock mid-clock--l" viewBox="0 0 120 600" fill="none">
                <circle cx="60" cy="100" r="50" stroke="rgba(90,106,255,0.35)" strokeWidth="1.5" />
                <circle cx="60" cy="100" r="40" stroke="rgba(139,92,246,0.2)" strokeWidth="0.8" />
                {[...Array(12)].map((_, i) => {
                    const a = (i * 30 - 90) * Math.PI / 180;
                    return <circle key={i} cx={60 + 44 * Math.cos(a)} cy={100 + 44 * Math.sin(a)} r="2" fill="rgba(90,106,255,0.5)" />;
                })}
                <line x1="60" y1="100" x2="60" y2="62" stroke="rgba(139,92,246,0.6)" strokeWidth="2" strokeLinecap="round" className="mid-clock-min" />
                <line x1="60" y1="100" x2="60" y2="70" stroke="rgba(90,106,255,0.5)" strokeWidth="2.5" strokeLinecap="round" className="mid-clock-hour" />
                <circle cx="60" cy="100" r="3.5" fill="rgba(90,106,255,0.6)" />
                <text x="60" y="170" textAnchor="middle" fill="rgba(90,106,255,0.2)" fontSize="8" fontFamily="monospace" letterSpacing="3">3:00 AM</text>
                <line x1="60" y1="190" x2="60" y2="580" stroke="rgba(90,106,255,0.08)" strokeWidth="1" strokeDasharray="4 8" />
            </svg>

            <svg className="mid-clock mid-clock--r" viewBox="0 0 120 600" fill="none">
                <circle cx="60" cy="120" r="45" stroke="rgba(139,92,246,0.3)" strokeWidth="1.5" />
                <circle cx="60" cy="120" r="35" stroke="rgba(90,106,255,0.15)" strokeWidth="0.8" />
                {[...Array(12)].map((_, i) => {
                    const a = (i * 30 - 90) * Math.PI / 180;
                    return <circle key={i} cx={60 + 39 * Math.cos(a)} cy={120 + 39 * Math.sin(a)} r="1.8" fill="rgba(139,92,246,0.4)" />;
                })}
                <line x1="60" y1="120" x2="60" y2="85" stroke="rgba(90,106,255,0.5)" strokeWidth="2" strokeLinecap="round" className="mid-clock-min mid-clock-min--r" />
                <line x1="60" y1="120" x2="60" y2="90" stroke="rgba(139,92,246,0.4)" strokeWidth="2.5" strokeLinecap="round" className="mid-clock-hour mid-clock-hour--r" />
                <circle cx="60" cy="120" r="3" fill="rgba(139,92,246,0.5)" />
                <text x="60" y="185" textAnchor="middle" fill="rgba(139,92,246,0.15)" fontSize="7" fontFamily="monospace" letterSpacing="3">INSOMNIA</text>
                <line x1="60" y1="200" x2="60" y2="580" stroke="rgba(139,92,246,0.06)" strokeWidth="1" strokeDasharray="3 10" />
            </svg>

            {/* ═══ NAV ═══ */}
            <header className="mid-nav">
                <Link to="/evermore" className="mid-nav-link"><span>←</span> EVERMORE</Link>
                <div className="mid-nav-logo">Midnights</div>
                <Link to="/ttpd" className="mid-nav-link">TTPD <span>→</span></Link>
            </header>

            {/* ═══ HERO — CENTERED CINEMATIC ═══ */}
            <section className="mid-hero">
                <div className="mid-hero-centered">
                    <p className="mid-hero-tag">10TH STUDIO ALBUM · OCTOBER 21, 2022</p>
                    <div className="mid-hero-cover-wrap">
                        <div className="mid-cover-glow"></div>
                        <div className="mid-cover-glow mid-cover-glow--purple"></div>
                        <img src="https://static.wikia.nocookie.net/taylor-swift/images/5/5c/Midnights.jpeg/revision/latest/scale-to-width-down/1000?cb=20240405141418" alt="Midnights" className="mid-cover-img" />
                    </div>
                    <h1 className="mid-hero-title">
                        <span className="mid-title-sub">meet me at</span>
                        <span className="mid-title-main">Midnights</span>
                    </h1>
                    <p className="mid-hero-quote">
                        "This is a collection of music written in the middle of the night,
                        a journey through terrors and sweet dreams."
                    </p>
                    <div className="mid-hero-stats">
                        <div className="mid-hstat"><span className="mid-hstat-val">#1</span><span className="mid-hstat-lbl">Billboard</span></div>
                        <div className="mid-hstat-div"></div>
                        <div className="mid-hstat"><span className="mid-hstat-val">🏆</span><span className="mid-hstat-lbl">AOTY</span></div>
                        <div className="mid-hstat-div"></div>
                        <div className="mid-hstat"><span className="mid-hstat-val">6M+</span><span className="mid-hstat-lbl">1ª Semana</span></div>
                    </div>
                </div>
                <div className="mid-scroll-cue">
                    <div className="mid-scroll-line"></div>
                    <span>13 noites sem dormir</span>
                </div>
            </section>

            {/* ═══ ABOUT — SPLIT ASYMMETRIC ═══ */}
            <section className={`mid-about ${aboutInView ? 'mid-visible' : ''}`} ref={aboutRef}>
                <div className="mid-about-inner">
                    <div className="mid-about-text">
                        <span className="mid-label">a história</span>
                        <h2 className="mid-section-title">13 noites sem dormir</h2>
                        <p>
                            <strong>Midnights</strong> nasceu das insônias de Taylor Swift — 13 noites
                            que se transformaram em 13 canções. Cada faixa explora os pensamentos que surgem
                            quando o mundo dorme: medos, fantasias, memórias dolorosas e sonhos.
                        </p>
                        <p>
                            Produzido por <strong>Jack Antonoff</strong>, o álbum combina synth-pop atmosférico
                            com letras intimistas. Lançado em <strong>21 de outubro de 2022</strong>, quebrou
                            recordes históricos do Spotify e da Billboard, tornando-se o álbum mais vendido do ano.
                        </p>
                    </div>
                    <div className="mid-about-facts">
                        <div className="mid-fact"><span>🌙</span><span>13 faixas + 7 vault tracks</span></div>
                        <div className="mid-fact"><span>🎹</span><span>Produzido por Jack Antonoff</span></div>
                        <div className="mid-fact"><span>📱</span><span>"Midnights Mayhem" no TikTok</span></div>
                        <div className="mid-fact"><span>🏆</span><span>4 Grammys incluindo AOTY</span></div>
                        <div className="mid-fact"><span>💎</span><span>Mais vendido de 2022</span></div>
                    </div>
                </div>
            </section>

            {/* ═══ MIDNIGHTS MAYHEM WITH ME — BINGO ═══ */}
            <section className={`mid-mayhem ${mayhemInView ? 'mid-visible' : ''}`} ref={mayhemRef}>
                <div className="mid-mayhem-inner">
                    <span className="mid-label">midnights mayhem with me</span>
                    <h2 className="mid-section-title">a máquina de bingo</h2>
                    <p className="mid-sub">Gire a máquina para revelar as faixas uma por uma, como Taylor fez no TikTok!</p>

                    <div className="mid-mayhem-machine">
                        {/* Bingo Machine */}
                        <div className={`mid-bingo-machine ${isSpinning ? 'is-spinning' : ''}`}>
                            <div className="mid-bingo-top">
                                <div className="mid-bingo-cage">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(n => (
                                        <div key={n} className={`mid-cage-ball ${revealedTracks.includes(n) ? 'used' : ''}`}>{n}</div>
                                    ))}
                                </div>
                            </div>
                            <div className="mid-bingo-slot">
                                <div className="mid-bingo-tube"></div>
                            </div>
                        </div>

                        {/* Chute */}
                        <div className="mid-bingo-chute">
                            {currentBall && (
                                <div className="mid-chute-ball" key={currentBall}>
                                    <span className="mid-chute-num">{currentBall}</span>
                                    <span className="mid-chute-name">{tracks.find(t => t.num === currentBall)?.name}</span>
                                </div>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="mid-mayhem-controls">
                            <button className="mid-spin-btn" onClick={spinMayhem}
                                disabled={isSpinning || revealedTracks.length >= 13}>
                                {isSpinning ? 'Girando...' : revealedTracks.length >= 13 ? 'Todas reveladas!' : `Girar (${revealedTracks.length}/13)`}
                            </button>
                            {revealedTracks.length < 13 && (
                                <button className="mid-reveal-all-btn" onClick={revealAll}>Revelar tudo</button>
                            )}
                            {revealedTracks.length > 0 && (
                                <button className="mid-reset-btn" onClick={resetMayhem}>Recomeçar</button>
                            )}
                        </div>
                    </div>

                    {/* Revealed tracklist */}
                    <div className="mid-mayhem-revealed">
                        {tracks.map((t, i) => (
                            <div key={i} className={`mid-mayhem-track ${revealedTracks.includes(t.num) ? 'revealed' : ''}`}>
                                <span className="mid-mt-num">{String(t.num).padStart(2, '0')}</span>
                                <button className={`mid-mt-play ${playingTrack === t.name ? 'active' : ''}`}
                                    onClick={() => handlePlay(t.name)} disabled={!revealedTracks.includes(t.num)}>
                                    {playingTrack === t.name ? '■' : '▶'}
                                </button>
                                <span className="mid-mt-name">
                                    {revealedTracks.includes(t.num) ? t.name : '? ? ?'}
                                </span>
                                {t.feat && revealedTracks.includes(t.num) && <span className="mid-mt-feat">{t.feat}</span>}
                                {t.single && revealedTracks.includes(t.num) && <span className="mid-mt-badge">SINGLE</span>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ 13 NOITES — DIÁRIO ═══ */}
            <section className={`mid-diary ${diaryInView ? 'mid-visible' : ''}`} ref={diaryRef}>
                <div className="mid-diary-inner">
                    <span className="mid-label">o diário</span>
                    <h2 className="mid-section-title">as noites sem dormir</h2>

                    <div className="mid-diary-tabs">
                        {nights.map((n, i) => (
                            <button key={i} className={`mid-diary-ball ${i === activeNight ? 'active' : ''}`}
                                onClick={() => setActiveNight(i)}>{n.n}</button>
                        ))}
                    </div>

                    <div className="mid-diary-card" key={activeNight}>
                        <div className="mid-diary-header">
                            <span className="mid-diary-night">noite {nights[activeNight].n} de 13</span>
                            <span className="mid-diary-theme">{nights[activeNight].theme}</span>
                        </div>
                        <h3 className="mid-diary-song">{nights[activeNight].song}</h3>
                        <blockquote className="mid-diary-lyric">"{nights[activeNight].lyric}"</blockquote>
                    </div>
                </div>
            </section>

            {/* ═══ AWARDS ═══ */}
            <section className={`mid-awards ${awardsInView ? 'mid-visible' : ''}`} ref={awardsRef}>
                <div className="mid-awards-inner">
                    <span className="mid-label">legacy</span>
                    <h2 className="mid-section-title">prêmios & conquistas</h2>
                    <div className="mid-awards-grid">
                        {[
                            { icon: "🏆", title: "Album of the Year", desc: "Grammy Awards 2024", hl: true },
                            { icon: "🥇", title: "#1 Billboard 200", desc: "6 semanas consecutivas no topo" },
                            { icon: "💎", title: "Mais vendido de 2022", desc: "No mundo inteiro" },
                            { icon: "🎵", title: "1.6B+ streams", desc: "'Anti-Hero' no Spotify" },
                            { icon: "📀", title: "6M+ cópias", desc: "Vendidas na primeira semana global" },
                            { icon: "🌍", title: "#1 em 92 países", desc: "No iTunes em seu lançamento" },
                        ].map((a, i) => (
                            <div key={i} className={`mid-award-card ${a.hl ? 'mid-award--hl' : ''}`} style={{ '--ai': i }}>
                                <div className="mid-award-icon">{a.icon}</div>
                                <h3 className="mid-award-name">{a.title}</h3>
                                <p className="mid-award-desc">{a.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ MUSIC VIDEOS ═══ */}
            <section className="mid-mv-section">
                <div className="mid-mv-inner">
                    <span className="mid-label">clipes</span>
                    <h2 className="mid-section-title">the visuals</h2>
                    <div className="mid-mv-wrapper">
                        <button className="mid-mv-arrow" onClick={prevMv}>‹</button>
                        <div className="mid-mv-viewport">
                            <div className="mid-mv-track" style={{ transform: `translateX(-${activeMv * 100}%)` }}>
                                {musicVideos.map((v, i) => (
                                    <div key={i} className="mid-mv-slide">
                                        <div className="mid-mv-frame">
                                            <iframe src={`https://www.youtube.com/embed/${v.id}?rel=0&modestbranding=1&hd=1&vq=hd1080`} title={v.title}
                                                frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
                                        </div>
                                        <h3 className="mid-mv-name">{v.title}</h3>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button className="mid-mv-arrow" onClick={nextMv}>›</button>
                    </div>
                    <div className="mid-mv-dots">
                        {musicVideos.map((_, i) => (<button key={i} className={`mid-mv-dot ${activeMv === i ? 'active' : ''}`} onClick={() => setActiveMv(i)} />))}
                    </div>
                </div>
            </section>

            {/* ═══ GALLERY — HORIZONTAL SCROLL ═══ */}
            <section className="mid-gallery">
                <div className="mid-gallery-header">
                    <span className="mid-label">galeria</span>
                    <h2 className="mid-section-title">the midnights era</h2>
                </div>
                <div className="mid-gallery-scroll">
                    <div className="mid-gallery-track">
                        {galleryImages.map((src, i) => (
                            <div key={i} className="mid-gallery-item" style={{ '--gi': i }}>
                                <div className="mid-gallery-shine"></div>
                                <img src={src} alt={`Midnights ${i + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ ERAS NAV ═══ */}
            <section className="mid-eras">
                <span className="mid-label">NAVEGUE</span>
                <h2 className="mid-section-title">outras eras</h2>
                <div className="mid-eras-grid">
                    {[
                        { name: "Taylor Swift", year: "2006", path: "/debut", color: "#50c878" },
                        { name: "Fearless", year: "2008", path: "/fearless", color: "#d4af37" },
                        { name: "Speak Now", year: "2010", path: "/speak-now", color: "#8e44ad" },
                        { name: "Red", year: "2012", path: "/red", color: "#8b0000" },
                        { name: "1989", year: "2014", path: "/1989", color: "#87ceeb" },
                        { name: "Reputation", year: "2017", path: "/reputation", color: "#2d2d2d" },
                        { name: "Lover", year: "2019", path: "/lover", color: "#ff9ec4" },
                        { name: "Folklore", year: "2020", path: "/folklore", color: "#8a9a8a" },
                        { name: "Evermore", year: "2020", path: "/evermore", color: "#cc621b" },
                        { name: "TTPD", year: "2024", path: "/ttpd", color: "#c8a882" },
                        { name: "Showgirl", year: "2025", path: "/showgirl", color: "#e46c32" },
                    ].map((e, i) => (
                        <Link key={i} to={e.path} className="mid-era-card" style={{ '--ea': e.color }}>
                            <span className="mid-era-year" style={{ color: e.color }}>{e.year}</span>
                            <span className="mid-era-name">{e.name}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ═══ FOOTER ═══ */}
            <footer className="mid-footer">
                <div>
                    <p className="mid-footer-logo">Midnights</p>
                    <p className="mid-footer-copy">© 2026 · Conteúdo para fins educacionais</p>
                </div>
                <div className="mid-footer-links">
                    <a href="https://www.taylorswift.com" target="_blank" rel="noopener noreferrer">Site Oficial</a>
                    <a href="https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02" target="_blank" rel="noopener noreferrer">Spotify</a>
                    <a href="https://music.apple.com/us/artist/taylor-swift/159260351" target="_blank" rel="noopener noreferrer">Apple Music</a>
                    <button className="mid-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
                </div>
            </footer>
        </main>
    );
};

export default Midnights;