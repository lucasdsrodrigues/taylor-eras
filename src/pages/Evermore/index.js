import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './evermore.css';
import RatingSection from '../../components/RatingSection/RatingSection';
import { eraThemes } from '../../utils/eraThemes';

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

/** Página da era Evermore (2020) — tema outonal, folhas caindo e tons terrosos */
const Evermore = () => {
    const [loaded, setLoaded] = useState(false);
    const [playingTrack, setPlayingTrack] = useState(null);
    const audioRef = useRef(null);
    // Seções observadas individualmente pra animação de entrada
    const [aboutRef, aboutInView] = useInView();
    const [tracklistRef, tracklistInView] = useInView();
    const [detectiveRef, detectiveInView] = useInView();
    const [lyricsRef, lyricsInView] = useInView();
    const [awardsRef, awardsInView] = useInView();
    const [flippedCards, setFlippedCards] = useState({});
    useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);
    const [previews, setPreviews] = useState({});
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('https://itunes.apple.com/search?term=taylor+swift+evermore&entity=song&limit=50&country=US');
                const data = await res.json();
                const map = {};
                data.results?.forEach(r => { if (r.previewUrl && r.trackName) map[r.trackName.toLowerCase()] = r.previewUrl; });
                setPreviews(map);
            } catch (e) { console.error(e); }
        })();
    }, []);
    const findPreview = (name) => {
        const k = name.toLowerCase();
        return previews[k] || Object.entries(previews).find(([p]) => p.includes(k) || k.includes(p))?.[1] || null;
    };
    const handlePlay = useCallback((name) => {
        if (playingTrack === name) { audioRef.current?.pause(); setPlayingTrack(null); return; }
        const url = findPreview(name);
        if (!url) return;
        if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = url; audioRef.current.load(); audioRef.current.play().catch(() => { }); audioRef.current.onended = () => setPlayingTrack(null); }
        setPlayingTrack(name);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playingTrack, previews]);
    const tracks = [
        { name: "willow", single: true },
        { name: "champagne problems", single: true },
        { name: "gold rush", single: false },
        { name: "'tis the damn season", single: false },
        { name: "tolerate it", single: false },
        { name: "no body, no crime", feat: "feat. HAIM", single: true },
        { name: "happiness", single: false },
        { name: "dorothea", single: false },
        { name: "coney island", feat: "feat. The National", single: false },
        { name: "ivy", single: false },
        { name: "cowboy like me", single: false },
        { name: "long story short", single: false },
        { name: "marjorie", single: false },
        { name: "closure", single: false },
        { name: "evermore", feat: "feat. Bon Iver", single: true },
        { name: "right where you left me", bonus: true },
        { name: "it's time to go", bonus: true },
    ];
    const [leaves] = useState(() => Array.from({ length: 25 }, (_, i) => ({
        id: i, left: Math.random() * 100, delay: Math.random() * 15,
        dur: 8 + Math.random() * 10, size: 14 + Math.random() * 16, opacity: 0.1 + Math.random() * 0.2,
        type: ['🍂', '🍁', '🍃'][Math.floor(Math.random() * 3)],
    })));
    const [whispers] = useState(() => [
        "willow", "champagne problems", "ivy", "marjorie", "dorothea", "gold rush",
        "tolerate it", "closure", "happiness", "cowboy like me"
    ].map((w, i) => ({
        text: w, left: 5 + Math.random() * 85, top: 10 + Math.random() * 75,
        delay: Math.random() * 20, dur: 8 + Math.random() * 6,
    })));
    const detectiveCards = [
        { suspect: "Este", detail: "Esposa traída com conexões perigosas", angle: -4 },
        { suspect: "O Marido", detail: "Desapareceu misteriosamente na terça", angle: 3 },
        { suspect: "HAIM", detail: "Cúmplices vistas perto da cena", angle: -2 },
        { suspect: "A Evidência", detail: "Nenhum corpo encontrado. Caso perfeito.", angle: 5 },
    ];
    const lyricCards = [
        { song: "willow", front: "Life was a willow and it bent right to your wind", back: "Sobre seguir o destino até a pessoa certa — uma metáfora sobre a flexibilidade do amor." },
        { song: "champagne problems", front: "She would've made such a lovely bride, what a shame she's f***ed in the head", back: "Uma proposta de casamento rejeitada. A garota diz 'não' porque não consegue aceitar a felicidade." },
        { song: "ivy", front: "My pain fits in the palm of your freezing hand", back: "Um amor proibido — muitos fãs teorizam que é uma história queer de época." },
        { song: "tolerate it", front: "I sit and watch you reading with your head low, I wake and watch you breathing with your eyes closed", back: "O amor não correspondido dentro de um casamento. Inspirado na obra 'Rebecca' de Daphne du Maurier." },
        { song: "marjorie", front: "What died didn't stay dead, you're alive in my head", back: "Dedicada à avó de Taylor, Marjorie Finlay, uma cantora de ópera que faleceu em 2003." },
        { song: "cowboy like me", front: "And the tennis court was covered up with some cheap, local band", back: "Dois golpistas de alta sociedade que acabaram se apaixonando de verdade." },
    ];
    const toggleFlip = (i) => setFlippedCards(prev => ({ ...prev, [i]: !prev[i] }));
    return (
        <main className={`era-ever-page ${loaded ? 'ever-loaded' : ''}`}>
            <audio ref={audioRef} style={{ display: 'none' }} />
            <div className="ever-leaves">
                {leaves.map(l => (
                    <div key={l.id} className="ever-leaf" style={{
                        left: `${l.left}%`, animationDelay: `${l.delay}s`,
                        animationDuration: `${l.dur}s`, fontSize: `${l.size}px`, opacity: l.opacity,
                    }}>{l.type}</div>
                ))}
            </div>
            <div className="ever-whispers">
                {whispers.map((w, i) => (
                    <span key={i} className="ever-whisper" style={{
                        left: `${w.left}%`, top: `${w.top}%`,
                        animationDelay: `${w.delay}s`, animationDuration: `${w.dur}s`,
                    }}>{w.text}</span>
                ))}
            </div>
            <svg className="ever-branch ever-branch--l" viewBox="0 0 200 900" fill="none">
                <path d="M180 0 C120 80, 160 200, 100 300 C40 400, 150 500, 90 650 C30 800, 120 850, 100 900"
                    stroke="url(#eG1)" strokeWidth="2" strokeLinecap="round" opacity="0.25" className="ever-branch-path" />
                <path d="M100 300 C70 340, 50 370, 30 380" stroke="url(#eG1)" strokeWidth="1" opacity="0.15" />
                <circle cx="30" cy="380" r="3" fill="#cc621b" opacity="0.2" />
                <defs><linearGradient id="eG1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7f3c10" /><stop offset="100%" stopColor="#382323" />
                </linearGradient></defs>
            </svg>
            <svg className="ever-branch ever-branch--r" viewBox="0 0 200 900" fill="none">
                <path d="M20 0 C80 100, 40 250, 110 350 C180 450, 60 550, 130 700 C200 850, 80 880, 100 900"
                    stroke="url(#eG2)" strokeWidth="2" strokeLinecap="round" opacity="0.2" className="ever-branch-path" />
                <path d="M110 350 C140 390, 170 400, 180 420" stroke="url(#eG2)" strokeWidth="1" opacity="0.12" />
                <circle cx="180" cy="420" r="2.5" fill="#cc621b" opacity="0.15" />
                <defs><linearGradient id="eG2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#994914" /><stop offset="100%" stopColor="#523211" />
                </linearGradient></defs>
            </svg>
            <header className="ever-nav">
                <Link to="/folklore" className="ever-nav-link"><span>←</span> FOLKLORE</Link>
                <div className="ever-nav-center">
                    <div className="ever-nav-logo">evermore</div>
                </div>
                <Link to="/midnights" className="ever-nav-link">MIDNIGHTS <span>→</span></Link>
            </header>
            <section className="ever-hero">
                <div className="ever-hero-mist"></div>
                <div className="ever-hero-content">
                    <div className="ever-hero-text">
                        <p className="ever-hero-tag">9TH STUDIO ALBUM · DECEMBER 11, 2020</p>
                        <h1 className="ever-hero-title">
                            <span className="ever-hero-title-line">I had a feeling</span>
                            <span className="ever-hero-title-line">so fleeting</span>
                            <span className="ever-hero-title-accent">I couldn't let it get away</span>
                        </h1>
                        <div className="ever-hero-divider">
                            <svg viewBox="0 0 200 10" fill="none"><path d="M0 5 Q50 0, 100 5 Q150 10, 200 5" stroke="rgba(204,98,27,0.4)" strokeWidth="1" /></svg>
                        </div>
                        <p className="ever-hero-quote">
                            "To put it plainly, we just couldn't stop writing songs. I've never done this before."
                        </p>
                    </div>
                    <div className="ever-hero-cover">
                        <div className="ever-cover-glow"></div>
                        <img src="https://static.wikia.nocookie.net/taylor-swift/images/0/07/Evermore2020HQ.jpeg/revision/latest/scale-to-width-down/1000?cb=20240708141904" alt="evermore" className="ever-cover-img" />
                    </div>
                </div>
                <div className="ever-scroll-cue">
                    <div className="ever-scroll-line"></div>
                    <span>entre na floresta</span>
                </div>
            </section>
            <section className={`ever-about ${aboutInView ? 'ever-visible' : ''}`} ref={aboutRef}>
                <div className="ever-about-inner">
                    <div className="ever-about-text">
                        <span className="ever-label">a história por trás</span>
                        <h2 className="ever-section-title">a irmã do folklore</h2>
                        <p>
                            Apenas cinco meses após folklore, Taylor Swift surpreendeu o mundo novamente.
                            <strong> evermore</strong> nasceu da mesma energia criativa — Taylor e Aaron Dessner
                            simplesmente não conseguiam parar de compor.
                        </p>
                        <p>
                            Se folklore era o outono imaginário, evermore é o inverno que o segue. Mais denso,
                            mais sombrio, com narrativas mais complexas. Aqui Taylor explora assassinatos
                            (<strong>no body, no crime</strong>), casamentos fracassados (<strong>champagne problems</strong>),
                            e memórias de sua avó falecida (<strong>marjorie</strong>).
                        </p>
                        <p>
                            Lançado em <strong>11 de dezembro de 2020</strong>, o álbum estreou em #1 na
                            Billboard 200 e consolidou a fase indie folk de Taylor como uma das mais
                            aclamadas de sua carreira.
                        </p>
                    </div>
                    <div className="ever-about-facts">
                        <div className="ever-fact"><span className="ever-fact-icon">🍂</span><span>Álbum irmão do folklore, anunciado de surpresa</span></div>
                        <div className="ever-fact"><span className="ever-fact-icon">🎹</span><span>Produzido por Aaron Dessner & Jack Antonoff</span></div>
                        <div className="ever-fact"><span className="ever-fact-icon">🤝</span><span>Participações: Bon Iver, HAIM, The National</span></div>
                        <div className="ever-fact"><span className="ever-fact-icon">🏆</span><span>Nomeado a 4 Grammys incluindo AOTY</span></div>
                        <div className="ever-fact"><span className="ever-fact-icon">💿</span><span>5× Platina nos Estados Unidos</span></div>
                    </div>
                </div>
            </section>
            <section className={`ever-tracklist ${tracklistInView ? 'ever-visible' : ''}`} ref={tracklistRef}>
                <div className="ever-tracklist-inner">
                    <div className="ever-tracklist-header">
                        <span className="ever-label">os capítulos</span>
                        <h2 className="ever-section-title">tracklist</h2>
                        <p className="ever-sub">17 faixas · 60 minutos · alternative / indie folk</p>
                    </div>
                    <div className="ever-tracks-list">
                        {tracks.map((t, i) => (
                            <div key={i} className={`ever-track ${t.single ? 'is-single' : ''} ${t.bonus ? 'is-bonus' : ''} ${playingTrack === t.name ? 'is-playing' : ''}`} style={{ '--i': i }}>
                                <span className="ever-track-num">{String(i + 1).padStart(2, '0')}</span>
                                <button className={`ever-track-btn ${playingTrack === t.name ? 'active' : ''}`} onClick={() => handlePlay(t.name)}>
                                    <span>{playingTrack === t.name ? '■' : '▶'}</span>
                                    {playingTrack === t.name && <div className="ever-waves"><span /><span /><span /><span /><span /></div>}
                                </button>
                                <div className="ever-track-info">
                                    <span className="ever-track-name">{t.name}</span>
                                    {t.feat && <span className="ever-track-feat">{t.feat}</span>}
                                </div>
                                {t.single && <span className="ever-badge ever-badge--single">SINGLE</span>}
                                {t.bonus && <span className="ever-badge ever-badge--bonus">BONUS</span>}
                            </div>
                        ))}
                    </div>
                    <div className="ever-stats-row">
                        <div className="ever-stat"><span className="ever-stat-val">#1</span><span className="ever-stat-lbl">billboard</span></div>
                        <div className="ever-stat"><span className="ever-stat-val">💿</span><span className="ever-stat-lbl">5× Platina</span></div>
                        <div className="ever-stat"><span className="ever-stat-val">1M+</span><span className="ever-stat-lbl">primeira semana</span></div>
                    </div>
                </div>
            </section>
            <section className={`ever-detective ${detectiveInView ? 'ever-visible' : ''}`} ref={detectiveRef}>
                <div className="ever-detective-inner">
                    <span className="ever-label">investigação</span>
                    <h2 className="ever-section-title">no body, no crime</h2>
                    <p className="ever-sub">feat. HAIM · "She thinks I did it, but she just can't prove it"</p>
                    <div className="ever-detective-board">
                        <svg className="ever-strings" viewBox="0 0 800 300" fill="none">
                            <line x1="150" y1="100" x2="400" y2="50" stroke="#8b0000" strokeWidth="1" opacity="0.4" />
                            <line x1="400" y1="50" x2="650" y2="120" stroke="#8b0000" strokeWidth="1" opacity="0.3" />
                            <line x1="150" y1="100" x2="650" y2="120" stroke="#8b0000" strokeWidth="1" opacity="0.2" />
                            <line x1="400" y1="50" x2="400" y2="250" stroke="#8b0000" strokeWidth="1" opacity="0.35" />
                        </svg>
                        <div className="ever-detective-cards">
                            {detectiveCards.map((c, i) => (
                                <div key={i} className="ever-det-card" style={{ '--angle': `${c.angle}deg`, '--di': i }}>
                                    <div className="ever-det-pin"></div>
                                    <h3 className="ever-det-suspect">{c.suspect}</h3>
                                    <p className="ever-det-detail">{c.detail}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            <section className={`ever-lyrics ${lyricsInView ? 'ever-visible' : ''}`} ref={lyricsRef}>
                <div className="ever-lyrics-inner">
                    <span className="ever-label">letras</span>
                    <h2 className="ever-section-title">vire para descobrir</h2>
                    <p className="ever-sub">Clique em uma carta para revelar o significado</p>
                    <div className="ever-lyrics-grid">
                        {lyricCards.map((card, i) => (
                            <div key={i} className={`ever-flip-card ${flippedCards[i] ? 'is-flipped' : ''}`} onClick={() => toggleFlip(i)} style={{ '--li': i }}>
                                <div className="ever-flip-inner">
                                    <div className="ever-flip-front">
                                        <span className="ever-flip-song">{card.song}</span>
                                        <p className="ever-flip-lyric">"{card.front}"</p>
                                    </div>
                                    <div className="ever-flip-back">
                                        <span className="ever-flip-song">{card.song}</span>
                                        <p className="ever-flip-meaning">{card.back}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className={`ever-awards ${awardsInView ? 'ever-visible' : ''}`} ref={awardsRef}>
                <div className="ever-awards-inner">
                    <span className="ever-label">legacy</span>
                    <h2 className="ever-section-title">prêmios & conquistas</h2>
                    <div className="ever-awards-grid">
                        {[
                            { icon: "🏆", title: "4 Nomeações ao Grammy", desc: "Incluindo Álbum do Ano 2022", highlight: true },
                            { icon: "🥇", title: "#1 Billboard 200", desc: "Estreou no topo na primeira semana" },
                            { icon: "💿", title: "5× Platina", desc: "Certificação nos Estados Unidos" },
                            { icon: "🎵", title: "1.5B+ streams", desc: "'willow' no Spotify" },
                            { icon: "📀", title: "1M+ cópias", desc: "Vendidas na primeira semana nos EUA" },
                            { icon: "🌍", title: "#1 em 67 países", desc: "No iTunes em seu lançamento" },
                        ].map((award, i) => (
                            <div key={i} className={`ever-award-card ${award.highlight ? 'ever-award--hl' : ''}`} style={{ '--ai': i }}>
                                <div className="ever-award-icon">{award.icon}</div>
                                <h3 className="ever-award-name">{award.title}</h3>
                                <p className="ever-award-desc">{award.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="ever-mv-section">
                <div className="ever-mv-inner">
                    <span className="ever-label">clipe</span>
                    <h2 className="ever-section-title">willow</h2>
                    <div className="ever-mv-frame">
                        <iframe
                            src="https://www.youtube.com/embed/RsEZmictANA?rel=0&modestbranding=1&hd=1&vq=hd1080"
                            title="willow — Taylor Swift"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        />
                    </div>
                </div>
            </section>
            <section className="ever-gallery">
                <div className="ever-gallery-inner">
                    <span className="ever-label">galeria</span>
                    <h2 className="ever-section-title">the evermore era</h2>
                    <div className="ever-gallery-grid">
                        {[
                            "https://static.wikia.nocookie.net/taylor-swift/images/e/e0/Evermore_Album_-_Photoshoot32.jpg/revision/latest/scale-to-width-down/1000?cb=20240626165007",
                            "https://static.wikia.nocookie.net/taylor-swift/images/d/d1/2475.JPG/revision/latest/scale-to-width-down/1000?cb=20231111041106",
                            "https://static.wikia.nocookie.net/taylor-swift/images/0/06/Evermore_Album_-_Photoshoot33.jpg/revision/latest/scale-to-width-down/1000?cb=20251209210138",
                            "https://static.wikia.nocookie.net/taylor-swift/images/8/8f/Evermore_Album_-_Photoshoot20.jpg/revision/latest/scale-to-width-down/1000?cb=20240202083004",
                            "https://static.wikia.nocookie.net/taylor-swift/images/a/a4/Evermore_Album_-_Photoshoot30.jpeg/revision/latest/scale-to-width-down/1000?cb=20231230023316",
                            "https://static.wikia.nocookie.net/taylor-swift/images/6/65/Evermore_Album_-_Photoshoot29.jpeg/revision/latest/scale-to-width-down/1000?cb=20231230023340",
                        ].map((src, i) => (
                            <div key={i} className="ever-gallery-item" style={{ '--gi': i }}>
                                <img src={src} alt={`evermore photoshoot ${i + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="ever-eras">
                <span className="ever-label">NAVEGUE</span>
                <h2 className="ever-section-title">outras eras</h2>
                <div className="ever-eras-grid">
                    {[
                        { name: "Taylor Swift", year: "2006", path: "/debut", color: "#50c878" },
                        { name: "Fearless", year: "2008", path: "/fearless", color: "#d4af37" },
                        { name: "Speak Now", year: "2010", path: "/speak-now", color: "#8e44ad" },
                        { name: "Red", year: "2012", path: "/red", color: "#8b0000" },
                        { name: "1989", year: "2014", path: "/1989", color: "#87ceeb" },
                        { name: "Reputation", year: "2017", path: "/reputation", color: "#2d2d2d" },
                        { name: "Lover", year: "2019", path: "/lover", color: "#ff9ec4" },
                        { name: "Folklore", year: "2020", path: "/folklore", color: "#8a9a8a" },
                        { name: "Midnights", year: "2022", path: "/midnights", color: "#1c1c4b" },
                        { name: "TTPD", year: "2024", path: "/ttpd", color: "#c8a882" },
                        { name: "Showgirl", year: "2025", path: "/showgirl", color: "#e46c32" },
                    ].map((e, i) => (
                        <Link key={i} to={e.path} className="ever-era-card" style={{ '--ea': e.color }}>
                            <span className="ever-era-year" style={{ color: e.color }}>{e.year}</span>
                            <span className="ever-era-name">{e.name}</span>
                        </Link>
                    ))}
                </div>
            </section>
            <RatingSection era="evermore" tracks={tracks} theme={eraThemes.evermore} />
            <footer className="ever-footer">
                <div>
                    <p className="ever-footer-logo">evermore</p>
                    <p className="ever-footer-copy">© 2026 · Conteúdo para fins educacionais</p>
                </div>
                <div className="ever-footer-links">
                    <a href="https://www.taylorswift.com" target="_blank" rel="noopener noreferrer">Site Oficial</a>
                    <a href="https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02" target="_blank" rel="noopener noreferrer">Spotify</a>
                    <a href="https://music.apple.com/us/artist/taylor-swift/159260351" target="_blank" rel="noopener noreferrer">Apple Music</a>
                </div>
            </footer>
        </main>
    );
};
export default Evermore;
