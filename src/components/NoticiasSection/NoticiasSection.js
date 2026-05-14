// Importo o React e os hooks que preciso pra estado, efeitos e referências
import React, { useState, useEffect, useRef } from 'react';
// Importo o hook de autenticação pra saber se o usuário está logado
import { useAuth } from '../../context/AuthContext';
// Importo o CSS específico dessa seção de notícias
import './NoticiasSection.css';

// Mapa de cores pra cada categoria de notícia — cada categoria tem uma cor temática
const CATEGORIA_CORES = {
  'Tour': '#e46c32',
  'Streaming': '#7b8aff',
  'Premiação': '#c9a227',
  'Estilo': '#ff9ec4',
  'Lançamento': '#a855f7',
};

// ==========================================
// FUNÇÕES HELPER para localStorage (likes e salvos continuam locais)
// ==========================================

// Pega os IDs dos posts curtidos do localStorage
const getLikes = () => {
  try {
    return JSON.parse(localStorage.getItem('noticias_likes') || '[]');
  } catch { return []; }
};

// Salva os IDs dos posts curtidos no localStorage
const setLikes = (likes) => {
  localStorage.setItem('noticias_likes', JSON.stringify(likes));
};

// Pega os IDs dos posts salvos do localStorage
const getSalvos = () => {
  try {
    return JSON.parse(localStorage.getItem('noticias_salvos') || '[]');
  } catch { return []; }
};

