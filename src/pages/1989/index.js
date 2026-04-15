import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './1989.css';

// Saindo de pages/1989 (../..) e entrando em imagens/
import coverOriginal from '../../imagens/1989cover.webp';
import coverTV from '../../imagens/1989TV_Cover.webp';

const NineteenEightyNine = () => {
    const [isTV, setIsTV] = useState(false);
    const [showTopBtn, setShowTopBtn] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

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

    // Seagulls effect
    useEffect(() => {
        let active = true;
        const launchSeagulls = () => {
            if (!active) return;
            
            const amount = 3;
            for (let i = 0; i < amount; i++) {
                setTimeout(() => {
                    if (!active) return;
                    const seagull = document.createElement('div');
                    seagull.className = 'seagull-fly';
                    seagull.style.left = '-5vw';
                    seagull.style.top = (Math.random() * 40 + 5) + 'vh';
                    const sizeScale = Math.random() * 0.5 + 0.5;
                    
                    document.body.appendChild(seagull);
                    
                    const animation = seagull.animate([
                        { transform: `translateX(0) translateY(0) scale(${sizeScale})`, opacity: 0 },
                        { opacity: 0.8, offset: 0.1 },
                        { opacity: 0.8, offset: 0.9 },
                        { transform: `translateX(110vw) translateY(${Math.random() * 200 - 100}px) scale(${sizeScale})`, opacity: 0 }
                    ], { duration: Math.random() * 10000 + 15000, easing: 'linear' });
                    
                    animation.onfinish = () => { if (document.body.contains(seagull)) seagull.remove(); };
                }, i * 2000);
            }
        };
        
        launchSeagulls();
        const interval = setInterval(launchSeagulls, 8000);
        
        return () => {
            active = false;
            clearInterval(interval);
            document.querySelectorAll('.seagull-fly').forEach(s => s.remove());
        };
    }, []);

    const audioRef = useRef(null);
    const tracklistRef = useRef(null);
    const timelineRef = useRef(null);
    const clipScrollRef = useRef(null);

    const scrollClips = (dir) => {
        if (clipScrollRef.current) {
            const w = clipScrollRef.current.offsetWidth;
            clipScrollRef.current.scrollBy({ left: dir === 'left' ? -w : w, behavior: 'smooth' });
        }
    };

    const [playingTrack, setPlayingTrack] = useState(null);
    const [previews, setPreviews] = useState({});

    // New States
    const [vaultOpened, setVaultOpened] = useState(false);

    // Decoder State
    const secretMessageText = "We bEgan Looking for Clues Out of town, Mostly nEar The Ocean. Nobody Expected What You fOund in the daRK.";
    const [foundIndexes, setFoundIndexes] = useState([]);
    const totalSecretLetters = secretMessageText.split('').filter(c => c.match(/[A-Z]/)).length;

    const handleLetterClick = (char, index) => {
        if (char.match(/[A-Z]/) && !foundIndexes.includes(index)) {
            setFoundIndexes([...foundIndexes, index]);
        }
    };

    // Video State
    const [activeVideo, setActiveVideo] = useState(null);

    const musicVideos = [
        { title: "Shake It Off", year: "2014", youtubeId: "nfWlot6h_JM", desc: "Lead single — The video that changed pop" },
        { title: "Blank Space", year: "2014", youtubeId: "e-ORhEE9VVg", desc: "3B+ views — Most iconic MV of the era" },
        { title: "Bad Blood", year: "2015", youtubeId: "QcIy9NiNbmo", desc: "ft. Kendrick Lamar — Action-packed visual" },
        { title: "Wildest Dreams", year: "2015", youtubeId: "IdneKLhsWOQ", desc: "Cinematic Africa-set visual masterpiece" },
        { title: "Style", year: "2015", youtubeId: "-CmadmM5cOk", desc: "Aesthetic and artistic — Fan favorite" },
        { title: "Out Of The Woods", year: "2016", youtubeId: "JLf9q36UsBk", desc: "Nature-themed visual journey" },
        { title: "New Romantics", year: "2016", youtubeId: "wyK7YuwUWsU", desc: "Tour footage turned into iconic MV" },
    ];

    const galleryScrollRef = useRef(null);

    // Gallery uses thumbnails from DIFFERENT videos (Eras Tour 1989 set, lyric videos, acoustic versions, etc.)
    const galleryItems = [
        { img: "https://commons.wikimedia.org/wiki/Special:FilePath/Taylor_Swift_-_1989_Tour_Singapore_-_Style_(23409003734).jpg?width=800", caption: "The 1989 World Tour — Singapore" },
        { img: "https://commons.wikimedia.org/wiki/Special:FilePath/Taylor_Swift_-_1989_World_Tour.jpg?width=800", caption: "Welcome to New York" },
        { img: "https://commons.wikimedia.org/wiki/Special:FilePath/Taylor_Swift_-_The_1989_World_Tour_-_SANTA_CLARA_-_Out_of_the_Woods.jpg?width=800", caption: "Out of the Woods Live" },
        { img: "https://commons.wikimedia.org/wiki/Special:FilePath/Taylor_Swift_performs_in_Houston_-_1989_World_Tour.jpg?width=800", caption: "Toyota Center — Houston" },
        { img: "https://commons.wikimedia.org/wiki/Special:FilePath/Taylor_Swift_-_The_1989_World_Tour_-_Whole_view_of_the_stage_(crop).jpg?width=800", caption: "1989 World Tour Stage" },
        { img: "https://commons.wikimedia.org/wiki/Special:FilePath/Taylor_Swift_onstage_Ford_Field_in_Detroit_-_The_1989_World_Tour.png?width=800", caption: "Ford Field — Detroit" },
        { img: "https://commons.wikimedia.org/wiki/Special:FilePath/Taylor_Swift_AAMI_Park_20151212_01.jpg?width=800", caption: "Melbourne — Australia" },
        { img: "https://commons.wikimedia.org/wiki/Special:FilePath/Taylor_Swift_-_The_1989_World_Tour_-_Whole_view_of_the_stage_before_the_show.jpg?width=800", caption: "1989 World Tour Magic" },
        { img: "https://commons.wikimedia.org/wiki/Special:FilePath/Taylor_Swift_Songbook_Trail_1989_Tour_ensemble_01.jpg?width=800", caption: "1989 Ensemble" },
        { img: "https://commons.wikimedia.org/wiki/Special:FilePath/Taylor_Swift_-_ANZ_Stadium_Concert_1989_World_Tour_(23928940022).jpg?width=800", caption: "ANZ Stadium — Sydney" },
        { img: "https://commons.wikimedia.org/wiki/Special:FilePath/Taylor_Swift_-_The_1989_World_Tour_-_Crowd_at_HYDE_Park_during_Wildest_Dream_%26_Enchanted_performance.jpg?width=800", caption: "Hyde Park Enchated" },
        { img: "https://commons.wikimedia.org/wiki/Special:FilePath/Taylor_Swift_-_The_1989_World_Tour_-_Wristband_-_picture_from_HYDE_Park,_LONDON.jpg?width=800", caption: "Tour Wristbands" },
        { img: "https://commons.wikimedia.org/wiki/Special:FilePath/Taylor_Swift_@_CenturyLink_Field_(20234457170).jpg?width=800", caption: "CenturyLink Field" }
    ];

    useEffect(() => {
        const galleryEl = galleryScrollRef.current;
        if (!galleryEl) return;

        const handleWheel = (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                galleryEl.scrollLeft += e.deltaY;
            }
        };

        // { passive: false } allows preventDefault() to work correctly
        galleryEl.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            galleryEl.removeEventListener('wheel', handleWheel);
        };
    }, []);

    // Tracks
    const standardTracks = [
        { name: "Welcome to New York", single: false },
        { name: "Blank Space", single: true },
        { name: "Style", single: true },
        { name: "Out of the Woods", single: true },
        { name: "All You Had to Do Was Stay", single: false },
        { name: "Shake It Off", single: true },
        { name: "I Wish You Would", single: false },
        { name: "Bad Blood", single: true },
        { name: "Wildest Dreams", single: true },
        { name: "How You Get the Girl", single: false },
        { name: "This Love", single: false },
        { name: "I Know Places", single: false },
        { name: "Clean", single: false },
        { name: "Wonderland", single: false },
        { name: "You Are In Love", single: false },
        { name: "New Romantics", single: true }
    ];

    const vaultTracks = [
        { name: "\"Slut!\"", single: false },
        { name: "Say Don't Go", single: false },
        { name: "Now That We Don't Talk", single: false },
        { name: "Suburban Legends", single: false },
        { name: "Is It Over Now?", single: true }
    ];

    // Áudio player dinâmico (iTunes fetch)
    useEffect(() => {
        const fetchPreviews = async () => {
            try {
                const res = await fetch('https://itunes.apple.com/search?term=taylor+swift+1989+taylors+version&entity=song&limit=50&country=US');
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
        const key = trackName.toLowerCase().replace(/['"!?]/g, '');
        return previews[key] || Object.entries(previews).find(([k]) => k.replace(/['"!?]/g, '').includes(key) || key.includes(k.replace(/['"!?]/g, '')))?.[1] || null;
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

    const eraData = {
        original: {
            cover: coverOriginal,
            tag: "THE POP REVOLUTION",
            title: "1989",
            subtitle: "The Original Era",
            bio: "O momento em que Taylor se mudou para Nova York e redefiniu as regras do jogo. Adeus country, olá sintetizadores e batidas urbanas.",
            year: "2014",
            handwritten: "T. S. 1989"
        },
        tv: {
            cover: coverTV,
            tag: "A NEW SOUNDTRACK",
            title: "1989",
            subtitle: "Taylor's Version",
            bio: "O renascimento de um clássico. Agora com o brilho do mar, gaivotas e a liberdade de ser finalmente dona de sua própria história.",
            year: "2023",
            handwritten: "T. S. 1989 (TV)"
        }
    };

    const current = isTV ? eraData.tv : eraData.original;

    return (
        <main className={`era-1989-page ${isTV ? 'theme-tv' : 'theme-original'} ${loaded ? 'eightynine-loaded' : ''}`}>
            <audio ref={audioRef} />

            <header className="era-1989-nav">
                <Link to="/red" className="nav-1989-link">← RED</Link>

                <div className="toggle-container" onClick={() => setIsTV(!isTV)}>
                    <span className={!isTV ? 'active' : ''}>ORIGINAL</span>
                    <div className={`toggle-switch ${isTV ? 'tv-active' : ''}`}></div>
                    <span className={isTV ? 'active' : ''}>TV</span>
                </div>

                <Link to="/reputation" className="nav-1989-link">REPUTATION →</Link>
            </header>

            <section className="ninetene-eightynine-hero">
                <div className="hero-1989-neon-bg"></div>
                <div className="eightynine-texture-overlay"></div>

                {/* Dynamic Neon Streak SVGs */}
                <svg className="eightynine-neon-streak eightynine-neon-streak--left" viewBox="0 0 300 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path 
                      d="M 300 0 L 150 200 L 250 400 L 50 600 L 200 800" 
                      stroke="url(#neonStreakL)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6"
                   />
                   <path 
                      d="M 250 -50 L 100 150 L 200 350 L 0 550 L 150 750" 
                      stroke="url(#neonStreakL)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3"
                   />
                   <defs>
                       <linearGradient id="neonStreakL" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="0%" stopColor="#87ceeb" stopOpacity="0"/>
                           <stop offset="50%" stopColor="var(--neon, #87ceeb)" />
                           <stop offset="100%" stopColor="#87ceeb" stopOpacity="0"/>
                       </linearGradient>
                   </defs>
                </svg>

                <svg className="eightynine-neon-streak eightynine-neon-streak--right" viewBox="0 0 300 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path 
                      d="M 0 0 L 150 200 L 50 400 L 250 600 L 100 800" 
                      stroke="url(#neonStreakR)" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5"
                   />
                   <path 
                      d="M 50 -50 L 200 150 L 100 350 L 300 550 L 150 750" 
                      stroke="url(#neonStreakR)" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.25"
                   />
                   <defs>
                       <linearGradient id="neonStreakR" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="0%" stopColor="var(--neon, #87ceeb)" stopOpacity="0"/>
                           <stop offset="50%" stopColor="#87ceeb" />
                           <stop offset="100%" stopColor="var(--neon, #87ceeb)" stopOpacity="0"/>
                       </linearGradient>
                   </defs>
                </svg>

                <div className="hero-1989-main-content">
                    <div className="hero-1989-titles">
                        <h2 className="hero-1989-artist">TAYLOR SWIFT</h2>
                        <h1 className="hero-1989-album-title">
                           <span className="eightynine-title-flicker" data-text="1989">1989</span>
                        </h1>
                        <p className="hero-1989-quote">"Welcome to New York. It's been waiting for you."</p>
                    </div>

                    <div className="hero-1989-center-album" onClick={() => setIsTV(!isTV)}>
                        <div className="album-showcase">
                            <div className="album-glow"></div>
                            <div className="eightynine-album-aura"></div>
                            <img src={current.cover} alt="1989 Cover" className="album-img" />
                        </div>
                    </div>

                    <div className="hero-1989-info-strip">
                        <div className="info-strip-item">
                            <span className="strip-label">ERA</span>
                            <span className="strip-value">{current.subtitle}</span>
                        </div>
                        <div className="strip-divider"></div>
                        <div className="info-strip-item">
                            <span className="strip-label">LANÇAMENTO</span>
                            <span className="strip-value">{current.year}</span>
                        </div>
                        <div className="strip-divider"></div>
                        <div className="info-strip-item">
                            <span className="strip-label">GÊNERO</span>
                            <span className="strip-value">SYNTH-POP</span>
                        </div>
                        <div className="strip-divider"></div>
                        <div className="info-strip-item">
                            <span className="strip-label">STATUS</span>
                            <span className="strip-value">{isTV ? "RE-RECORDING" : "9X PLATINA"}</span>
                        </div>
                    </div>

                    <div className="hero-1989-action-row">
                        <button className="btn-1989-play" onClick={() => tracklistRef.current?.scrollIntoView({ behavior: 'smooth' })}>TRACKLIST</button>
                        <button className="btn-1989-primary" onClick={() => setIsTV(!isTV)}>
                            {isTV ? "BACK TO 2014" : "UNLOCK THE VAULT"}
                        </button>
                        <button className="btn-1989-play" onClick={() => timelineRef.current?.scrollIntoView({ behavior: 'smooth' })}>TIMELINE</button>
                    </div>
                </div>
            </section>

            {/* SEPARADOR DE SEÇÕES */}
            <div className="section-divider-1989"></div>

            {/* SEÇÃO TRACKLIST ADICIONADA AQUI */}
            <section className="tracklist-1989-section" ref={tracklistRef}>
                <div className="tracklist-container">
                    <h2 className="tracklist-title-main">
                        <span className="neon-sweep">THE SOUNDTRACK</span>
                    </h2>
                    <p className="tracklist-subtitle">Every track. Every emotion. The story of 1989.</p>

                    <div className="tracklist-grid">
                        <div className="tracklist-column">
                            <h3 className="column-label">Standard Edition</h3>
                            <p className="column-phrase">"Cause, darling, I'm a nightmare dressed like a daydream"
                            </p>
                            {standardTracks.map((track, i) => (
                                <div
                                    key={i}
                                    className={`track-card ${playingTrack === track.name ? 'playing' : ''} ${track.single ? 'is-single' : ''}`}
                                    onClick={() => handlePlay(track.name)}
                                >
                                    <span className="t-num">{(i + 1).toString().padStart(2, '0')}</span>
                                    <div className="t-info">
                                        <span className="t-name">{track.name}</span>
                                        {track.single && (
                                            <span className="t-single">
                                                <span className="single-star">★</span> SINGLE
                                            </span>
                                        )}
                                    </div>
                                    <button className="t-play-btn" aria-label="Play">
                                        {/* Play Icon managed solely by CSS later or as pseudo element! Actually let's just use CSS for play icon */}
                                    </button>
                                    <div className="t-eq"><span></span><span></span><span></span><span></span></div>
                                </div>
                            ))}
                        </div>

                        <div className={`tracklist-column vault-side ${isTV ? 'active' : 'locked'}`}>
                            <h3 className="column-label">From The Vault</h3>
                            <p className="column-phrase">"Say you'll remember me."</p>
                            {isTV ? (
                                vaultTracks.map((track, i) => (
                                    <div
                                        key={i}
                                        className={`track-card vault-card ${playingTrack === track.name ? 'playing' : ''} ${track.single ? 'is-single' : ''}`}
                                        onClick={() => handlePlay(track.name)}
                                    >
                                        <span className="t-num">{(i + 17).toString().padStart(2, '0')}</span>
                                        <div className="t-info">
                                            <span className="t-name">{track.name}</span>
                                            {track.single && (
                                                <span className="t-single">
                                                    <span className="single-star">★</span> SINGLE
                                                </span>
                                            )}
                                        </div>
                                        <button className="t-play-btn" aria-label="Play">
                                            {/* ícone dinâmico gerado pelo CSS se não tiver span interno */}
                                        </button>
                                        <div className="t-eq"><span></span><span></span><span></span><span></span></div>
                                    </div>
                                ))
                            ) : (
                                <div className="vault-placeholder" onClick={() => setIsTV(true)}>
                                    <div className="lock-icon">🔒</div>
                                    <p>CLICK TO UNLOCK THE VAULT</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <div className="section-divider-1989"></div>

            {/* SEÇÃO 1: THE VAULT - DECODE THE CODE */}
            <section className="vault-1989-section">
                <div className="vault-header">
                    <h2 className="vault-section-title">"THE VAULT"</h2>
                    <p className="vault-section-subtitle">Decode the Code</p>
                </div>

                <div className="vault-container">
                    <div className={`bank-vault ${vaultOpened ? 'is-open' : ''}`} onClick={() => !vaultOpened && setVaultOpened(true)}>
                        <div className="vault-door">
                            <div className="vault-frame"></div>
                            <div className="vault-wheel">
                                <div className="wheel-handle h1"></div>
                                <div className="wheel-handle h2"></div>
                                <div className="wheel-handle h3"></div>
                                <div className="wheel-handle h4"></div>
                                <div className="wheel-center">
                                    <span className="ts-logo">T.S.</span>
                                </div>
                            </div>
                            <div className="vault-rivets"></div>
                            <div className="vault-combination">
                                <span>1</span><span>9</span><span>8</span><span>9</span>
                            </div>
                            {!vaultOpened && <p className="click-to-open">CLICK TO UNLOCK</p>}
                        </div>

                        {/* Fumaça/Partículas */}
                        <div className="vault-smoke"></div>

                        {/* Conteúdo do Cofre (Faixas) */}
                        <div className="vault-inside">
                            <h3 className="inside-title">UNLOCKED</h3>
                            <button
                                className="lock-again-btn"
                                onClick={(e) => { e.stopPropagation(); setVaultOpened(false); }}
                            >
                                CLOSE VAULT
                            </button>
                        </div>

                        {/* Scattered Tracks */}
                        <div className="vault-tracks-scattered">
                            {[
                                { lyric: "In a world of boys, he's a gentleman", song: "\"Slut!\"" },
                                { lyric: "Why'd you have to lead me on?", song: "Say Don't Go" },
                                { lyric: "I don't have to pretend I like acid rock", song: "Now That We Don't Talk" },
                                { lyric: "I broke my own heart 'cause you were too polite to do it", song: "Suburban Legends" },
                                { lyric: "Let's fast forward to 300 awkward blind dates later", song: "Is It Over Now?" }
                            ].map((item, i) => {
                                // Posições bem mais amplas nas laterais e embaixo
                                const scatterPos = [
                                    { t: '-60px', l: '-350px' },
                                    { t: '-40px', l: '460px' },
                                    { t: '520px', l: '-180px' },
                                    { t: '240px', l: '490px' },
                                    { t: '540px', l: '360px' },
                                ][i];
                                return (
                                    <div
                                        key={`vault-scatter-${i}`}
                                        className={`scatter-track-item ${vaultOpened ? 'is-visible' : ''}`}
                                        style={{ top: scatterPos.t, left: scatterPos.l, transitionDelay: `${0.8 + (i * 0.2)}s` }}
                                    >
                                        <div className="st-content">
                                            <span className="st-name">"{item.lyric}"</span>
                                            <span className="st-song">{item.song}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* SEÇÃO 3: TIMELINE */}
            <section className="timeline-1989-section" ref={timelineRef}>
                <div className="timeline-header">
                    <h2 className="timeline-title">THE ERAS TIMELINE</h2>
                    <p className="timeline-subtitle">Key moments of the 1989 magic.</p>
                </div>

                <div className="timeline-1989-container">
                    <div className="timeline-1989-line"></div>

                    {[
                        { date: "AUG 18, 2014", title: "THE LIVESTREAM", desc: "Taylor announces 1989 and drops 'Shake It Off' during a Yahoo! worldwide livestream from the Empire State Building." },
                        { date: "OCT 2014", title: "SECRET SESSIONS", desc: "Taylor invites fans to her homes (including Tribeca, NY) to hear the album before its release." },
                        { date: "OCT 27, 2014", title: "WELCOME TO NEW YORK", desc: "1989 is officially released and goes on to sell 1.287 million copies in its first week." },
                        { date: "MAY 5, 2015", title: "THE 1989 WORLD TOUR", desc: "The tour kicks off in Tokyo, becoming the highest-grossing tour of the year, filled with iconic special guests." },
                        { date: "FEB 15, 2016", title: "ALBUM OF THE YEAR", desc: "1989 wins Album of the Year at the 58th GRAMMYs, making Taylor the first woman to win the award twice." },
                        { date: "OCT 27, 2023", title: "TAYLOR'S VERSION", desc: "Nine years later, Taylor reclaims her masterpiece, adding 5 new 'From The Vault' tracks." },
                    ].map((event, index) => (
                        <div key={index} className="timeline-1989-item">
                            <div className="timeline-1989-dot"></div>
                            <div className="timeline-1989-content">
                                <span className="timeline-1989-date">{event.date}</span>
                                <h3 className="timeline-1989-event">{event.title}</h3>
                                <p className="timeline-1989-desc">{event.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="section-divider-1989"></div>

            {/* SEÇÃO 4: SECRET MESSAGE DECODER */}
            <section className="decoder-1989-section">
                <div className="decoder-header">
                    <h2 className="decoder-title">SECRET MESSAGE</h2>
                    <p className="decoder-subtitle">Find the hidden uppercase letters</p>
                </div>

                <div className="decoder-game-container">
                    <div className="decoder-text-box">
                        {secretMessageText.split('').map((char, index) => {
                            const isTarget = char.match(/[A-Z]/);
                            const isFound = foundIndexes.includes(index);
                            return (
                                <span
                                    key={index}
                                    className={`decoder-char ${isTarget ? 'is-target' : ''} ${isFound ? 'is-found' : ''}`}
                                    onClick={() => handleLetterClick(char, index)}
                                >
                                    {char}
                                </span>
                            );
                        })}
                    </div>

                    <div className="decoder-progress">
                        <div className="decoded-board">
                            {secretMessageText.split('').map((char, index) => {
                                if (!char.match(/[A-Z]/)) return null;
                                const isFound = foundIndexes.includes(index);
                                return (
                                    <span key={`board-${index}`} className={`board-slot ${isFound ? 'filled' : ''}`}>
                                        {isFound ? char : '_'}
                                    </span>
                                );
                            })}
                        </div>
                        {foundIndexes.length === totalSecretLetters && (
                            <div className="decoder-success">
                                <h3>✨ MESSAGE DECODED!</h3>
                                <p>"Welcome to New York"</p>
                                <button className="decoder-play-btn" onClick={() => handlePlay("Welcome to New York")}>
                                    ▶ Play Welcome to New York (Taylor's Version)
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <div className="section-divider-1989"></div>

            {/* SEÇÃO 5: MUSIC VIDEOS — HORIZONTAL CAROUSEL */}
            <section className="clips-1989-section">
                <div className="clips-header">
                    <h2 className="clips-title">MUSIC VIDEOS</h2>
                    <p className="clips-subtitle">The visual era</p>
                </div>

                <div className="mv-carousel-wrapper">
                    <button className="mv-nav-btn prev" onClick={() => scrollClips('left')}>‹</button>
                    <button className="mv-nav-btn next" onClick={() => scrollClips('right')}>›</button>
                    <div className="mv-carousel-track" ref={clipScrollRef}>
                        {musicVideos.map((mv, i) => (
                            <div key={i} className="mv-slide">
                                {activeVideo && activeVideo.youtubeId === mv.youtubeId ? (
                                    <div className="mv-slide-player">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${mv.youtubeId}?autoplay=1`}
                                            title={mv.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen>
                                        </iframe>
                                        <button className="mv-close-inline" onClick={(e) => { e.stopPropagation(); setActiveVideo(null); }}>✕ CLOSE</button>
                                    </div>
                                ) : (
                                    <div className="mv-slide-thumb" onClick={() => setActiveVideo(mv)}>
                                        <img
                                            src={`https://img.youtube.com/vi/${mv.youtubeId}/maxresdefault.jpg`}
                                            alt={mv.title}
                                        />
                                        <div className="mv-slide-overlay">
                                            <div className="mv-slide-play">▶</div>
                                        </div>
                                        <div className="mv-slide-info">
                                            <span className="mv-slide-year">{mv.year}</span>
                                            <h3 className="mv-slide-title">{mv.title}</h3>
                                            <p className="mv-slide-desc">{mv.desc}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SEÇÃO 6: THE 1989 WORLD TOUR */}
            <section className="tour-1989-section">
                <div className="tour-content">
                    <h2 className="tour-title">THE 1989 WORLD TOUR</h2>
                    <p className="tour-desc">85 shows. 5 continents. 2.2 million fans. The biggest tour of 2015.</p>

                    <div className="tour-stats">
                        <div className="stat"><span>85</span>SHOWS</div>
                        <div className="stat"><span>2.2M</span>FANS</div>
                        <div className="stat"><span>$250M</span>GROSS</div>
                        <div className="stat"><span>7</span>SINGLES PERFORMED</div>
                    </div>

                    <div className="tour-video-embed" style={{ marginTop: '60px', marginBottom: '40px' }}>
                        {activeVideo === 'tour' ? (
                            <div className="mv-slide-player">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src="https://www.youtube.com/embed/P5JLMp08GC0?autoplay=1&start=5966"
                                    title="The 1989 World Tour Live"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen>
                                </iframe>
                                <button className="mv-close-inline" onClick={() => setActiveVideo(null)}>✕ CLOSE</button>
                            </div>
                        ) : (
                            <div className="mv-slide-thumb" onClick={() => setActiveVideo('tour')}>
                                <img
                                    src="https://img.youtube.com/vi/P5JLMp08GC0/maxresdefault.jpg"
                                    alt="The 1989 World Tour Live"
                                />
                                <div className="mv-slide-overlay">
                                    <div className="mv-slide-play">▶</div>
                                </div>
                                <div className="mv-slide-info">
                                    <span className="mv-slide-year">2015</span>
                                    <h3 className="mv-slide-title">THE 1989 WORLD TOUR LIVE</h3>
                                    <p className="mv-slide-desc">Sydney, Australia — Full Concert Film</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="tour-details-grid">
                        <div className="tour-detail-card">
                            <h4>🎤 SETLIST HIGHLIGHTS</h4>
                            <ul>
                                <li>Welcome to New York (Opener)</li>
                                <li>Blank Space</li>
                                <li>I Knew You Were Trouble</li>
                                <li>Shake It Off (Finale)</li>
                                <li>Love Story / You Belong With Me</li>
                                <li>Enchanted / Wildest Dreams</li>
                            </ul>
                        </div>
                        <div className="tour-detail-card">
                            <h4>⭐ SPECIAL GUESTS</h4>
                            <ul>
                                <li>The Weeknd — "Can't Feel My Face"</li>
                                <li>Selena Gomez — "Good For You"</li>
                                <li>Mick Jagger — "Satisfaction"</li>
                                <li>Justin Timberlake — "Mirrors"</li>
                                <li>Nick Jonas — "Jealous"</li>
                                <li>Julia Roberts, Joan Baez & more</li>
                            </ul>
                        </div>
                        <div className="tour-detail-card">
                            <h4>💡 FUN FACTS</h4>
                            <ul>
                                <li>Every fan received a LED wristband</li>
                                <li>The stage was 60 feet wide</li>
                                <li>Highest-grossing tour of 2015</li>
                                <li>Final show: Melbourne, Australia</li>
                                <li>Over 20 unique surprise guests total</li>
                                <li>APPLE MUSIC filmed the Sydney show</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEÇÃO 7: ERA GALLERY — HORIZONTAL SCROLL (Speak Now pattern) */}
            <section className="gallery-1989-section">
                <div className="gallery-header">
                    <h2 className="gallery-title">GALLERY</h2>
                    <p className="gallery-subtitle">The 1989 era in frames</p>
                </div>
                <div
                    className="gallery-1989-scroll"
                    ref={galleryScrollRef}
                >
                    <div className="gallery-1989-track">
                        {galleryItems.map((item, i) => (
                            <div key={i} className="gallery-1989-photo">
                                <img src={item.img} alt={item.caption} />
                                <span className="gallery-1989-caption">{item.caption}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== SEÇÃO: OUTRAS ERAS ===== */}
            <section className="nineteen-eras-section">
                <div className="nineteen-eras-inner">
                    <span className="nineteen-tour-tag">NAVEGUE</span>
                    <h2 className="nineteen-tour-title">OUTRAS ERAS</h2>
                    <div className="nineteen-eras-grid">
                        {[
                            { name: "Taylor Swift", year: "2006", path: "/debut", color: "#50c878" },
                            { name: "Fearless", year: "2008", path: "/fearless", color: "#d4af37" },
                            { name: "Speak Now", year: "2010", path: "/speaknow", color: "#9b59b6" },
                            { name: "Red", year: "2012", path: "/red", color: "#8b0000" },
                            { name: "Reputation", year: "2017", path: "/reputation", color: "#1a1a1a" },
                            { name: "Lover", year: "2019", path: "/lover", color: "#ff9ec4" },
                            { name: "Folklore", year: "2020", path: "/folklore", color: "#8a9a8a" },
                            { name: "Evermore", year: "2020", path: "/evermore", color: "#8b4513" },
                            { name: "Midnights", year: "2022", path: "/midnights", color: "#1c1c4b" },
                            { name: "TTPD", year: "2024", path: "/ttpd", color: "#c8a882" },
                            { name: "The Life of a Showgirl", year: "2025", path: "/showgirl", color: "#e46c32" },
                        ].map((era, i) => (
                            <Link key={i} to={era.path} className="nineteen-era-card" style={{ '--era-color': era.color }}>
                                <span className="nineteen-era-year" style={{ color: era.color }}>{era.year}</span>
                                <span className="nineteen-era-name">{era.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="nineteen-footer">
                <div className="nineteen-footer-inner">
                    <p className="nineteen-footer-cursive">1989</p>
                    <p className="nineteen-footer-copy">
                        © 2026 · Conteúdo para fins educacionais
                    </p>
                    <div className="nineteen-footer-links">
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
                <button className="nineteen-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Voltar ao topo">
                    ↑
                </button>
            )}

        </main>
    );
};

export default NineteenEightyNine;