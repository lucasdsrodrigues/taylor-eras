import React, { useState, useEffect } from "react";
// Importo os 3 componentes que compõem a parte inferior da Home
import ErasCarousel from "../../components/ErasCarousel/ErasCarousel";
import Timeline from "../../components/Timeline/Timeline";
import NoticiasSection from "../../components/NoticiasSection/NoticiasSection";
// Importo o modal de login/cadastro e o hook de autenticação
import AuthModal from "../../components/AuthModal/AuthModal";
import { useAuth } from "../../context/AuthContext";
import './home.css';

// Cores temáticas de cada era — usadas nas partículas de fundo e na barra decorativa do hero
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

// Estatísticas da carreira — cada item vira um card na seção de números
const STATS = [
    { icon: "💿", big: "200M+", desc: "Discos vendidos mundialmente", color: "#c9a227" },
    { icon: "🏆", big: "14", desc: "Grammy Awards", color: "#a855f7" },
    { icon: "🎵", big: "12", desc: "Álbuns de estúdio", color: "#e46c32" },
    { icon: "🎪", big: "$2B+", desc: "Bilheteria da Eras Tour", color: "#ff9ec4" },
    { icon: "🥇", big: "4", desc: "Album of the Year (recorde)", color: "#7b8aff" },
    { icon: "🎧", big: "100B+", desc: "Streams globais", color: "#87ceeb" },
];

// Dados da seção "Jornada" — cada item é um bloco na timeline narrativa
const JOURNEY = [
    { year: "2006 — 2010", title: "A Ascensão Country", desc: "De uma adolescente de 16 anos em Nashville que escrevia músicas no caderno ao fenômeno que redefiniu o country-pop com Fearless — o álbum mais jovem a ganhar o Grammy de Álbum do Ano.", color: "#7ec8a0" },
    { year: "2014 — 2017", title: "A Transição Pop", desc: "1989 marcou a reinvenção total: de Nashville para Nova York, de country para synth-pop. Reputation respondeu ao mundo que tentou cancelá-la — e ela voltou mais forte que nunca.", color: "#87ceeb" },
    { year: "2019 — 2020", title: "Queda e Renascimento", desc: "Lover trouxe liberdade criativa. Depois, em plena pandemia, Folklore e Evermore nasceram como cartas de amor à introspecção — provando que Taylor poderia dominar qualquer gênero.", color: "#8a9a8a" },
    { year: "2022 — 2024", title: "A Poeta Torturada", desc: "Midnights quebrou recordes na primeira semana. A The Eras Tour se tornou a maior turnê da história. TTPD quebrou mais recordes, vendendo 2 milhões na primeira semana.", color: "#7b8aff" },
    { year: "2025", title: "A Showgirl", desc: "The Life of a Showgirl encerrou uma era e abriu um novo capítulo — o álbum mais teatral, visceral e confessional de sua carreira. O palco é dela, sempre foi.", color: "#e46c32" },
];

// Quantidade de partículas flutuantes no fundo da Home
const PARTICLE_COUNT = 30;