// Salva os IDs dos posts salvos no localStorage
const setSalvos = (salvos) => {
  localStorage.setItem('noticias_salvos', JSON.stringify(salvos));
};

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
const NoticiasSection = () => {
  // Estado pra guardar as notícias que vieram da API PHP
  const [noticias, setNoticias] = useState([]);
  // Estado de carregamento pra mostrar o spinner enquanto busca
  const [loading, setLoading] = useState(true);
  // Estado pra guardar mensagens de erro caso o PHP não esteja rodando
  const [erro, setErro] = useState('');
  // Estado pra filtrar as notícias por categoria
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todas');
  // Referência pra seção — uso pro IntersectionObserver
  const sectionRef = useRef(null);
  // Estado que controla se a seção já ficou visível na tela (pra animação de entrada)
  const [isVisible, setIsVisible] = useState(false);

  // ===== ESTADOS DAS INTERAÇÕES =====
  // Likes: array de IDs de posts curtidos pelo usuário
  const [curtidos, setCurtidos] = useState(getLikes);
  // Salvos: array de IDs de posts salvos/favoritados pelo usuário
  const [salvos, setSalvosState] = useState(getSalvos);
  // Comentários: objeto { postId: [array de comentários do backend] }
  const [comentarios, setComentarios] = useState({});
  // Controla qual card está com a seção de comentários aberta
  const [comentarioAberto, setComentarioAberto] = useState(null);
  // Texto que o usuário está digitando no campo de comentário
  const [textoComentario, setTextoComentario] = useState('');

  // Pego o estado de autenticação — preciso saber se tá logado pra permitir interações
  const { isLoggedIn, username, token } = useAuth();

  // Efeito que busca as notícias da API PHP assim que o componente monta
  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        // Faço a requisição pro servidor PHP na porta 3002
        const res = await fetch('http://localhost:3002/noticias.php');
        // Se a resposta não foi ok, lanço um erro
        if (!res.ok) throw new Error('Erro ao buscar notícias');
        // Converto a resposta pra JSON e salvo as notícias no estado
        const data = await res.json();
        setNoticias(data.noticias || []);
      } catch (err) {
        // Se deu erro (provavelmente o PHP não tá rodando), mostro a mensagem
        setErro('Não foi possível carregar as notícias. Verifique se o servidor PHP está rodando na porta 3002.');
        console.error('Erro ao buscar notícias do PHP:', err);
      } finally {
        // Paro o carregamento independente do resultado
        setLoading(false);
      }
    };
    fetchNoticias();
  }, []);

  // Efeito que observa quando a seção entra na tela pra ativar a animação de entrada
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    // Crio o observer com um threshold baixo (5%) pra ativar logo
    const obs = new IntersectionObserver(
      ([entry]) => {
        // Quando a seção fica visível, marco como visível e desconecto o observer
        if (entry.isIntersecting) { setIsVisible(true); obs.disconnect(); }
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    // Limpo o observer quando o componente desmonta
    return () => obs.disconnect();
  }, []);

  // Função pra formatar a data no padrão brasileiro (ex: 15 mai. 2026)
  const formatarData = (dataStr) => {
    const data = new Date(dataStr + 'T00:00:00');
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // ==========================================
  // FUNÇÕES DE COMENTÁRIOS (agora via backend)
  // ==========================================

  // Busca comentários de uma notícia PHP do backend (tabela unificada)
  const fetchComentarios = async (noticiaId) => {
    try {
      const res = await fetch(`http://localhost:3001/comentarios/${noticiaId}?tipo=php`);
      const data = await res.json();
      setComentarios(prev => ({ ...prev, [noticiaId]: data }));
    } catch (err) {
      console.error('Erro ao buscar comentários:', err);
    }
  };

  // ==========================================
  // HANDLERS DE INTERAÇÃO
  // ==========================================

  // CURTIR / DESCURTIR — toggle: se já curtiu, descurte. Se não, curte.
  // Só permite 1 curtida por post. Pode descurtir e curtir de novo.
  const handleCurtir = (postId) => {
    if (!isLoggedIn) return; // Precisa estar logado
    setCurtidos(prev => {
      let novosCurtidos;
      if (prev.includes(postId)) {
        // Já curtiu → remove da lista (descurtir)
        novosCurtidos = prev.filter(id => id !== postId);
      } else {
        // Não curtiu → adiciona na lista (curtir)
        novosCurtidos = [...prev, postId];
      }
      // Salva no localStorage pra persistir
      setLikes(novosCurtidos);
      return novosCurtidos;
    });
  };

  // SALVAR / REMOVER DOS SALVOS — toggle similar ao curtir
  const handleSalvar = (postId) => {
    if (!isLoggedIn) return;
    setSalvosState(prev => {
      let novosSalvos;
      if (prev.includes(postId)) {
        novosSalvos = prev.filter(id => id !== postId);
      } else {
        novosSalvos = [...prev, postId];
      }
      setSalvos(novosSalvos);
      return novosSalvos;
    });
  };

  // ENVIAR COMENTÁRIO — salva no backend via API (tabela unificada com tipo=php)
  const handleComentar = async (postId, postTitulo) => {
    if (!isLoggedIn || !textoComentario.trim()) return;
    try {
      const res = await fetch('http://localhost:3001/comentarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ noticia_id: postId, noticia_titulo: postTitulo, texto: textoComentario.trim(), tipo: 'php' })
      });
      if (res.ok) {
        setTextoComentario('');
        fetchComentarios(postId);
      }
    } catch (err) {
      console.error('Erro ao comentar:', err);
    }
  };

  // ABRIR/FECHAR seção de comentários de um post
  const toggleComentarios = (postId) => {
    if (comentarioAberto === postId) {
      setComentarioAberto(null);
    } else {
      setComentarioAberto(postId);
      fetchComentarios(postId);
    }
    setTextoComentario('');
  };

  // EXCLUIR COMENTÁRIO — deleta pelo ID via backend (rota unificada)
  const handleDeletarComentario = async (comentarioId, postId) => {
    if (!isLoggedIn) return;
    try {
      const res = await fetch(`http://localhost:3001/comentarios/${comentarioId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchComentarios(postId);
    } catch (err) {
      console.error('Erro ao deletar comentário:', err);
    }
  };

  // Crio a lista de categorias únicas a partir das notícias, com "Todas" no início
  const categorias = ['Todas', ...new Set(noticias.map(n => n.categoria))];

  // Filtro as notícias pela categoria selecionada
  const noticiasFiltradas = categoriaAtiva === 'Todas'
    ? noticias
    : noticias.filter(n => n.categoria === categoriaAtiva);

  // Conta quantos likes um post tem (simulação — em produção viria do backend)
  const contarLikes = (postId) => {
    return curtidos.includes(postId) ? 1 : 0;
  };

  return (
    <section
      ref={sectionRef}
      // Adiciono a classe de visibilidade pra animar a entrada
      className={`noticias-section ${isVisible ? 'noticias-visible' : ''}`}
    >
      <div className="noticias-inner">
        {/* Cabeçalho da seção */}
        <div className="noticias-header">
          <h2 className="noticias-title">Últimas Notícias</h2>
          <p className="noticias-subtitle">Fique por dentro de tudo que acontece no universo Swiftie</p>
        </div>

        {/* Botões de filtro por categoria */}
        <div className="noticias-filtros">
          {categorias.map(cat => (
            <button
              key={cat}
              // Adiciono a classe 'ativo' se essa é a categoria selecionada
              className={`noticias-filtro-btn ${categoriaAtiva === cat ? 'ativo' : ''}`}
              onClick={() => setCategoriaAtiva(cat)}
              // Passo a cor da categoria como variável CSS
              style={{
                '--filtro-cor': CATEGORIA_CORES[cat] || '#7b8aff',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Estados condicionais: carregando, erro ou exibindo as notícias */}
        {loading ? (
          // Enquanto carrega, mostro o spinner
          <div className="noticias-loading">
            <div className="noticias-spinner" />
            <span>Buscando notícias do servidor PHP...</span>
          </div>
        ) : erro ? (
          // Se deu erro, mostro a mensagem e o comando pra rodar o PHP
          <div className="noticias-erro">
            <span className="noticias-erro-icon">⚠️</span>
            <p>{erro}</p>
            <code>cd php && php -S localhost:3002</code>
          </div>
        ) : (
          // Se tudo ok, renderizo o grid de cards de notícias
          <div className="noticias-grid">
            {noticiasFiltradas.map((noticia, index) => (
              <article
                key={noticia.id}
                className="noticia-card"
                // Passo variáveis CSS pra delay de animação e cor da categoria
                style={{ '--card-delay': `${index * 0.1}s`, '--cat-cor': CATEGORIA_CORES[noticia.categoria] || '#7b8aff' }}
              >
                {/* Imagem da notícia com a tag de categoria */}
                <div className="noticia-img-wrap">
                  <img src={noticia.imagem} alt={noticia.titulo} className="noticia-img" loading="lazy" />
                  <span className="noticia-categoria">{noticia.categoria}</span>
                </div>
                {/* Corpo do card: data, fonte, título e resumo */}
                <div className="noticia-body">
                  <div className="noticia-meta">
                    <span className="noticia-data">{formatarData(noticia.data)}</span>
                    <span className="noticia-fonte">{noticia.fonte}</span>
                  </div>
                  <h3 className="noticia-titulo">{noticia.titulo}</h3>
                  <p className="noticia-resumo">{noticia.resumo}</p>

                  {/* ===== BARRA DE INTERAÇÕES: Curtir, Comentar, Salvar ===== */}
                  <div className="noticia-acoes">
                    {/* Botão CURTIR — muda de ícone e cor quando curtido */}
                    <button
                      className={`noticia-acao-btn ${curtidos.includes(noticia.id) ? 'curtido' : ''}`}
                      onClick={() => handleCurtir(noticia.id)}
                      title={isLoggedIn ? (curtidos.includes(noticia.id) ? 'Descurtir' : 'Curtir') : 'Faça login para curtir'}
                      disabled={!isLoggedIn}
                    >
                      <span className="acao-icon">{curtidos.includes(noticia.id) ? '❤️' : '🤍'}</span>
                      <span className="acao-count">{contarLikes(noticia.id)}</span>
                    </button>

                    {/* Botão COMENTAR — abre/fecha a seção de comentários */}
                    <button
                      className={`noticia-acao-btn ${comentarioAberto === noticia.id ? 'ativo' : ''}`}
                      onClick={() => toggleComentarios(noticia.id)}
                      title="Comentários"
                    >
                      <span className="acao-icon">💬</span>
                      <span className="acao-count">{(comentarios[noticia.id] || []).length}</span>
                    </button>

                    {/* Botão SALVAR — bookmark toggle */}
                    <button
                      className={`noticia-acao-btn ${salvos.includes(noticia.id) ? 'salvo' : ''}`}
                      onClick={() => handleSalvar(noticia.id)}
                      title={isLoggedIn ? (salvos.includes(noticia.id) ? 'Remover dos salvos' : 'Salvar') : 'Faça login para salvar'}
                      disabled={!isLoggedIn}
                    >
                      <span className="acao-icon">{salvos.includes(noticia.id) ? '🔖' : '📑'}</span>
                    </button>
                  </div>

                  {/* ===== SEÇÃO DE COMENTÁRIOS (expandível) ===== */}
                  {comentarioAberto === noticia.id && (
                    <div className="noticia-comentarios">
                      {/* Lista de comentários existentes */}
                      {(comentarios[noticia.id] || []).length > 0 ? (
                        <div className="comentarios-lista">
                          {(comentarios[noticia.id] || []).map((c) => (
                            <div key={c.id} className="comentario-item">
                              <div className="comentario-header">
                                <span className="comentario-autor">@{c.autor}</span>
                                <div className="comentario-header-right">
                                  <span className="comentario-data">{c.data_comentario ? new Date(c.data_comentario).toLocaleDateString('pt-BR') : ''}</span>
                                  {/* Botão de excluir — só aparece se o comentário é do usuário logado ou admin */}
                                  {isLoggedIn && (c.autor === username || username === 'admin') && (
                                    <button
                                      className="comentario-delete-btn"
                                      onClick={() => handleDeletarComentario(c.id, noticia.id)}
                                      title={username === 'admin' && c.autor !== username ? "Excluir comentário (Admin)" : "Excluir comentário"}
                                    >
                                      ✕
                                    </button>
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

                      {/* Campo de novo comentário — só aparece se logado */}
                      {isLoggedIn ? (
                        <div className="comentario-form">
                          <input
                            type="text"
                            className="comentario-input"
                            placeholder="Escreva um comentário..."
                            value={textoComentario}
                            onChange={(e) => setTextoComentario(e.target.value)}
                            onKeyDown={(e) => {
                              // Enter envia o comentário (sem precisar clicar no botão)
                              if (e.key === 'Enter') handleComentar(noticia.id, noticia.titulo);
                            }}
                            maxLength={200}
                          />
                          <button
                            className="comentario-enviar"
                            onClick={() => handleComentar(noticia.id, noticia.titulo)}
                            disabled={!textoComentario.trim()}
                          >
                            Enviar
                          </button>
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
  );
};

// Exporto o componente NoticiasSection
export default NoticiasSection;
