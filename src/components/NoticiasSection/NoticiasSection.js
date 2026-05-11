import React, { useState, useEffect, useRef } from 'react';
import './NoticiasSection.css';

const CATEGORIA_CORES = {
  'Tour': '#e46c32',
  'Streaming': '#7b8aff',
  'Premiação': '#c9a227',
  'Estilo': '#ff9ec4',
  'Lançamento': '#a855f7',
};

const NoticiasSection = () => {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todas');
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const res = await fetch('http://localhost:3002/noticias.php');
        if (!res.ok) throw new Error('Erro ao buscar notícias');
        const data = await res.json();
        setNoticias(data.noticias || []);
      } catch (err) {
        setErro('Não foi possível carregar as notícias. Verifique se o servidor PHP está rodando na porta 3002.');
        console.error('Erro ao buscar notícias do PHP:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNoticias();
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setIsVisible(true); obs.disconnect(); }
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const formatarData = (dataStr) => {
    const data = new Date(dataStr + 'T00:00:00');
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const categorias = ['Todas', ...new Set(noticias.map(n => n.categoria))];

  const noticiasFiltradas = categoriaAtiva === 'Todas'
    ? noticias
    : noticias.filter(n => n.categoria === categoriaAtiva);

  return (
    <section
      ref={sectionRef}
      className={`noticias-section ${isVisible ? 'noticias-visible' : ''}`}
    >
      <div className="noticias-inner">
        <div className="noticias-header">
          <h2 className="noticias-title">Últimas Notícias</h2>
          <p className="noticias-subtitle">Fique por dentro de tudo que acontece no universo Swiftie</p>
        </div>

        {/* Filtro por categoria */}
        <div className="noticias-filtros">
          {categorias.map(cat => (
            <button
              key={cat}
              className={`noticias-filtro-btn ${categoriaAtiva === cat ? 'ativo' : ''}`}
              onClick={() => setCategoriaAtiva(cat)}
              style={{
                '--filtro-cor': CATEGORIA_CORES[cat] || '#7b8aff',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="noticias-loading">
            <div className="noticias-spinner" />
            <span>Buscando notícias do servidor PHP...</span>
          </div>
        ) : erro ? (
          <div className="noticias-erro">
            <span className="noticias-erro-icon">⚠️</span>
            <p>{erro}</p>
            <code>cd php && php -S localhost:3002</code>
          </div>
        ) : (
          <div className="noticias-grid">
            {noticiasFiltradas.map((noticia, index) => (
              <article
                key={noticia.id}
                className="noticia-card"
                style={{ '--card-delay': `${index * 0.1}s`, '--cat-cor': CATEGORIA_CORES[noticia.categoria] || '#7b8aff' }}
              >
                <div className="noticia-img-wrap">
                  <img src={noticia.imagem} alt={noticia.titulo} className="noticia-img" loading="lazy" />
                  <span className="noticia-categoria">{noticia.categoria}</span>
                </div>
                <div className="noticia-body">
                  <div className="noticia-meta">
                    <span className="noticia-data">{formatarData(noticia.data)}</span>
                    <span className="noticia-fonte">{noticia.fonte}</span>
                  </div>
                  <h3 className="noticia-titulo">{noticia.titulo}</h3>
                  <p className="noticia-resumo">{noticia.resumo}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NoticiasSection;
