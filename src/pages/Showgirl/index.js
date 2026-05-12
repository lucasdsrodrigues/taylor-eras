import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './showgirl.css';
import RatingSection from '../../components/RatingSection/RatingSection';
import { eraThemes } from '../../utils/eraThemes';

// URL da capa do álbum — hospedada externamente
const COVER = "https://static.wikia.nocookie.net/taylor-swift/images/a/a6/The_Life_of_a_Showgirl_-_The_Crowd_is_Your_King.jpeg/revision/latest/scale-to-width-down/1000?cb=20250924184239";

// Tracklist — 12 faixas com duração e flags de single
const TRACKS = [
    { id: 1,  title: "The Fate of Ophelia",  time: "3:46", single: true },
    { id: 2,  title: "Elizabeth Taylor",      time: "3:28", single: true },
    { id: 3,  title: "Opalite",              time: "3:55", single: true },
    { id: 4,  title: "Father Figure",        time: "3:32" },
    { id: 5,  title: "Eldest Daughter",       time: "4:06" },
    { id: 6,  title: "Ruin the Friendship",  time: "3:40" },
    { id: 7,  title: "Actually Romantic",     time: "2:43" },
    { id: 8,  title: "Wi$h Li$t",            time: "3:27" },
    { id: 9,  title: "Wood",                 time: "2:30" },
    { id: 10, title: "CANCELLED!",           time: "3:31" },
    { id: 11, title: "Honey",                time: "3:01" },
    { id: 12, title: "The Life of a Showgirl", time: "3:48", feat: "feat. Sabrina Carpenter" },
];

