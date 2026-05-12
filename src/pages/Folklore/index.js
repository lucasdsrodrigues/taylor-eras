import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './folklore.css';

// Hook reutilizável de IntersectionObserver
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

/** Página da era Folklore (2020) — tema floresta, introspecção e estética indie */
const Folklore = () => {
    const [loaded, setLoaded] = useState(false);
    const [playingTrack, setPlayingTrack] = useState(null);
    const [showTopBtn, setShowTopBtn] = useState(false);
    const audioRef = useRef(null);
    // Cada seção tem seu observer pra animar independentemente quando entra na tela
    const [tracklistRef, tracklistInView] = useInView();
    // triangleRef é a seção do "triângulo do folklore" (conceito do álbum)
    const [triangleRef, triangleInView] = useInView();
    const [deskRef, deskInView] = useInView();
    const [activeMv, setActiveMv] = useState(0);
    const [activeChar, setActiveChar] = useState(null);

    useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);
    useEffect(() => {
        const h = () => setShowTopBtn(window.scrollY > 2000);
        window.addEventListener('scroll', h);
        return () => window.removeEventListener('scroll', h);
    }, []);

    const musicVideos = [
        { id: "K-a8s8OLBSE", title: "cardigan" },
        { id: "o5SQIECedTY", title: "folklore: the long pond studio sessions" },
    ];
    const goToMv = (i) => setActiveMv(i);
    const prevMv = () => goToMv((activeMv - 1 + musicVideos.length) % musicVideos.length);
    const nextMv = () => goToMv((activeMv + 1) % musicVideos.length);

    const [previews, setPreviews] = useState({});
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('https://itunes.apple.com/search?term=taylor+swift+folklore&entity=song&limit=50&country=US');
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
    }, [playingTrack, previews]);

    const tracks = [
        { name: "the 1", single: false },
        { name: "cardigan", single: true },
        { name: "the last great american dynasty", single: false },
        { name: "exile", feat: "feat. Bon Iver", single: true },
        { name: "my tears ricochet", single: false },
        { name: "mirrorball", single: false },
        { name: "seven", single: false },
        { name: "august", single: true },
        { name: "this is me trying", single: false },
        { name: "illicit affairs", single: false },
        { name: "invisible string", single: false },
        { name: "mad woman", single: false },
        { name: "epiphany", single: false },
        { name: "betty", single: true },
        { name: "peace", single: false },
        { name: "hoax", single: false },
        { name: "the lakes", bonus: true, single: false },
    ];

    const [leaves] = useState(() => Array.from({ length: 20 }, (_, i) => ({
        id: i, left: Math.random() * 100, delay: Math.random() * 15,
        dur: 10 + Math.random() * 12, size: 12 + Math.random() * 18, opacity: 0.08 + Math.random() * 0.15,
        type: Math.random() > 0.5 ? '🍃' : '🍂',
    })));

    const characters = [
        {
            id: 'betty', name: 'Betty', song: 'cardigan', icon: '🧶',
            quote: '"When you are young, they assume you know nothing."',
            desc: 'A protagonista silenciosa. Betty foi deixada, mas nunca perdeu a esperança. O cardigan que James esqueceu é a metáfora da memória que nunca some.',
            color: '#8a9a8a',
        },
        {
            id: 'augustine', name: 'Augustine', song: 'august', icon: '☀️',
            quote: '"August slipped away into a moment in time."',
            desc: 'O caso de verão. Augustine viveu tudo intensamente, mas sempre soube que era temporária. Agosto morreu, e ela ficou.',
            color: '#b8a88a',
        },
        {
            id: 'james', name: 'James', song: 'betty', icon: '🎸',
            quote: '"Would you tell me to go f*** myself, or lead me to the garden?"',
            desc: 'O menino que arruinou tudo. James volta com o violão na festa de Betty, implorando por uma segunda chance.',
            color: '#6b7b5e',
        },
    ];

    return (
        <main className={`era-folk-page ${loaded ? 'folk-loaded' : ''}`}>
            <audio ref={audioRef} style={{ display: 'none' }} />
            <div className="folk-grain"></div>

            {/* ═══ FOLHAS ═══ */}
            <div className="folk-leaves">
                {leaves.map(l => (
                    <div key={l.id} className="folk-leaf" style={{
                        left: `${l.left}%`, animationDelay: `${l.delay}s`,
                        animationDuration: `${l.dur}s`, fontSize: `${l.size}px`, opacity: l.opacity,
                    }}>{l.type}</div>
                ))}
            </div>

            {/* ═══ CIPÓS SVG ═══ */}
            <svg className="folk-vine folk-vine--l" viewBox="0 0 200 900" fill="none">
                <path d="M150 0 C100 100, 160 200, 90 300 C20 400, 140 500, 80 600 C20 700, 120 800, 100 900"
                    stroke="url(#vG1)" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
                <circle cx="92" cy="302" r="3" fill="rgba(107,123,94,0.15)" />
                <circle cx="82" cy="602" r="2.5" fill="rgba(184,168,138,0.12)" />
                <defs><linearGradient id="vG1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8a9a8a" /><stop offset="100%" stopColor="#6b7b5e" />
                </linearGradient></defs>
            </svg>
            <svg className="folk-vine folk-vine--r" viewBox="0 0 200 900" fill="none">
                <path d="M50 0 C100 120, 40 240, 110 360 C180 480, 60 600, 120 720 C180 840, 80 880, 100 900"
                    stroke="url(#vG2)" strokeWidth="1.5" strokeLinecap="round" opacity="0.15" />
                <circle cx="112" cy="362" r="2.5" fill="rgba(107,123,94,0.1)" />
                <defs><linearGradient id="vG2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6b7b5e" /><stop offset="100%" stopColor="#b8a88a" />
                </linearGradient></defs>
            </svg>

            {/* ═══ HEADER ═══ */}
            <header className="folk-nav">
                <Link to="/lover" className="folk-nav-link"><span>←</span> LOVER</Link>
                <div className="folk-nav-center">
                    <div className="folk-nav-logo">folklore</div>
                </div>
                <Link to="/evermore" className="folk-nav-link">EVERMORE <span>→</span></Link>
            </header>

            {/* ═══ HERO ═══ */}
            <section className="folk-hero">
                <div className="folk-hero-mist"></div>

                <div className="folk-hero-content">
                    <div className="folk-hero-text">
                        <p className="folk-hero-tag">8TH STUDIO ALBUM · JULY 24, 2020</p>
                        <h1 className="folk-hero-title">
                            <span className="folk-hero-title-line">to live for</span>
                            <span className="folk-hero-title-line">the hope</span>
                            <span className="folk-hero-title-accent">of it all</span>
                        </h1>
                        <div className="folk-hero-divider">
                            <svg viewBox="0 0 200 10" fill="none"><path d="M0 5 Q50 0, 100 5 Q150 10, 200 5" stroke="rgba(107,123,94,0.4)" strokeWidth="1" /></svg>
                        </div>
                        <p className="folk-hero-quote">
                            "I found myself writing from the perspectives of people I'd never met,
                            felt I'd known all along."
                        </p>
                    </div>

                    <div className="folk-hero-cover">
                        <div className="folk-cover-glow"></div>
                        <img src="https://static.wikia.nocookie.net/taylor-swift/images/9/95/Folklore.jpeg/revision/latest/scale-to-width-down/1000?cb=20240707171535" alt="folklore" className="folk-cover-img" />
                    </div>
                </div>

                <div className="folk-scroll-cue">
                    <div className="folk-scroll-cue-line"></div>
                    <span>descubra as histórias</span>
                </div>
            </section>

            {/* ═══ TRACKLIST — CADERNO ═══ */}
            <section className={`folk-tracklist ${tracklistInView ? 'folk-visible' : ''}`} ref={tracklistRef}>
                <div className="folk-tracklist-notebook">
                    <div className="folk-notebook-header">
                        <span className="folk-notebook-label">os capítulos</span>
                        <h2 className="folk-notebook-title">tracklist</h2>
                        <p className="folk-notebook-sub">17 faixas · 63 minutos · alternative / indie folk</p>
                    </div>

                    <div className="folk-notebook-spine"></div>

                    <div className="folk-tracks-list">
                        {tracks.map((t, i) => (
                            <div key={i} className={`folk-track ${t.single ? 'is-single' : ''} ${t.bonus ? 'is-bonus' : ''} ${playingTrack === t.name ? 'is-playing' : ''}`} style={{ '--i': i }}>
                                <span className="folk-track-num">{String(i + 1).padStart(2, '0')}</span>
                                <button className={`folk-track-btn ${playingTrack === t.name ? 'active' : ''}`} onClick={() => handlePlay(t.name)}>
                                    <span>{playingTrack === t.name ? '■' : '▶'}</span>
                                    {playingTrack === t.name && <div className="folk-waves"><span /><span /><span /><span /><span /></div>}
                                </button>
                                <div className="folk-track-info">
                                    <span className="folk-track-name">{t.name}</span>
                                    {t.feat && <span className="folk-track-feat">{t.feat}</span>}
                                </div>
                                {t.single && <span className="folk-badge folk-badge--single">SINGLE</span>}
                                {t.bonus && <span className="folk-badge folk-badge--bonus">BONUS</span>}
                            </div>
                        ))}
                    </div>

                    <div className="folk-stats-row">
                        <div className="folk-stat"><span className="folk-stat-val">2M+</span><span className="folk-stat-lbl">vendas</span></div>
                        <div className="folk-stat"><span className="folk-stat-val">#1</span><span className="folk-stat-lbl">billboard</span></div>
                        <div className="folk-stat"><span className="folk-stat-val">🏆</span><span className="folk-stat-lbl">AOTY</span></div>
                    </div>
                </div>
            </section>

            {/* ═══ THE LOVE TRIANGLE — TEIA INTERATIVA ═══ */}
            <section className={`folk-triangle ${triangleInView ? 'folk-visible' : ''}`} ref={triangleRef}>
                <div className="folk-triangle-header">
                    <span className="folk-notebook-label">a história central</span>
                    <h2 className="folk-triangle-title">o triângulo amoroso</h2>
                    <p className="folk-triangle-sub">Clique em um personagem para conhecer sua perspectiva</p>
                </div>

                <div className="folk-triangle-web">
                    <svg className="folk-triangle-lines" viewBox="0 0 600 400" fill="none">
                        <path d="M300 80 L120 320" stroke="rgba(138,154,138,0.3)" strokeWidth="1" strokeDasharray="6 4" />
                        <path d="M300 80 L480 320" stroke="rgba(184,168,138,0.3)" strokeWidth="1" strokeDasharray="6 4" />
                        <path d="M120 320 L480 320" stroke="rgba(107,123,94,0.3)" strokeWidth="1" strokeDasharray="6 4" />
                        <text x="200" y="180" fill="rgba(107,123,94,0.2)" fontSize="10" fontFamily="Cormorant Garamond" fontStyle="italic">saudade</text>
                        <text x="380" y="180" fill="rgba(184,168,138,0.2)" fontSize="10" fontFamily="Cormorant Garamond" fontStyle="italic">verão</text>
                        <text x="290" y="350" fill="rgba(138,154,138,0.2)" fontSize="10" fontFamily="Cormorant Garamond" fontStyle="italic">arrependimento</text>
                    </svg>

                    <div className="folk-triangle-nodes">
                        {characters.map((c) => (
                            <button
                                key={c.id}
                                className={`folk-char-node folk-char-node--${c.id} ${activeChar === c.id ? 'is-active' : ''}`}
                                onClick={() => setActiveChar(activeChar === c.id ? null : c.id)}
                                style={{ '--char-color': c.color }}
                            >
                                <div className="folk-char-icon">{c.icon}</div>
                                <div className="folk-char-name">{c.name}</div>
                                <div className="folk-char-song">{c.song}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {activeChar && (
                    <div className="folk-char-detail" style={{ '--char-color': characters.find(c => c.id === activeChar)?.color }}>
                        <div className="folk-char-detail-inner">
                            <span className="folk-char-detail-song">{characters.find(c => c.id === activeChar)?.song}</span>
                            <p className="folk-char-detail-quote">{characters.find(c => c.id === activeChar)?.quote}</p>
                            <p className="folk-char-detail-desc">{characters.find(c => c.id === activeChar)?.desc}</p>
                        </div>
                    </div>
                )}
            </section>

            {/* ═══ A MESA DA POETA — SEÇÃO IMERSIVA ═══ */}
            <section className={`folk-desk ${deskInView ? 'folk-visible' : ''}`} ref={deskRef}>
                <div className="folk-desk-bg"></div>
                <div className="folk-desk-content">
                    <h2 className="folk-desk-title">a mesa da poeta</h2>
                    <div className="folk-desk-papers">
                        {[
                            { title: "mirrorball", lyric: "I'm a mirrorball, I'll show you every version of yourself tonight", angle: -5, x: 0, y: 0 },
                            { title: "the lakes", lyric: "Take me to the lakes where all the poets went to die", angle: 3, x: 1, y: 0 },
                            { title: "invisible string", lyric: "Time, mystical time, cutting me open then healing me fine", angle: -2, x: 0, y: 1 },
                            { title: "my tears ricochet", lyric: "And I can go anywhere I want, just not home", angle: 4, x: 1, y: 1 },
                            { title: "seven", lyric: "Please picture me in the trees, I hit my peak at seven", angle: -6, x: 2, y: 0 },
                            { title: "this is me trying", lyric: "I was so ahead of the curve, the curve became a sphere", angle: 2, x: 2, y: 1 },
                        ].map((paper, i) => (
                            <div key={i} className="folk-paper" style={{ '--angle': `${paper.angle}deg`, '--delay': `${i * 0.12}s` }}>
                                <span className="folk-paper-title">{paper.title}</span>
                                <p className="folk-paper-lyric">"{paper.lyric}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ SOBRE O ÁLBUM ═══ */}
            <section className="folk-about">
                <div className="folk-about-inner">
                    <div className="folk-about-text">
                        <span className="folk-notebook-label">a história por trás</span>
                        <h2 className="folk-about-title">nascido em isolamento</h2>
                        <p className="folk-about-p">
                            Em meio à pandemia de 2020, Taylor Swift encontrou refúgio na escrita. Longe dos palcos e das câmeras,
                            ela se voltou para o mundo da ficção — criando personagens, histórias imaginárias e universos
                            inteiros dentro de seu apartamento.
                        </p>
                        <p className="folk-about-p">
                            Com a colaboração de <strong>Aaron Dessner</strong> (The National) e <strong>Jack Antonoff</strong>,
                            folklore foi escrito e gravado inteiramente em segredo. O álbum foi anunciado apenas 16 horas
                            antes de seu lançamento em <strong>24 de julho de 2020</strong> — uma surpresa absoluta para o mundo.
                        </p>
                        <p className="folk-about-p">
                            O resultado foi um álbum de <strong>indie folk alternativo</strong> que rompeu com tudo que Taylor
                            havia feito antes. Sem pop brilhante, sem produção maximalista — apenas histórias cruas contadas
                            através de uma lente cinematográfica e intimista.
                        </p>
                    </div>
                    <div className="folk-about-facts">
                        <div className="folk-fact">
                            <span className="folk-fact-icon">🏠</span>
                            <span className="folk-fact-text">Gravado remotamente durante a quarentena</span>
                        </div>
                        <div className="folk-fact">
                            <span className="folk-fact-icon">🤫</span>
                            <span className="folk-fact-text">Anunciado apenas 16h antes do lançamento</span>
                        </div>
                        <div className="folk-fact">
                            <span className="folk-fact-icon">🎹</span>
                            <span className="folk-fact-text">Produzido por Aaron Dessner & Jack Antonoff</span>
                        </div>
                        <div className="folk-fact">
                            <span className="folk-fact-icon">🌿</span>
                            <span className="folk-fact-text">Primeiro álbum de indie folk/alternative da Taylor</span>
                        </div>
                        <div className="folk-fact">
                            <span className="folk-fact-icon">📖</span>
                            <span className="folk-fact-text">Baseado em personagens fictícios e histórias imaginárias</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ PRÊMIOS & CONQUISTAS ═══ */}
            <section className="folk-awards">
                <div className="folk-awards-header">
                    <span className="folk-notebook-label">legacy</span>
                    <h2 className="folk-awards-title">prêmios & conquistas</h2>
                </div>
                <div className="folk-awards-grid">
                    {[
                        { icon: "🏆", title: "Album of the Year", desc: "Grammy Awards 2021", highlight: true },
                        { icon: "🥇", title: "#1 Billboard 200", desc: "Estreou no topo na primeira semana" },
                        { icon: "💿", title: "2M+ cópias", desc: "Vendidas apenas nos EUA" },
                        { icon: "🎵", title: "846M+ streams", desc: "Apenas em 'cardigan' no Spotify" },
                        { icon: "📀", title: "7× Platina", desc: "Certificação nos Estados Unidos" },
                        { icon: "🌍", title: "#1 em 79 países", desc: "No iTunes em seu lançamento" },
                    ].map((award, i) => (
                        <div key={i} className={`folk-award-card ${award.highlight ? 'folk-award--highlight' : ''}`} style={{ '--ai': i }}>
                            <div className="folk-award-icon">{award.icon}</div>
                            <h3 className="folk-award-name">{award.title}</h3>
                            <p className="folk-award-desc">{award.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ LONG POND STUDIO SESSIONS ═══ */}
            <section className="folk-longpond">
                <div className="folk-longpond-inner">
                    <div className="folk-longpond-video">
                        <div className="folk-longpond-frame">
                            <iframe
                                src="https://www.youtube.com/embed/o5SQIECedTY"
                                title="folklore: the long pond studio sessions"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="folk-longpond-iframe"
                            />
                        </div>
                    </div>
                    <div className="folk-longpond-text">
                        <span className="folk-notebook-label">disney+</span>
                        <h2 className="folk-longpond-title">the long pond studio sessions</h2>
                        <p className="folk-longpond-p">
                            Em novembro de 2020, Taylor se reuniu pela primeira vez com Aaron Dessner e Jack Antonoff
                            no histórico <strong>Long Pond Studio</strong> em Hudson Valley, Nova York — o mesmo estúdio
                            onde grande parte do álbum nasceu remotamente.
                        </p>
                        <p className="folk-longpond-p">
                            O filme, dirigido por Taylor, apresenta performances íntimas de todas as 17 faixas do álbum
                            intercaladas com histórias sobre a criação de cada música. Pela primeira vez, Taylor revelou
                            os significados ocultos, as inspirações reais e os personagens fictícios por trás de cada canção.
                        </p>
                        <div className="folk-longpond-quote">
                            "This is the first time we've ever played these songs together in the same room."
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ MUSIC VIDEOS ═══ */}
            <section className="folk-mv-section">
                <div className="folk-mv-header">
                    <h2 className="folk-mv-title">the visuals</h2>
                    <p className="folk-mv-subtitle">MUSIC VIDEOS</p>
                </div>
                <div className="folk-mv-wrapper">
                    <button className="folk-mv-arrow" onClick={prevMv}>‹</button>
                    <div className="folk-mv-viewport">
                        <div className="folk-mv-track" style={{ transform: `translateX(-${activeMv * 100}%)` }}>
                            {musicVideos.map((v, i) => (
                                <div key={i} className={`folk-mv-slide ${activeMv === i ? 'active' : ''}`}>
                                    <div className="folk-mv-frame">
                                        <iframe src={`https://www.youtube.com/embed/${v.id}`} title={v.title}
                                            frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen className="folk-mv-iframe" />
                                    </div>
                                    <h3 className="folk-mv-name">{v.title}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button className="folk-mv-arrow" onClick={nextMv}>›</button>
                </div>
                <div className="folk-mv-dots">
                    {musicVideos.map((_, i) => (<button key={i} className={`folk-mv-dot ${activeMv === i ? 'active' : ''}`} onClick={() => goToMv(i)} />))}
                </div>
            </section>

            {/* ═══ GALLERY ═══ */}
            <section className="folk-gallery">
                <div className="folk-gallery-header">
                    <h2 className="folk-gallery-title">the era</h2>
                    <p className="folk-gallery-sub">GALERIA</p>
                </div>
                <div className="folk-gallery-grid">
                    <div className="folk-gallery-item"><img src="https://static.wikia.nocookie.net/taylor-swift/images/4/46/Folklore_photoshoot_11.jpeg/revision/latest/scale-to-width-down/1000?cb=20240823230246" alt="Folklore photoshoot" /></div>
                    <div className="folk-gallery-item"><img src="https://static.wikia.nocookie.net/taylor-swift/images/f/f8/2396.JPG/revision/latest/scale-to-width-down/1000?cb=20230803084956" alt="Folklore photoshoot" /></div>
                    <div className="folk-gallery-item"><img src="https://static.wikia.nocookie.net/taylor-swift/images/b/bd/2395.JPG/revision/latest/scale-to-width-down/1000?cb=20230803085145" alt="Folklore photoshoot" /></div>
                    <div className="folk-gallery-item"><img src="https://static.wikia.nocookie.net/taylor-swift/images/2/26/The_lakes_%28original_version%29_-_Single.jpg/revision/latest/scale-to-width-down/1000?cb=20230721030018" alt="Folklore photoshoot" /></div>
                    <div className="folk-gallery-item"><img src="https://static.wikia.nocookie.net/taylor-swift/images/1/1c/Cardigan_cabin_in_candlelight_photoshoot_1.jpeg/revision/latest/scale-to-width-down/1000?cb=20240121214107" alt="Folklore photoshoot" /></div>
                    <div className="folk-gallery-item"><img src="https://static.wikia.nocookie.net/taylor-swift/images/5/5d/Folklore_photoshoot_3.jpeg/revision/latest/scale-to-width-down/1000?cb=20240707224518" alt="Folklore photoshoot" /></div>
                    <div className="folk-gallery-item"><img src="https://static.wikia.nocookie.net/taylor-swift/images/d/d0/Folklore_photoshoot_18.jpg/revision/latest?cb=20260225115529" alt="Folklore photoshoot" /></div>
                    <div className="folk-gallery-item"><img src="https://static.wikia.nocookie.net/taylor-swift/images/7/7f/Folklore_photoshoot_12.jpeg/revision/latest/scale-to-width-down/1000?cb=20231229202006" alt="Folklore photoshoot" /></div>
                </div>
            </section>

            <section className="folk-eras">
                <span className="folk-eras-label">NAVEGUE</span>
                <h2 className="folk-eras-title">outras eras</h2>
                <div className="folk-eras-grid">
                    {[
                        { name: "Taylor Swift", year: "2006", path: "/debut", color: "#50c878" },
                        { name: "Fearless", year: "2008", path: "/fearless", color: "#d4af37" },
                        { name: "Speak Now", year: "2010", path: "/speak-now", color: "#8e44ad" },
                        { name: "Red", year: "2012", path: "/red", color: "#8b0000" },
                        { name: "1989", year: "2014", path: "/1989", color: "#87ceeb" },
                        { name: "Reputation", year: "2017", path: "/reputation", color: "#2d2d2d" },
                        { name: "Lover", year: "2019", path: "/lover", color: "#ff9ec4" },
                        { name: "Evermore", year: "2020", path: "/evermore", color: "#8b4513" },
                        { name: "Midnights", year: "2022", path: "/midnights", color: "#1c1c4b" },
                        { name: "TTPD", year: "2024", path: "/ttpd", color: "#c8a882" },
                        { name: "Showgirl", year: "2025", path: "/showgirl", color: "#e46c32" },
                    ].map((e, i) => (
                        <Link key={i} to={e.path} className="folk-era-card" style={{ '--ea': e.color }}>
                            <span className="folk-era-year" style={{ color: e.color }}>{e.year}</span>
                            <span className="folk-era-name">{e.name}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ═══ FOOTER ═══ */}
            <footer className="folk-footer">
                <div>
                    <p className="folk-footer-logo">folklore</p>
                    <p className="folk-footer-copy">© 2026 · Conteúdo para fins educacionais</p>
                </div>
                <div className="folk-footer-links">
                    <a href="https://www.taylorswift.com" target="_blank" rel="noopener noreferrer">Site Oficial</a>
                    <a href="https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02" target="_blank" rel="noopener noreferrer">Spotify</a>
                    <a href="https://music.apple.com/us/artist/taylor-swift/159260351" target="_blank" rel="noopener noreferrer">Apple Music</a>
                    <button className="folk-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
                </div>
            </footer>
        </main>
    );
};

export default Folklore;