function Home() {
    // Estado compartilhado entre ErasCarousel e Timeline — ambos precisam saber qual era tá ativa
    // Por isso o estado mora aqui no pai (Home) e é passado como prop pros dois
    const [currentIndex, setCurrentIndex] = useState(0);
    // Flag de carregamento pra ativar a animação de entrada suave
    const [loaded, setLoaded] = useState(false);

    // Hook de autenticação — pego o estado de login e as funções do modal
    const { isLoggedIn, username, logout, openAuthModal } = useAuth();

    // Efeito que roda quando a Home monta — configura o fundo e ativa a animação
    useEffect(() => {
        setTimeout(() => setLoaded(true), 100);
        // Forço o fundo escuro no body porque a Home tem um design próprio
        // AVISO: se não limpar no return, o fundo escuro vaza pras outras páginas
        document.body.style.backgroundColor = '#0a0a0f';
        document.body.style.backgroundImage = 'none';
        return () => { document.body.style.backgroundColor = ''; document.body.style.backgroundImage = ''; };
    }, []);

    /**
     * IntersectionObserver pra animar as seções quando entram na viewport
     * 
     * querySelectorAll() seleciona TODOS os elementos que batem com o seletor CSS
     * Aqui pego as seções about, stats e journey pra adicionar a classe 'home-visible'
     * quando cada uma entra na tela — isso ativa as animações de fade-in/slide-up no CSS
     * 
     * threshold: 0.1 = ativa quando 10% do elemento tá visível
     */
    useEffect(() => {
        const els = document.querySelectorAll('.home-about, .home-stats, .home-journey');
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('home-visible'); });
        }, { threshold: 0.1 });
        els.forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    /**
     * Gero as partículas flutuantes do fundo
     * Array.from({ length: N }) cria um array com N posições — é um truque pra gerar N itens
     * Cada partícula tem posição, cor (ciclando pelas eras), tamanho e timing aleatórios
     * O operador % (módulo) faz a cor ciclar: 0→debut, 1→fearless, ..., 12→debut de novo
     */
    const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        left: `${Math.random() * 100}%`,
        color: ERA_COLORS[i % ERA_COLORS.length].color,
        size: `${3 + Math.random() * 5}px`,
        dur: `${6 + Math.random() * 10}s`,
        delay: `${Math.random() * 12}s`,
    }));

    return (
        <main className={`home-page ${loaded ? 'home-loaded' : ''}`}>
            {/* Partículas flutuantes no fundo — cada uma é uma div com variáveis CSS */}
            {/* O CSS usa essas variáveis (--pc, --ps, --pd, --pdelay) pra animar */}
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

            {/* Hero: banner principal com SVG decorativo, título e barra de cores */}
            <header className="home-hero">
                {/* SVG com triângulos decorativos — cada um tem um gradiente radial de uma cor de era */}
                {/* preserveAspectRatio="none" faz o SVG esticar pra cobrir o container todo */}
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
                {/* Botão de login/logout no canto superior direito do hero */}
                <div className="home-auth-area">
                    {isLoggedIn ? (
                        // Se logado: mostra o nome do usuário e botão de sair
                        <div className="home-user-info">
                            <span className="home-user-avatar">✦</span>
                            <span className="home-user-name">{username}</span>
                            <button className="home-logout-btn" onClick={logout}>Sair</button>
                        </div>
                    ) : (
                        // Se deslogado: botão pra abrir o modal de login/cadastro
                        <button className="home-login-btn" onClick={openAuthModal}>
                            <span className="home-login-icon">👤</span>
                            Login / Cadastro
                        </button>
                    )}
                </div>
                <span className="home-hero-tag">12 ÁLBUNS · 18 ANOS · 1 LENDA</span>
                <h1 className="home-hero-title">Taylor Swift</h1>
                <p className="home-hero-sub">The story of the greatest musical phenomenon of our generation</p>
                {/* Barra de cores das eras — cada era vira uma barrinha colorida */}
                <div className="home-era-strip">
                    {ERA_COLORS.map((e, i) => (
                        <div key={i} className="home-era-bar" style={{ background: e.color, '--eb': e.color }} title={e.name} />
                    ))}
                </div>
                {/* Indicador de scroll animado */}
                <div className="home-scroll-cue">
                    <div className="home-scroll-line" />
                    <span>SCROLL</span>
                </div>
            </header>

            {/* Seção "Quem é ela?" — bio com foto e fatos rápidos */}
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

            {/* Seção de estatísticas — grid de cards com números impressionantes */}
            <section className="home-stats">
                <div className="home-stats-header">
                    <span className="home-label">os números</span>
                    <h2 className="home-title">Uma Carreira em Números</h2>
                </div>
                <div className="home-stats-grid">
                    {STATS.map((s, i) => (
                        // --sc é a variável CSS que o card usa pra colorir o ícone e o hover
                        <div key={i} className="home-stat-card" style={{ '--sc': s.color }}>
                            <div className="home-stat-icon">{s.icon}</div>
                            <h3 className="home-stat-big">{s.big}</h3>
                            <p className="home-stat-desc">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Seção "A Jornada" — timeline narrativa da carreira */}
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

            {/* Seção de notícias — consome a API PHP na porta 3002 */}
            <NoticiasSection />

            {/* Carrossel + Timeline — ambos compartilham o currentIndex */}
            <div className="home-carousel-wrap">
                <ErasCarousel
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                />
                {/* A Timeline sincroniza com o carrossel: clicar numa era muda o slide */}
                <Timeline
                    currentIndex={currentIndex}
                    onSelectEra={(index) => setCurrentIndex(index)}
                />
            </div>

            {/* Footer da Home */}
            <footer className="home-footer">
                <div className="home-footer-left">
                    <p className="home-footer-logo">Taylor Swift — Eras</p>
                    <p className="home-footer-copy">© 2026 · Conteúdo para fins educacionais</p>
                    {/* Easter egg: referência à música "Long Story Short" */}
                    <p className="home-footer-easter">long story short, i survived</p>
                </div>
                <div className="home-footer-links">
                    {/* target="_blank" abre em nova aba */}
                    {/* rel="noopener noreferrer" é segurança: impede que a página aberta */}
                    {/* acesse window.opener da página original (previne ataques de phishing) */}
                    <a href="https://www.taylorswift.com" target="_blank" rel="noopener noreferrer">Site Oficial</a>
                    <a href="https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02" target="_blank" rel="noopener noreferrer">Spotify</a>
                    <a href="https://music.apple.com/us/artist/taylor-swift/159260351" target="_blank" rel="noopener noreferrer">Apple Music</a>
                </div>
            </footer>

            {/* Modal de login/cadastro — renderizado condicionalmente pelo AuthContext */}
            <AuthModal />
        </main>
    );
}

export default Home;