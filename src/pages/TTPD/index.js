import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './ttpd.css';
import RatingSection from '../../components/RatingSection/RatingSection';
import { eraThemes } from '../../utils/eraThemes';

// URLs das capas — hospedadas externamente (wiki) pra não pesar o bundle
const COVER = "https://static.wikia.nocookie.net/taylor-swift/images/e/ef/The_Tortured_Poets_Department.jpeg/revision/latest/scale-to-width-down/1000?cb=20240405141714";
const ANTHOLOGY_COVER = "https://static.wikia.nocookie.net/taylor-swift/images/8/83/THE_TORTURED_POETS_DEPARTMENT_-_THE_ANTHOLOGY.jpg/revision/latest/scale-to-width-down/1000?cb=20241007031035";

// Tracklist com letras embutidas — cada faixa tem um trecho de lyrics pra exibir na UI
// Decisão: guardar letras aqui (não em API) porque são estáticas e não mudam
const TRACKS_TTPD = [
    { id: 1, title: "Fortnight", feat: "feat. Post Malone", single: true, lyrics: "I was a functioning alcoholic 'til nobody noticed my new aesthetic\nAll of this to say, I hope you're okay\nBut you're the reason\nAnd no one here's to blame\nBut what about your quiet treason?" },
    { id: 2, title: "The Tortured Poets Department", lyrics: "You left your typewriter at my apartment\nStraight from the Tortured Poets Department\nI think some things I never say\nLike, 'Who uses typewriters anyway?'" },
    { id: 3, title: "My Boy Only Breaks His Favorite Toys", lyrics: "My boy only breaks his favorite toys\nI'm queen of sand castles he destroys\n'Cause it fit my poems like a perfect rhyme" },
    { id: 4, title: "Down Bad", lyrics: "Now I'm down bad, crying at the gym\nEverything comes out teenage petulance\nFuck it if I can't have him\nI might just die, it would make no difference" },
    { id: 5, title: "So Long, London", lyrics: "You swore that you loved me but where were the clues?\nI died on the altar waiting for the proof\nYou sacrificed us to the gods of your bluest days" },
    { id: 6, title: "But Daddy I Love Him", lyrics: "I'll tell you something right now\nI'd rather burn my whole life down\nThan listen to one more second of all this griping and moaning\nI'll tell you something 'bout my good name\nIt's mine alone to disgrace" },
    { id: 7, title: "Fresh Out The Slammer", lyrics: "Camera flashes, welcome bashes\nGet the matches, toss the ashes off the ledge\nAs I stepped from the gallows\nAnd I saw my face in a pool of light" },
    { id: 8, title: "Florida!!!", feat: "feat. Florence + The Machine", single: true, lyrics: "Florida, is a hell of a drug\nFlorida, can I use you up?\nYour suitcase packed with everything we wanted" },
    { id: 9, title: "Guilty as Sin?", lyrics: "What if I roll the stone away?\nThey're gonna crucify me anyway\nWhat if the way you hold me\nIs actually what's holy?" },
    { id: 10, title: "Who's Afraid of Little Old Me?", lyrics: "I was tame, I was gentle\n'Til the circus life made me mean\n'Don't you worry, folks,\nWe took out all her teeth'\nWho's afraid of little old me?\nYou should be." },
    { id: 11, title: "I Can Fix Him (No Really I Can)", lyrics: "The smoke on his breath\nMight be from the cigarettes\nOr from the fire in his eyes\nI can fix him, no really I can" },
    { id: 12, title: "loml", lyrics: "You said I'm the love of your life\nYou said I'm the love of your life\nYou reached out for my hand and you missed\nYou're the loss of my life" },
    { id: 13, title: "I Can Do It With a Broken Heart", single: true, lyrics: "I can read your mind\n'She's having the time of her life'\nThere's a good chance\nI'm as happy as I've ever been" },
    { id: 14, title: "The Smallest Man Who Ever Lived", lyrics: "Was any of it true?\nGazing at me starry-eyed\nIn your Jehovah's Witness suit\nWho the fuck was that guy?" },
    { id: 15, title: "The Alchemy", lyrics: "So when I touch down\nKeep the trophy\nWe're making the anthology\n'Cause the sign on your heart\nIs still reserved for me" },
    { id: 16, title: "Clara Bow", lyrics: "You look like Clara Bow\nIn this light, remarkable\nAll your life, did you know\nYou'd be this memorizing?" },
];
const TRACKS_ANTHOLOGY = [
    { id: 17, title: "The Black Dog", lyrics: "And I hope it's shitty in The Black Dog\nWhen someone plays The Starting Line\nAnd you jump up\nBut you're just some guy" },
    { id: 18, title: "imgonnagetyouback", lyrics: "Whether I'm gonna be your wife or\nGonna smash up your bike, I\nHaven't decided yet\nBut I'm gonna get you back" },
    { id: 19, title: "The Albatross", lyrics: "So I'm the albatross\nThat is hanging 'round your neck\nAnd I'm the one who's gonna\nHelp you pay your debts" },
    { id: 20, title: "Chloe or Sam or Sophia or Marcus", lyrics: "You said some things\nThat I can't unhear\nAnd I did some things\nThat I can't undo" },
    { id: 21, title: "How Did It End?", lyrics: "Come one, come all\nIt's happening again\nThe empathetic hunger descends\nWe ask the question\nHow did it end?" },
    { id: 22, title: "So High School", lyrics: "You know how to ball,\nI know Aristotle\nWho are we to fight\nThe alchemy?" },
    { id: 23, title: "I Hate It Here", lyrics: "I hate it here\nSo I will go\nTo secret gardens in my mind\nPeople need a key to get to" },
    { id: 24, title: "thanK you aIMee", lyrics: "I changed your name\nAnd any real defining clues\nAnd one day your kid\nComes home singing\nA song that only us two is gonna know is about you" },
    { id: 25, title: "I Look in People's Windows", lyrics: "I look in people's windows\nTransfixed by rose golden glows\nI wonder if you've got a spare room" },
    { id: 26, title: "The Prophecy", lyrics: "Please\nI've been on my knees\nChange the prophecy\nDon't want money\nJust someone who wants my company" },
    { id: 27, title: "Cassandra", lyrics: "I was the one who told you\nI'm the one who saw it\nI was Cassandra, honey\nBut they don't know who Cassandra is" },
    { id: 28, title: "Peter", lyrics: "And I won't confess\nThat I waited but, honey\nI noticed\nYou showed up, you came through\nBut seven winters in" },
    { id: 29, title: "The Bolter", lyrics: "She's been doing this dance since she was fourteen\nShe's got this down to a system, friends\nShe feels the adrenaline creep" },
    { id: 30, title: "Robin", lyrics: "My friends all smell like weed or little babies\nAnd this city reeks of driving myself crazy" },
    { id: 31, title: "The Manuscript", lyrics: "The only thing that's left\nIs the manuscript\nIn the orange light of the lamp\nNow and then I reread it\nBut I don't look like this anymore" },
];
const MVS = [
    { title: "Fortnight", feat: "feat. Post Malone", url: "https://www.youtube.com/embed/q3zqJs7JUCQ?rel=0&modestbranding=1&hd=1&vq=hd1080" },
    { title: "I Can Do It With a Broken Heart", url: "https://www.youtube.com/embed/Sl6en1NPTYM?rel=0&modestbranding=1&hd=1&vq=hd1080" },
];
const SETLIST = [
    "But Daddy I Love Him", "So High School", "Who's Afraid of Little Old Me?",
    "Down Bad", "Fortnight", "The Smallest Man Who Ever Lived",
    "I Can Do It With a Broken Heart",
];
const GALLERY = [
    "https://static.wikia.nocookie.net/taylor-swift/images/9/93/Fresh_Out_The_Slammer_LV.jpg/revision/latest/scale-to-width-down/1000?cb=20240425164013",
    "https://static.wikia.nocookie.net/taylor-swift/images/7/7d/20240421_011528.jpg/revision/latest/scale-to-width-down/1000?cb=20240609181628",
    "https://static.wikia.nocookie.net/taylor-swift/images/0/0c/TTPD_album_photoshoot54-alt1.jpeg/revision/latest/scale-to-width-down/1000?cb=20240623161450",
    "https://static.wikia.nocookie.net/taylor-swift/images/e/e8/TTPD_album_photoshoot_54.jpeg/revision/latest/scale-to-width-down/1000?cb=20240623160849",
    "https://static.wikia.nocookie.net/taylor-swift/images/d/db/TTPD-the-anthology-back-cropped.jpeg/revision/latest/scale-to-width-down/1000?cb=20241116165330",
    "https://static.wikia.nocookie.net/taylor-swift/images/9/97/TTPD_album_photoshoot_13.jpeg/revision/latest/scale-to-width-down/1000?cb=20250415222426",
    "https://static.wikia.nocookie.net/taylor-swift/images/c/c4/TTPD_album_photoshoot_11.jpeg/revision/latest/scale-to-width-down/1000?cb=20240421082058",
    "https://static.wikia.nocookie.net/taylor-swift/images/d/d8/TTPD_album_photoshoot_76.jpeg/revision/latest/scale-to-width-down/1000?cb=20240523092529",
    "https://static.wikia.nocookie.net/taylor-swift/images/4/4e/20240421_011520.jpg/revision/latest/scale-to-width-down/1000?cb=20240622005732",
    "https://static.wikia.nocookie.net/taylor-swift/images/3/38/TTPD_album_photoshoot_35.jpeg/revision/latest/scale-to-width-down/1000?cb=20250218203643",
    "https://static.wikia.nocookie.net/taylor-swift/images/7/7d/TTPD_album_photoshoot_1.jpeg/revision/latest/scale-to-width-down/1000?cb=20241014222722",
    "https://static.wikia.nocookie.net/taylor-swift/images/8/83/TTPD_album_photoshoot_19.jpeg/revision/latest/scale-to-width-down/1000?cb=20240420025325",
];
const ERAS = [
    { name: "Debut", year: "2006", path: "/debut", color: "#7ec8a0" },
    { name: "Fearless", year: "2008", path: "/fearless", color: "#c9a227" },
    { name: "Speak Now", year: "2010", path: "/speak-now", color: "#a855f7" },
    { name: "Red", year: "2012", path: "/red", color: "#991b1b" },
    { name: "1989", year: "2014", path: "/1989", color: "#87ceeb" },
    { name: "Reputation", year: "2017", path: "/reputation", color: "#2d2d2d" },
    { name: "Lover", year: "2019", path: "/lover", color: "#ff9ec4" },
    { name: "Folklore", year: "2020", path: "/folklore", color: "#8a9a8a" },
    { name: "Evermore", year: "2020", path: "/evermore", color: "#cc621b" },
    { name: "Midnights", year: "2022", path: "/midnights", color: "#7b8aff" },
    { name: "Showgirl", year: "2025", path: "/showgirl", color: "#e46c32" },
];
const TTPD = () => {
    const [loaded, setLoaded] = useState(false);
    const [isAnthology, setIsAnthology] = useState(false);
    const [typingSong, setTypingSong] = useState(null);
    const [typedText, setTypedText] = useState('');
    const [activeMv, setActiveMv] = useState(0);
    const typewriterRef = useRef(null);
    const audioRef = useRef(null);
    const filmstripRef = useRef(null);
    const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 });
    useEffect(() => {
        setTimeout(() => setLoaded(true), 100);
        window.scrollTo(0, 0);
        document.body.style.backgroundColor = '#edebe7';
        document.body.style.backgroundImage = 'none';
        return () => { document.body.style.backgroundColor = ''; document.body.style.backgroundImage = ''; };
    }, []);
    useEffect(() => {
        const els = document.querySelectorAll('.tp-about, .tp-records-section, .tp-mv-section, .tp-eras-act');
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('tp-visible'); });
        }, { threshold: 0.15 });
        els.forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, []);
    useEffect(() => {
        if (!typingSong) return;
        setTypedText('');
        let i = 0;
        const text = typingSong.lyrics;
        const interval = setInterval(() => {
            setTypedText(text.slice(0, i + 1));
            i++;
            if (i >= text.length) clearInterval(interval);
        }, 35);
        return () => clearInterval(interval);
    }, [typingSong]);
    const handleTrackClick = useCallback((track) => {
        setTypingSong(track);
        setTimeout(() => {
            typewriterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }, []);
    const activeTracks = isAnthology ? TRACKS_ANTHOLOGY : TRACKS_TTPD;
    const currentCover = isAnthology ? ANTHOLOGY_COVER : COVER;
    const handleDragStart = (e) => {
        const el = filmstripRef.current;
        if (!el) return;
        dragState.current.isDown = true;
        dragState.current.startX = e.pageX - el.offsetLeft;
        dragState.current.scrollLeft = el.scrollLeft;
        el.classList.add('is-dragging');
    };
    const handleDragEnd = () => {
        const el = filmstripRef.current;
        if (!el) return;
        dragState.current.isDown = false;
        el.classList.remove('is-dragging');
    };
    const handleDragMove = (e) => {
        if (!dragState.current.isDown) return;
        e.preventDefault();
        const el = filmstripRef.current;
        const x = e.pageX - el.offsetLeft;
        const walk = (x - dragState.current.startX) * 1.5;
        el.scrollLeft = dragState.current.scrollLeft - walk;
    };
    const PenStrokeSVG = () => (
        <svg viewBox="0 0 160 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M80 0 Q70 100 90 200 Q110 300 70 400 Q30 500 90 600 Q120 700 80 800" stroke="#7a7975" strokeWidth="2" opacity="0.7" strokeDasharray="8 12" />
            <path d="M50 20 Q45 150 65 280 Q85 400 55 520 Q25 640 60 780" stroke="#2f2a24" strokeWidth="1.5" opacity="0.5" strokeDasharray="4 16" />
            <path d="M100 60 Q95 200 110 340 Q125 480 95 620 Q80 720 105 800" stroke="#a79e8f" strokeWidth="1" opacity="0.45" strokeDasharray="3 20" />
            <circle cx="85" cy="180" r="5" fill="#7a7975" opacity="0.35" />
            <circle cx="60" cy="350" r="8" fill="#2f2a24" opacity="0.2" />
            <circle cx="95" cy="520" r="4" fill="#a79e8f" opacity="0.3" />
            <circle cx="70" cy="680" r="7" fill="#7a7975" opacity="0.18" />
            <circle cx="110" cy="150" r="3" fill="#2f2a24" opacity="0.15" />
            <circle cx="45" cy="450" r="4" fill="#2f2a24" opacity="0.12" />
            <circle cx="100" cy="750" r="5" fill="#a79e8f" opacity="0.2" />
        </svg>
    );
    return (
        <main className={`era-ttpd-page ${loaded ? 'ttpd-loaded' : ''}`}>
            <div className="tp-grain" />
            <div className="tp-pen-stroke tp-pen-stroke--l"><PenStrokeSVG /></div>
            <div className="tp-pen-stroke tp-pen-stroke--r"><PenStrokeSVG /></div>
            <nav className="tp-nav">
                <Link to="/midnights" className="tp-nav-link"><span>←</span> MIDNIGHTS</Link>
                <div className="tp-nav-center">
                    <div className="tp-nav-logo">THE TORTURED POETS DEPARTMENT</div>
                </div>
                <Link to="/showgirl" className="tp-nav-link">SHOWGIRL <span>→</span></Link>
            </nav>
            <header className="tp-hero">
                <div className="tp-hero-ink-bg" />
                <div className="tp-hero-content">
                    <div className="tp-hero-text">
                        <div className="tp-hero-lines" />
                        <p className="tp-hero-tag">ÁLBUM XI · 19 ABRIL 2024</p>
                        <h1 className="tp-hero-title">
                            <span className="tp-hero-title-line">The Tortured</span>
                            <span className="tp-hero-title-line">Poets Department</span>
                            <span className="tp-hero-title-accent">— um estudo em luto, manuscritos e máquinas de escrever</span>
                        </h1>
                        <svg className="tp-hero-divider" viewBox="0 0 120 2">
                            <line x1="0" y1="1" x2="120" y2="1" stroke="#a79e8f" strokeWidth="0.5" />
                        </svg>
                        <p className="tp-hero-quote">
                            "You left your typewriter at my apartment — straight from the Tortured Poets Department"
                        </p>
                        <div className="tp-toggle-wrap">
                            <button className={`tp-toggle-btn ${!isAnthology ? 'active' : ''}`} onClick={() => setIsAnthology(false)}>Standard</button>
                            <button className={`tp-toggle-btn ${isAnthology ? 'active' : ''}`} onClick={() => setIsAnthology(true)}>The Anthology</button>
                        </div>
                    </div>
                    <div className="tp-hero-cover">
                        <div className="tp-cover-glow" />
                        <img src={currentCover} alt="TTPD Cover" className="tp-cover-img" />
                    </div>
                </div>
                <div className="tp-scroll-cue">
                    <div className="tp-scroll-cue-line" />
                    <span>scroll</span>
                </div>
            </header>
            <section className="tp-about">
                <div className="tp-about-inner">
                    <div className="tp-about-stat">
                        31
                        <span className="tp-about-stat-caption">POEMAS TORTURADOS</span>
                    </div>
                    <div className="tp-about-text">
                        <span className="tp-label">sobre o álbum</span>
                        <h2 className="tp-about-title">Uma autópsia emocional</h2>
                        <p className="tp-about-p">
                            <strong>The Tortured Poets Department</strong> é o décimo primeiro álbum de estúdio de Taylor Swift,
                            lançado como um álbum duplo com <strong>The Anthology</strong> — totalizando 31 faixas que dissecam
                            o luto, a desilusão amorosa e a performance pública da dor.
                        </p>
                        <p className="tp-about-p">
                            Escrito durante dois anos de introspecção intensa, o álbum adota a <strong>estética dos manuscritos</strong>,
                            máquinas de escrever e departamentos acadêmicos — transformando confissões pessoais em artefatos literários.
                        </p>
                        <div className="tp-about-facts">
                            <div className="tp-fact"><span className="tp-fact-icon">📅</span><span className="tp-fact-text">Lançado em 19 de abril de 2024</span></div>
                            <div className="tp-fact"><span className="tp-fact-icon">🎹</span><span className="tp-fact-text">Produzido por Aaron Dessner & Jack Antonoff</span></div>
                            <div className="tp-fact"><span className="tp-fact-icon">📝</span><span className="tp-fact-text">31 faixas (16 + 15 Anthology)</span></div>
                            <div className="tp-fact"><span className="tp-fact-icon">🏆</span><span className="tp-fact-text">Álbum #1 em 30+ países</span></div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="tp-tracklist">
                <div className="tp-tracklist-layout">
                    <div className="tp-sticky-cover">
                        <img src={currentCover} alt="Album Cover" className="tp-sticky-img" />
                    </div>
                    <div className="tp-tracks-col">
                        <div className="tp-tracks-header">
                            <span className="tp-label">{isAnthology ? 'the anthology' : 'tracklist'}</span>
                            <h2 className="tp-section-title">{isAnthology ? 'The Anthology' : 'Índice Editorial'}</h2>
                            <p className="tp-sub">Clique em uma faixa para datilografar o manuscrito</p>
                        </div>
                        <div className="tp-track-list">
                            {activeTracks.map((track, idx) => (
                                <div
                                    key={track.id}
                                    className={`tp-track-item ${typingSong?.id === track.id ? 'is-typing' : ''}`}
                                    style={{ '--i': idx }}
                                    onClick={() => handleTrackClick(track)}
                                >
                                    <span className="tp-track-num">{String(idx + 1).padStart(2, '0')}</span>
                                    <div className="tp-track-info">
                                        <span className="tp-track-name">{track.title}</span>
                                        {track.feat && <span className="tp-track-feat">{track.feat}</span>}
                                    </div>
                                    {track.single && <span className="tp-badge tp-badge--single">SINGLE</span>}
                                </div>
                            ))}
                        </div>
                        <div className="tp-stats-row">
                            <div className="tp-stat"><span className="tp-stat-val">{isAnthology ? '15' : '16'}</span><span className="tp-stat-lbl">FAIXAS</span></div>
                            <div className="tp-stat"><span className="tp-stat-val">{isAnthology ? '1h05' : '1h05'}</span><span className="tp-stat-lbl">DURAÇÃO</span></div>
                            <div className="tp-stat"><span className="tp-stat-val">2024</span><span className="tp-stat-lbl">ANO</span></div>
                        </div>
                    </div>
                </div>
            </section>
            <section ref={typewriterRef} className="tp-typewriter-section">
                <div className="tp-typewriter-header">
                    <span className="tp-label">máquina de escrever</span>
                    <h2 className="tp-section-title">O Manuscrito</h2>
                    <p className="tp-sub">Selecione uma faixa acima para datilografar</p>
                </div>
                <div className="tp-manuscript">
                    {typingSong ? (
                        <>
                            <h3 className="tp-type-song-title">{typingSong.title}</h3>
                            <div className="tp-type-text">
                                {typedText}
                                <span className="tp-cursor" />
                            </div>
                        </>
                    ) : (
                        <p className="tp-type-placeholder">
                            "The only thing that's left is the manuscript..."<br /><br />
                            Selecione uma faixa na tracklist para ver o manuscrito sendo datilografado.
                        </p>
                    )}
                </div>
            </section>
            <section className="tp-records-section">
                <div className="tp-records-inner">
                    <span className="tp-label">colaborações & recordes</span>
                    <h2 className="tp-section-title">Os Números</h2>
                    <div className="tp-editorial-grid">
                        <div className="tp-editorial-card">
                            <div className="tp-ed-icon">🎤</div>
                            <span className="tp-ed-label">Colaboradores</span>
                            <p className="tp-ed-value">Post Malone</p>
                            <p className="tp-ed-sub">Florence + The Machine</p>
                        </div>
                        <div className="tp-editorial-card">
                            <div className="tp-ed-icon">🎹</div>
                            <span className="tp-ed-label">Produção</span>
                            <p className="tp-ed-value">Aaron Dessner</p>
                            <p className="tp-ed-sub">Jack Antonoff</p>
                        </div>
                        <div className="tp-editorial-card">
                            <div className="tp-ed-icon">📊</div>
                            <span className="tp-ed-label">Recorde de Streams</span>
                            <p className="tp-ed-value">300 Milhões</p>
                            <p className="tp-ed-sub">em 24 horas no Spotify</p>
                        </div>
                        <div className="tp-editorial-card">
                            <div className="tp-ed-icon">🏆</div>
                            <span className="tp-ed-label">Billboard Hot 100</span>
                            <p className="tp-ed-value">14 Músicas</p>
                            <p className="tp-ed-sub">simultaneamente no chart</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="tp-mv-section">
                <div className="tp-mv-inner">
                    <span className="tp-label">clipes</span>
                    <h2 className="tp-section-title">the visuals</h2>
                    <div className="tp-mv-wrapper">
                        <button className="tp-mv-arrow" onClick={() => setActiveMv(p => Math.max(0, p - 1))}>‹</button>
                        <div className="tp-mv-viewport">
                            <div className="tp-mv-track" style={{ transform: `translateX(-${activeMv * 100}%)` }}>
                                {MVS.map((mv, i) => (
                                    <div key={i} className="tp-mv-slide">
                                        <div className="tp-mv-frame">
                                            <iframe src={mv.url} title={mv.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
                                        </div>
                                        <p className="tp-mv-name">{mv.title} {mv.feat && <span style={{ fontSize: '0.8rem', color: 'var(--tp-grey)' }}>{mv.feat}</span>}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button className="tp-mv-arrow" onClick={() => setActiveMv(p => Math.min(MVS.length - 1, p + 1))}>›</button>
                    </div>
                    <div className="tp-mv-dots">
                        {MVS.map((_, i) => (<button key={i} className={`tp-mv-dot ${activeMv === i ? 'active' : ''}`} onClick={() => setActiveMv(i)} />))}
                    </div>
                </div>
            </section>
            <section className="tp-eras-act">
                <div className="tp-eras-act-inner">
                    <span className="tp-label">the eras tour</span>
                    <h2 className="tp-section-title">Tortured Poets Act</h2>
                    <p className="tp-sub" style={{ maxWidth: 600, margin: '0 auto 20px' }}>
                        O act de TTPD na Eras Tour é um dos momentos mais emocionais do show,
                        com cenário de máquinas de escrever gigantes e poemas projetados no palco.
                    </p>
                    <div className="tp-setlist-grid">
                        {SETLIST.map((s, i) => (
                            <div key={i} className="tp-setlist-item">
                                <span className="tp-setlist-num">{String(i + 1).padStart(2, '0')}</span>
                                <span className="tp-setlist-name">{s}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="tp-gallery">
                <div className="tp-gallery-header">
                    <span className="tp-label">arquivo fotográfico</span>
                    <h2 className="tp-section-title">the evidence</h2>
                </div>
                <div
                    className="tp-filmstrip"
                    ref={filmstripRef}
                    onMouseDown={handleDragStart}
                    onMouseLeave={handleDragEnd}
                    onMouseUp={handleDragEnd}
                    onMouseMove={handleDragMove}
                >
                    {GALLERY.map((img, i) => (
                        <div key={i} className="tp-film-item">
                            <img src={img} alt={`TTPD Gallery ${i + 1}`} loading="lazy" />
                        </div>
                    ))}
                </div>
            </section>
            <section className="tp-eras">
                <span className="tp-label">navegue entre as eras</span>
                <h2 className="tp-section-title" style={{ color: 'var(--tp-cream)' }}>outras eras</h2>
                <div className="tp-eras-grid">
                    {ERAS.map((e, i) => (
                        <Link key={i} to={e.path} className="tp-era-card" style={{ '--ea': e.color }}>
                            <span className="tp-era-year" style={{ color: e.color }}>{e.year}</span>
                            <span className="tp-era-name" style={{ color: 'var(--tp-cream)' }}>{e.name}</span>
                        </Link>
                    ))}
                </div>
            </section>
            <RatingSection era="ttpd" tracks={[...TRACKS_TTPD, ...TRACKS_ANTHOLOGY]} theme={eraThemes.ttpd} />
            <footer className="tp-footer">
                <div>
                    <p className="tp-footer-logo">TTPD</p>
                    <p className="tp-footer-copy">© 2024 Taylor Swift — The Tortured Poets Department</p>
                </div>
                <div className="tp-footer-links">
                    <a href="https://www.taylorswift.com" target="_blank" rel="noopener noreferrer">Site Oficial</a>
                    <a href="https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02" target="_blank" rel="noopener noreferrer">Spotify</a>
                    <a href="https://music.apple.com/us/artist/taylor-swift/159260351" target="_blank" rel="noopener noreferrer">Apple Music</a>
                </div>
            </footer>
            <audio ref={audioRef} />
        </main>
    );
};
export default TTPD;
