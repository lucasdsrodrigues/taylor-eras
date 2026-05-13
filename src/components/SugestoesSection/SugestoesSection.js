// Seção de Notícias da Comunidade — exibe sugestões aprovadas com comentários moderados
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import SugestaoModal from '../SugestaoModal/SugestaoModal';
import './SugestoesSection.css';

// Mapa de cores por categoria — reutilizado do NoticiasSection
const CATEGORIA_CORES = {
  'Tour': '#e46c32',
  'Streaming': '#7b8aff',
  'Premiação': '#c9a227',
  'Estilo': '#ff9ec4',
  'Lançamento': '#a855f7',
  'Outro': '#8a9a8a',
};

const SugestoesSection = () => {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todas');
  const [isVisible, setIsVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  // Comentários: { noticiaId: [array de comentários] }
  const [comentarios, setComentarios] = useState({});
  const [comentarioAberto, setComentarioAberto] = useState(null);
  const [textoComentario, setTextoComentario] = useState('');

  const sectionRef = useRef(null);
  const { isLoggedIn, username, token } = useAuth();

  // Busca sugestões aprovadas
  const fetchNoticias = async () => {
    try {
      const res = await fetch('http://localhost:3001/noticias');
      if (!res.ok) throw new Error('Erro');
      const data = await res.json();
      setNoticias(data);
    } catch (err) {
      console.error('Erro ao buscar notícias da comunidade:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNoticias(); }, []);

  // Observer pra animação de entrada
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Busca comentários de uma notícia
  const fetchComentarios = async (noticiaId) => {
    try {
      const res = await fetch(`http://localhost:3001/comentarios/${noticiaId}`);
      const data = await res.json();
      setComentarios(prev => ({ ...prev, [noticiaId]: data }));
    } catch (err) {
      console.error('Erro ao buscar comentários:', err);
    }
  };

  const toggleComentarios = (noticiaId) => {
    if (comentarioAberto === noticiaId) {
      setComentarioAberto(null);
    } else {
      setComentarioAberto(noticiaId);
      fetchComentarios(noticiaId);
    }
    setTextoComentario('');
  };

  const handleComentar = async (noticiaId) => {
    if (!isLoggedIn || !textoComentario.trim()) return;
    try {
      const res = await fetch('http://localhost:3001/comentarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ noticia_id: noticiaId, texto: textoComentario.trim() })
      });
      if (res.ok) {
        setTextoComentario('');
        fetchComentarios(noticiaId);
      }
    } catch (err) {
      console.error('Erro ao comentar:', err);
    }
  };

  const handleDeletarComentario = async (comentarioId, noticiaId) => {
    try {
      const res = await fetch(`http://localhost:3001/comentarios/${comentarioId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchComentarios(noticiaId);
    } catch (err) {
      console.error('Erro ao deletar comentário:', err);
    }
  };

  const formatarData = (dataStr) => {
    if (!dataStr) return '';
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const categorias = ['Todas', ...new Set(noticias.map(n => n.categoria))];
  const noticiasFiltradas = categoriaAtiva === 'Todas'
    ? noticias
    : noticias.filter(n => n.categoria === categoriaAtiva);

  return (
    <>
      <section
        ref={sectionRef}
        className={`sugestoes-section ${isVisible ? 'sugestoes-visible' : ''}`}
      >
        <div className="sugestoes-inner">
          <div className="sugestoes-header">
            <span className="sugestoes-label">✦ comunidade swiftie</span>
            <h2 className="sugestoes-title">Notícias da Comunidade</h2>
            <p className="sugestoes-subtitle">Notícias enviadas e curadas pela comunidade de fãs</p>
            {isLoggedIn && (
              <button className="sugestoes-sugerir-btn" onClick={() => setModalOpen(true)}>
                <span>✦</span> Sugerir Notícia
              </button>
            )}
          </div>

          {/* Filtros */}
          {noticias.length > 0 && (
            <div className="sugestoes-filtros">
              {categorias.map(cat => (
                <button
                  key={cat}
                  className={`sugestoes-filtro-btn ${categoriaAtiva === cat ? 'ativo' : ''}`}
                  onClick={() => setCategoriaAtiva(cat)}
                  style={{ '--filtro-cor': CATEGORIA_CORES[cat] || '#7b8aff' }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="sugestoes-loading">
              <div className="sugestoes-spinner" />
              <span>Carregando notícias da comunidade...</span>
            </div>
          ) : noticias.length === 0 ? (
            <div className="sugestoes-empty">
              <span className="sugestoes-empty-icon">📝</span>
              <p>Nenhuma notícia da comunidade ainda.</p>
              {isLoggedIn && <p className="sugestoes-empty-cta">Seja o primeiro a sugerir!</p>}
            </div>
          ) : (
            <div className="sugestoes-grid">
              {noticiasFiltradas.map((noticia, index) => (
                <article
                  key={noticia.id}
                  className="sugestao-card"
                  style={{ '--card-delay': `${index * 0.1}s`, '--cat-cor': CATEGORIA_CORES[noticia.categoria] || '#8a9a8a' }}
                >
                  {/* Badge "Enviado pela comunidade" */}
                  <div className="sugestao-community-badge">
                    <span className="sugestao-badge-icon">✦</span>
                    <span>Enviado pela comunidade</span>
                  </div>

                  <div className="sugestao-body">
                    <div className="sugestao-meta">
                      <span className="sugestao-categoria">{noticia.categoria}</span>
                      <span className="sugestao-data">{formatarData(noticia.data_envio)}</span>
                    </div>
                    <h3 className="sugestao-titulo">{noticia.titulo}</h3>
                    <p className="sugestao-conteudo">{noticia.conteudo}</p>
                    <div className="sugestao-autor-row">
                      <span className="sugestao-autor-avatar">✦</span>
                      <span className="sugestao-autor-nome">@{noticia.autor || 'anônimo'}</span>
                    </div>

                    {/* Barra de ações: Comentar */}
                    <div className="sugestao-acoes">
                      <button
                        className={`sugestao-acao-btn ${comentarioAberto === noticia.id ? 'ativo' : ''}`}
                        onClick={() => toggleComentarios(noticia.id)}
                      >
                        <span className="acao-icon">💬</span>
                        <span className="acao-count">{(comentarios[noticia.id] || []).length}</span>
                      </button>
                    </div>

                    {/* Seção de comentários expandível */}
                    {comentarioAberto === noticia.id && (
                      <div className="sugestao-comentarios">
                        {(comentarios[noticia.id] || []).length > 0 ? (
                          <div className="comentarios-lista">
                            {(comentarios[noticia.id] || []).map((c) => (
                              <div key={c.id} className="comentario-item">
                                <div className="comentario-header">
                                  <span className="comentario-autor">@{c.autor}</span>
                                  <div className="comentario-header-right">
                                    <span className="comentario-data">{formatarData(c.data_comentario)}</span>
                                    {isLoggedIn && c.autor === username && (
                                      <button
                                        className="comentario-delete-btn"
                                        onClick={() => handleDeletarComentario(c.id, noticia.id)}
                                        title="Excluir comentário"
                                      >✕</button>
                                    )}
                                  </div>
                                </div>
                                <p className="comentario-texto">{c.texto}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="comentarios-vazio">Nenhum comentário ainda. Seja o primeiro!</p>
                        )}

                        {isLoggedIn ? (
                          <div className="comentario-form">
                            <input
                              type="text"
                              className="comentario-input"
                              placeholder="Escreva um comentário..."
                              value={textoComentario}
                              onChange={(e) => setTextoComentario(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleComentar(noticia.id); }}
                              maxLength={200}
                            />
                            <button
                              className="comentario-enviar"
                              onClick={() => handleComentar(noticia.id)}
                              disabled={!textoComentario.trim()}
                            >Enviar</button>
                          </div>
                        ) : (
                          <p className="comentarios-login-msg">Faça login para comentar</p>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <SugestaoModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSuccess={fetchNoticias} />
    </>
  );
};

export default SugestoesSection;