// Clipes musicais — URLs de embed do YouTube com parâmetros de qualidade
// rel=0 desativa vídeos relacionados, modestbranding=1 esconde o logo do YouTube
const MVS = [
    { title: "The Fate of Ophelia", url: "https://www.youtube.com/embed/ko70cExuzZM?rel=0&modestbranding=1&hd=1&vq=hd1080", thumb: "https://img.youtube.com/vi/ko70cExuzZM/hqdefault.jpg" },
    { title: "Opalite",             url: "https://www.youtube.com/embed/1FVF-9KQiPo?rel=0&modestbranding=1&hd=1&vq=hd1080", thumb: "https://img.youtube.com/vi/1FVF-9KQiPo/hqdefault.jpg" },
    { title: "Elizabeth Taylor",    url: "https://www.youtube.com/embed/WqbJT_vC0rs?rel=0&modestbranding=1&hd=1&vq=hd1080", thumb: "https://img.youtube.com/vi/WqbJT_vC0rs/hqdefault.jpg" },
];
const SPOTLIGHTS = [
    { title: "The Fate of Ophelia", lyrics: "The eldest daughter of a nobleman\nOphelia lived in fantasy\nBut love was a cold bed full of scorpions\nThe venom stole her sanity" },
    { title: "Ruin the Friendship", lyrics: "My advice is always ruin the friendship\nBetter that than regret it for all time\nShould've kissed you anyway\nAnd my advice is always answer the question\nBetter that than to ask it all your life" },
    { title: "Elizabeth Taylor", lyrics: "All my white diamonds and lovers are forever\nIn the papers, on the screen and in their minds\nAll my white diamonds and lovers are forever\nDon't you ever end up anything but mine..." },
    { title: "The Life of a Showgirl", lyrics: "She said: I'd sell my soul to have a taste\nOf a magnificent life that's all mine\nBut that's not what showgirls get\nThey leave us for dead" },
];
const GALLERY = [
    "https://static.wikia.nocookie.net/taylor-swift/images/9/9b/The_Life_of_a_Showgirl_unedited_backcover.jpg/revision/latest/scale-to-width-down/1000?cb=20251004142401",
    "https://static.wikia.nocookie.net/taylor-swift/images/f/fb/The_life_of_a_showgirl_photoshoot_52.jpg/revision/latest/scale-to-width-down/1000?cb=20260307180903",
    "https://static.wikia.nocookie.net/taylor-swift/images/5/55/The_life_of_a_showgirl_photoshoot_51.jpg/revision/latest/scale-to-width-down/1000?cb=20260205094800",
    "https://static.wikia.nocookie.net/taylor-swift/images/a/a4/The_Life_of_a_Showgirl_photoshoot_13.jpeg/revision/latest/scale-to-width-down/1000?cb=20251004142225",
    "https://static.wikia.nocookie.net/taylor-swift/images/1/15/The_Life_of_a_Showgirl_photoshoot_30.jpeg/revision/latest/scale-to-width-down/1000?cb=20251108153749",
    "https://static.wikia.nocookie.net/taylor-swift/images/3/3c/The_Life_of_a_Showgirl_photoshoot_14.jpg/revision/latest/scale-to-width-down/1000?cb=20260405070052",
    "https://static.wikia.nocookie.net/taylor-swift/images/3/3f/The_Life_of_a_Showgirl_photoshoot_65.jpeg/revision/latest/scale-to-width-down/1000?cb=20260405070336",
    "https://static.wikia.nocookie.net/taylor-swift/images/7/73/Photo781965523925_inner_11-19-971-19-11-976-971-976.jpg/revision/latest/scale-to-width-down/1000?cb=20260220032612",
    "https://static.wikia.nocookie.net/taylor-swift/images/6/6e/The_Life_of_a_Showgirl_photoshoot_7.jpg/revision/latest/scale-to-width-down/1000?cb=20250925010142",
    "https://static.wikia.nocookie.net/taylor-swift/images/a/ab/The_Life_of_a_Showgirl_photoshoot_10Alt.jpg/revision/latest/scale-to-width-down/1000?cb=20250926203257",
    "https://static.wikia.nocookie.net/taylor-swift/images/d/db/The_Life_of_a_Showgirl_photoshoot_8.jpg/revision/latest/scale-to-width-down/1000?cb=20250814001735",
    "https://static.wikia.nocookie.net/taylor-swift/images/6/65/The_Life_of_a_Showgirl_photoshoot_2.jpg/revision/latest/scale-to-width-down/1000?cb=20250924231149",
    "https://static.wikia.nocookie.net/taylor-swift/images/3/32/The_Life_of_a_Showgirl_photoshoot_22.jpeg/revision/latest/scale-to-width-down/1000?cb=20250924231101",
    "https://static.wikia.nocookie.net/taylor-swift/images/f/fd/The_life_of_a_showgirl_photoshoot_62.png/revision/latest/scale-to-width-down/1000?cb=20260225112504",
    "https://static.wikia.nocookie.net/taylor-swift/images/3/3e/The_Life_of_a_Showgirl_photoshoot_40Alt.jpeg/revision/latest/scale-to-width-down/1000?cb=20251110152433",
    "https://static.wikia.nocookie.net/taylor-swift/images/1/1b/The_Life_of_a_Showgirl_photoshoot_29.jpeg/revision/latest/scale-to-width-down/1000?cb=20251108153716",
    "https://static.wikia.nocookie.net/taylor-swift/images/e/ee/The_Life_of_a_Showgirl_photoshoot_35.jpeg/revision/latest/scale-to-width-down/1000?cb=20251003041528",
];
const ERAS = [
    { name: "Debut",      path: "/debut",      color: "#7ec8a0" },
    { name: "Fearless",   path: "/fearless",   color: "#c9a227" },
    { name: "Speak Now",  path: "/speak-now",  color: "#a855f7" },
    { name: "Red",        path: "/red",        color: "#991b1b" },
    { name: "1989",       path: "/1989",       color: "#87ceeb" },
    { name: "Reputation", path: "/reputation", color: "#2d2d2d" },
    { name: "Lover",      path: "/lover",      color: "#ff9ec4" },
    { name: "Folklore",   path: "/folklore",   color: "#8a9a8a" },
    { name: "Evermore",   path: "/evermore",   color: "#cc621b" },
    { name: "Midnights",  path: "/midnights",  color: "#7b8aff" },
    { name: "TTPD",       path: "/ttpd",       color: "#a79e8f" },
];
const SPARKLE_COUNT = 25;
const Showgirl = () => {
    const [loaded, setLoaded] = useState(false);
    const [activeSpot, setActiveSpot] = useState(0);
    const [activeMv, setActiveMv] = useState(0);
    const filmstripRef = useRef(null);
    const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 });
    useEffect(() => {
        setTimeout(() => setLoaded(true), 100);
        window.scrollTo(0, 0);
        document.body.style.backgroundColor = '#120c10';
        document.body.style.backgroundImage = 'none';
        return () => { document.body.style.backgroundColor = ''; document.body.style.backgroundImage = ''; };
    }, []);
    useEffect(() => {
        const els = document.querySelectorAll('.show-about, .show-tracklist, .show-spotlight, .show-collabs, .show-awards, .show-videos, .show-feat, .show-gallery, .show-eras');
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show-visible'); });
        }, { threshold: 0.1 });
        els.forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, []);
    const handleDragStart = (e) => {
        const el = filmstripRef.current; if (!el) return;
        dragState.current = { isDown: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft };
        el.style.cursor = 'grabbing';
    };
    const handleDragEnd = () => {
        const el = filmstripRef.current; if (!el) return;
        dragState.current.isDown = false;
        el.style.cursor = 'grab';
    };
    const handleDragMove = (e) => {
        if (!dragState.current.isDown) return;
        e.preventDefault();
        const el = filmstripRef.current;
        const x = e.pageX - el.offsetLeft;
        el.scrollLeft = dragState.current.scrollLeft - (x - dragState.current.startX) * 1.5;
    };
    const sparkles = Array.from({ length: SPARKLE_COUNT }, (_, i) => ({
        left: `${Math.random() * 100}%`,
        size: `${0.5 + Math.random() * 0.8}rem`,
        dur: `${4 + Math.random() * 6}s`,
        delay: `${Math.random() * 8}s`,
    }));
    return (
        <main className={`era-show-page ${loaded ? 'show-loaded' : ''}`}>
            <div className="show-sparkles">
                {sparkles.map((s, i) => (
                    <span key={i} className="show-sparkle" style={{ left: s.left, '--size': s.size, '--dur': s.dur, '--delay': s.delay }}>✦</span>
                ))}
            </div>
            <nav className="show-nav">
                <Link to="/ttpd" className="show-nav-link">← TTPD</Link>
                <span className="show-nav-logo">THE LIFE OF A SHOWGIRL</span>
                <Link to="/" className="show-nav-link">ERAS →</Link>
            </nav>
            <header className="show-hero">
                <div className="show-hero-bg" />
                <svg className="show-hero-svg" viewBox="0 0 1200 800" preserveAspectRatio="none">
                    <polygon points="200,0 0,800 400,800" fill="url(#spotL)" opacity="0.12" />
                    <polygon points="600,0 400,800 800,800" fill="url(#spotC)" opacity="0.1" />
                    <polygon points="1000,0 800,800 1200,800" fill="url(#spotR)" opacity="0.12" />
                    <path d="M0 0 Q30 200 10 400 Q-10 600 20 800" stroke="rgba(178,67,66,0.08)" strokeWidth="40" fill="none" />
                    <path d="M40 0 Q70 200 50 400 Q30 600 60 800" stroke="rgba(178,67,66,0.05)" strokeWidth="25" fill="none" />
                    <path d="M1200 0 Q1170 200 1190 400 Q1210 600 1180 800" stroke="rgba(178,67,66,0.08)" strokeWidth="40" fill="none" />
                    <path d="M1160 0 Q1130 200 1150 400 Q1170 600 1140 800" stroke="rgba(178,67,66,0.05)" strokeWidth="25" fill="none" />
                    <defs>
                        <radialGradient id="spotL" cx="50%" cy="0%" r="80%">
                            <stop offset="0%" stopColor="#e46c32" />
                            <stop offset="100%" stopColor="transparent" />
                        </radialGradient>
                        <radialGradient id="spotC" cx="50%" cy="0%" r="80%">
                            <stop offset="0%" stopColor="#d4a853" />
                            <stop offset="100%" stopColor="transparent" />
                        </radialGradient>
                        <radialGradient id="spotR" cx="50%" cy="0%" r="80%">
                            <stop offset="0%" stopColor="#5eb298" />
                            <stop offset="100%" stopColor="transparent" />
                        </radialGradient>
                    </defs>
                </svg>
                <div className="show-hero-centered">
                    <span className="show-hero-tag">ÁLBUM XII · 2025</span>
                    <div className="show-hero-cover-wrap">
                        <div className="show-hero-glow" />
                        <img src={COVER} alt="The Life of a Showgirl" className="show-hero-cover" />
                    </div>
                    <h1 className="show-hero-title">
                        <span className="show-title-l1">the life of a</span>
                        <span className="show-title-l2">Showgirl</span>
                    </h1>
                    <p className="show-hero-desc">
                        "I'd sell my soul to have a taste of a magnificent life that's all mine — but that's not what showgirls get."
                    </p>
                    <div className="show-hero-stats">
                        <div className="show-stat">
                            <span className="show-stat-num">12</span>
                            <span className="show-stat-label">FAIXAS</span>
                        </div>
                        <div className="show-stat-divider" />
                        <div className="show-stat">
                            <span className="show-stat-num">2025</span>
                            <span className="show-stat-label">ANO</span>
                        </div>
                        <div className="show-stat-divider" />
                        <div className="show-stat">
                            <span className="show-stat-num">40min</span>
                            <span className="show-stat-label">DURAÇÃO</span>
                        </div>
                    </div>
                </div>
            </header>
            <section className="show-about">
                <div className="show-playbill">
                    <div className="show-playbill-header">
                        <span className="show-playbill-tag">TAYLOR SWIFT APRESENTA</span>
                        <h2 className="show-playbill-title">The Life of a Showgirl</h2>
                        <span className="show-playbill-sub">Um Álbum em Doze Atos</span>
                    </div>
                    <div className="show-playbill-divider">✦ ✦ ✦</div>
                    <div className="show-playbill-body">
                        <p>
                            <strong>The Life of a Showgirl</strong> é o décimo segundo álbum de estúdio de Taylor Swift,
                            uma imersão no universo do <em>cabaret, burlesque e teatro</em> — onde cada faixa é um ato
                            performático que explora a dualidade entre a persona pública e a pessoa por trás das cortinas.
                        </p>
                        <p>
                            Produzido por <strong>Taylor Swift</strong>, <strong>Max Martin</strong> e <strong>Shellback</strong>,
                            o álbum marca um retorno à produção pop maximialista, com arranjos orquestrais, metais
                            cinematográficos e melodias que ecoam os grandes musicais da Broadway.
                        </p>
                        <p>
                            De <em>Ophelia</em> a <em>Elizabeth Taylor</em>, cada personagem empresta sua tragédia
                            e glamour para construir a narrativa de uma artista que vive sob os holofotes — e o preço que paga por isso.
                        </p>
                    </div>
                </div>
            </section>
            <section className="show-tracklist">
                <div className="show-tracklist-inner">
                    <div className="show-section-header">
                        <span className="show-label">programa</span>
                        <h2 className="show-section-title">Tracklist</h2>
                    </div>
                    <div className="show-tracklist-layout">
                        <div className="show-tracklist-cover">
                            <img src={COVER} alt="Cover" className="show-cover-img" />
                            <span className="show-cover-label">12 FAIXAS · 2025</span>
                        </div>
                        <div className="show-tracks-list">
                            {TRACKS.map((t, i) => (
                                <div key={t.id} className="show-trk" style={{ '--ti': i }}>
                                    <span className="show-trk-n">{String(i + 1).padStart(2, '0')}</span>
                                    <span className="show-trk-name">
                                        {t.title}
                                        {t.feat && <span className="show-trk-feat">{t.feat}</span>}
                                    </span>
                                    {t.single && <span className="show-trk-single">SINGLE</span>}
                                    <span className="show-trk-time">{t.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            <section className="show-spotlight">
                <div className="show-spotlight-inner">
                    <div className="show-section-header">
                        <span className="show-label">sob os holofotes</span>
                        <h2 className="show-section-title">Spotlight</h2>
                        <p className="show-section-sub">Selecione um ato para ler sob o feixe de luz</p>
                    </div>
                    <div className="show-spotlight-tabs">
                        {SPOTLIGHTS.map((s, i) => (
                            <button key={i} className={`show-spot-tab ${activeSpot === i ? 'active' : ''}`} onClick={() => setActiveSpot(i)}>
                                {s.title}
                            </button>
                        ))}
                    </div>
                    <div className="show-spotlight-stage">
                        <div className="show-spotlight-beam" />
                        <blockquote className="show-spotlight-quote" style={{ whiteSpace: 'pre-line' }}>
                            {SPOTLIGHTS[activeSpot].lyrics}
                        </blockquote>
                        <cite className="show-spotlight-cite">— {SPOTLIGHTS[activeSpot].title}</cite>
                    </div>
                </div>
            </section>
            <section className="show-collabs">
                <div className="show-section-header">
                    <span className="show-label">bastidores</span>
                    <h2 className="show-section-title">Produção</h2>
                </div>
                <div className="show-marquee-row">
                    {[
                        { role: "ARTISTA & PRODUTORA", name: "Taylor Swift", credit: "COMPOSITORA · DIRETORA CRIATIVA", desc: "Escreveu e co-produziu todas as 12 faixas, conduzindo a direção artística do álbum do manuscrito ao palco." },
                        { role: "PRODUTOR", name: "Max Martin", credit: "PRODUÇÃO · ARRANJOS", desc: "Trouxe a potência pop maximialista que define o som orquestral e cinematográfico do álbum." },
                        { role: "PRODUTOR", name: "Shellback", credit: "PRODUÇÃO · PROGRAMAÇÃO", desc: "Parceiro de longa data de Max Martin, construiu as bases rítmicas e eletrônicas que sustentam cada ato." },
                    ].map((c, i) => (
                        <div key={i} className="show-marquee-card" style={{ '--mi': i }}>
                            <div className="show-marquee-lights">
                                {Array.from({ length: 8 }, (_, b) => (
                                    <span key={b} className="show-marquee-bulb" style={{ '--bi': b }} />
                                ))}
                            </div>
                            <span className="show-marquee-role">{c.role}</span>
                            <h3 className="show-marquee-name">{c.name}</h3>
                            <span className="show-marquee-credit">{c.credit}</span>
                            <p className="show-marquee-desc">{c.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
            <section className="show-awards">
                <div className="show-awards-title">
                    <span className="show-label">recordes</span>
                    <h2 className="show-section-title">Os Números</h2>
                </div>
                <div className="show-awards-grid">
                    {[
                        { big: "🏆", sub: "Álbum #1 em 25+ países na primeira semana" },
                        { big: "📊", sub: "Álbum feminino mais vendido de 2025" },
                        { big: "🎵", sub: "3 singles no Top 10 da Billboard Hot 100" },
                        { big: "💿", sub: "1 milhão de cópias vendidas em 3 dias" },
                        { big: "🎬", sub: "Fate of Ophelia: 200M+ views em 1 mês" },
                        { big: "🌍", sub: "Turnê mundial anunciada para 2026" },
                    ].map((a, i) => (
                        <div key={i} className="show-award" style={{ '--ai': i }}>
                            <span className="show-award-big">{a.big}</span>
                            <span className="show-award-sub">{a.sub}</span>
                        </div>
                    ))}
                </div>
            </section>
            <section className="show-videos">
                <div className="show-videos-title">
                    <span className="show-label">palco visual</span>
                    <h2 className="show-section-title">Music Videos</h2>
                </div>
                <div className="show-videos-main">
                    <div className="show-videos-player">
                        <iframe
                            src={MVS[activeMv].url}
                            title={MVS[activeMv].title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        />
                    </div>
                    <div className="show-videos-selector">
                        {MVS.map((mv, i) => (
                            <button key={i} className={`show-vid-thumb ${activeMv === i ? 'active' : ''}`} onClick={() => setActiveMv(i)}>
                                <img src={mv.thumb} alt={mv.title} />
                                <span>{mv.title}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>
            <section className="show-feat">
                <div className="show-feat-inner">
                    <div className="show-feat-photo">
                        <div className="show-feat-glow" />
                        <img
                            src="https://recreio.com.br/wp-content/uploads/2025/08/GettyImages-2197322146-capa-800x450.jpg"
                            alt="Taylor Swift & Sabrina Carpenter"
                            className="show-feat-img"
                        />
                    </div>
                    <div className="show-feat-text">
                        <span className="show-label">colaboração</span>
                        <h2 className="show-section-title">Taylor & Sabrina</h2>
                        <p className="show-feat-desc">
                            A faixa-título <strong>"The Life of a Showgirl"</strong> conta com a participação especial de
                            <em> Sabrina Carpenter</em>, unindo duas gerações de artistas pop em uma balada teatral sobre
                            o preço da fama e a solidão dos bastidores.
                        </p>
                        <blockquote className="show-feat-lyric">
                            "She said: I'd sell my soul to have a taste<br />
                            Of a magnificent life that's all mine<br />
                            But that's not what showgirls get<br />
                            <em>They leave us for dead</em>"
                        </blockquote>
                    </div>
                </div>
            </section>
            <section className="show-gallery">
                <div className="show-gallery-title show-section-header" style={{ textAlign: 'left' }}>
                    <span className="show-label">backstage</span>
                    <h2 className="show-section-title">Arquivo Fotográfico</h2>
                </div>
                <div
                    className="show-filmstrip"
                    ref={filmstripRef}
                    onMouseDown={handleDragStart}
                    onMouseLeave={handleDragEnd}
                    onMouseUp={handleDragEnd}
                    onMouseMove={handleDragMove}
                >
                    {GALLERY.map((img, i) => (
                        <div key={i} className="show-film-frame">
                            <img src={img} alt={`Showgirl ${i + 1}`} loading="lazy" draggable="false" />
                        </div>
                    ))}
                </div>
            </section>
            <section className="show-eras">
                <div className="show-eras-nav-title">
                    <span className="show-label">navegue entre as eras</span>
                    <h2 className="show-section-title">Outras Eras</h2>
                </div>
                <div className="show-eras-row">
                    {ERAS.map((e, i) => (
                        <Link key={i} to={e.path} className="show-era-pill" style={{ '--ec': e.color }}>
                            {e.name}
                        </Link>
                    ))}
                </div>
            </section>
            <RatingSection era="showgirl" tracks={TRACKS} theme={eraThemes.showgirl} />
            <footer className="show-footer">
                <div>
                    <span className="show-footer-logo">Showgirl</span>
                    <p className="show-footer-copy">© 2025 Taylor Swift — The Life of a Showgirl</p>
                </div>
                <div className="show-footer-links">
                    <a href="https://www.taylorswift.com" target="_blank" rel="noopener noreferrer">Site Oficial</a>
                    <a href="https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02" target="_blank" rel="noopener noreferrer">Spotify</a>
                    <a href="https://music.apple.com/us/artist/taylor-swift/159260351" target="_blank" rel="noopener noreferrer">Apple Music</a>
                </div>
            </footer>
        </main>
    );
};
export default Showgirl;
