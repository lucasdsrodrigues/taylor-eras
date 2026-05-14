// Importo o React e os hooks de estado e efeitos
import React, { useState, useEffect, useContext } from 'react';
// Importo o useLocation pra poder ler parâmetros da URL (como ?admin=true)
import { useLocation } from 'react-router-dom';
// Importo os temas de cada era pra estilizar os cards
import { eraThemes } from '../../utils/eraThemes';
// Importo o contexto de autenticação pra usar o token nas rotas admin
import { AuthContext } from '../../context/AuthContext';
// Importo o CSS do painel de administração
import './PainelAvaliacoes.css';

// Componente do Painel de Administração — mostra TODAS as avaliações de todos os usuários
// Agora também inclui moderação de sugestões e comentários
const PainelAvaliacoes = () => {
  // Estado pra controlar se o painel tá aberto ou fechado
  const [isOpen, setIsOpen] = useState(false);
  // Estado que guarda todas as avaliações vindas do backend
  const [avaliacoes, setAvaliacoes] = useState([]);
  // Estado de carregamento
  const [loading, setLoading] = useState(false);
  // Estado pra saber qual avaliação tá sendo editada (pelo ID)
  const [editingId, setEditingId] = useState(null);
  // Estado pra guardar a nota durante a edição
  const [editNota, setEditNota] = useState(0);
  
  // Verifico se a pessoa é admin (ativado pelo atalho secreto Ctrl+Shift+A)
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('devAdmin') === 'true');
  // Pego a localização atual da URL
  const location = useLocation();

  // Também permito ativar o admin pela URL com ?admin=true
  const urlAdmin = new URLSearchParams(location.search).get('admin') === 'true';

  // Aba ativa do painel admin: 'avaliacoes', 'sugestoes' ou 'comentarios'
  const [activeTab, setActiveTab] = useState('avaliacoes');

  // Estados de moderação de sugestões
  const [sugestoes, setSugestoes] = useState([]);
  const [filtroSugestao, setFiltroSugestao] = useState('pendente');
  const [motivoRejeicao, setMotivoRejeicao] = useState('');
  const [rejeitandoId, setRejeitandoId] = useState(null);

  // Estados de moderação de comentários
  const [comentariosAdmin, setComentariosAdmin] = useState([]);
  const [motivoRemocao, setMotivoRemocao] = useState('');
  const [removendoId, setRemovendoId] = useState(null);

  // Token JWT e username do contexto
  const { token, username } = useContext(AuthContext);

  // Atalho secreto do desenvolvedor: Apenas Ctrl + Shift
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Quando pressionamos Ctrl e Shift juntos, o e.key é "Shift" (se apertar Ctrl primeiro) 
      // ou "Control" (se apertar Shift primeiro). 
      if (e.ctrlKey && e.shiftKey && (e.key === 'Shift' || e.key === 'Control')) {
        if (username !== 'admin') {
          // Usuário comum não recebe nenhum aviso
          return;
        }
        const newAdminState = !isAdmin;
        setIsAdmin(newAdminState);
        localStorage.setItem('devAdmin', newAdminState);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdmin, username]);

  // Quando o painel abre, busco todos os dados
  useEffect(() => {
    if (isOpen) {
      fetchAvaliacoes();
      if (token) {
        fetchSugestoes();
        fetchComentarios();
      }
    }
  }, [isOpen, token]);

  // Função que busca TODAS as avaliações da API
  const fetchAvaliacoes = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/avaliacoes');
      const data = await response.json();
      setAvaliacoes(data);
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSugestoes = async () => {
    try {
      const res = await fetch('http://localhost:3001/admin/sugestoes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSugestoes(data);
      }
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
    }
  };

  const fetchComentarios = async () => {
    try {
      const res = await fetch('http://localhost:3001/admin/comentarios', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setComentariosAdmin(data);
      }
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
    }
  };

  // Função pra deletar uma avaliação pelo ID (com confirmação)
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta avaliação?")) return;
    try {
      const res = await fetch(`http://localhost:3001/avaliacoes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchAvaliacoes();
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditNota(item.nota);
  };

  const handleSaveEdit = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/avaliacoes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ nota: editNota })
      });
      if (res.ok) {
        setEditingId(null);
        fetchAvaliacoes();
      }
    } catch (error) {
      console.error('Erro ao editar:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditNota(0);
  };

  // ===== AÇÕES DE MODERAÇÃO DE SUGESTÕES =====
  const handleAprovar = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/admin/sugestoes/${id}/aprovar`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchSugestoes();
    } catch (error) { console.error(error); }
  };

  const handleRejeitar = async (id) => {
    if (!motivoRejeicao.trim()) return alert('Informe o motivo da rejeição.');
    try {
      const res = await fetch(`http://localhost:3001/admin/sugestoes/${id}/rejeitar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ motivo: motivoRejeicao })
      });
      if (res.ok) { setRejeitandoId(null); setMotivoRejeicao(''); fetchSugestoes(); }
    } catch (error) { console.error(error); }
  };

  const handleRejeitarExclusao = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/admin/sugestoes/${id}/rejeitar-exclusao`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchSugestoes();
    } catch (error) { console.error(error); }
  };

  const handleExcluirSugestao = async (id) => {
    if (!window.confirm('Excluir permanentemente esta sugestão e seus comentários?')) return;
    try {
      const res = await fetch(`http://localhost:3001/admin/sugestoes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchSugestoes();
    } catch (error) { console.error(error); }
  };

  // ===== AÇÕES DE MODERAÇÃO DE COMENTÁRIOS =====
  const handleRemoverComentario = async (id) => {
    if (!motivoRemocao.trim()) return alert('Informe o motivo da remoção.');
    try {
      const res = await fetch(`http://localhost:3001/admin/comentarios/${id}/remover`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ motivo_remocao: motivoRemocao })
      });
      if (res.ok) { setRemovendoId(null); setMotivoRemocao(''); fetchComentarios(); }
    } catch (error) { console.error(error); }
  };

  const handleExcluirComentario = async (id) => {
    if (!window.confirm('Excluir permanentemente este comentário?')) return;
    try {
      const res = await fetch(`http://localhost:3001/admin/comentarios/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchComentarios();
    } catch (error) { console.error(error); }
  };

  // Se não é admin, não renderizo nada
  if (!isAdmin && !urlAdmin) return null;

  // Agrupo as avaliações por era
  const erasAgrupadas = avaliacoes.reduce((acc, current) => {
    const era = current.era;
    if (!acc[era]) { acc[era] = { items: [], soma: 0, total: 0 }; }
    acc[era].items.push(current);
    acc[era].soma += current.nota;
    acc[era].total += 1;
    return acc;
  }, {});

  const renderStars = (count) => '★'.repeat(count) + '☆'.repeat(5 - count);

  const renderEditableStars = () => (
    <div className="editable-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`edit-star ${star <= editNota ? 'active' : ''}`} onClick={() => setEditNota(star)}>★</span>
      ))}
    </div>
  );

  // Filtra sugestões pelo status selecionado
  const sugestoesFiltradas = sugestoes.filter(s => s.status === filtroSugestao);

  return (
    <>
      {/* Botão flutuante pra abrir o painel admin (só aparece se o modo dev estiver ativo e a conta for admin) */}
      {(isAdmin || urlAdmin) && username === 'admin' && (
        <button className="floating-panel-btn admin-btn" onClick={() => setIsOpen(true)}>
          ⚙️ Admin
        </button>
      )} 
      {isOpen && (
        <div className="admin-panel-overlay">
          <div className="admin-panel-modal">
            <header className="admin-header">
              <h2>Painel Admin</h2>
              <button className="close-panel-btn" onClick={() => setIsOpen(false)}>×</button>
            </header>

            {/* Abas do admin */}
            <div className="admin-tabs">
              {['avaliacoes', 'sugestoes', 'comentarios'].map(tab => (
                <button
                  key={tab}
                  className={`admin-tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'avaliacoes' ? 'Avaliações' : tab === 'sugestoes' ? 'Moderação de Sugestões' : 'Moderação de Comentários'}
                </button>
              ))}
            </div>

            <div className="admin-content">
              {/* ===== ABA AVALIAÇÕES ===== */}
              {activeTab === 'avaliacoes' && (
                loading ? (
                  <div className="loading-state">Carregando dados...</div>
                ) : Object.keys(erasAgrupadas).length === 0 ? (
                  <div className="empty-state">Nenhuma avaliação encontrada.</div>
                ) : (
                  Object.entries(erasAgrupadas).map(([eraKey, data]) => {
                    const theme = eraThemes[eraKey] || { primary: '#fff', name: eraKey };
                    const media = (data.soma / data.total).toFixed(1);
                    return (
                      <div key={eraKey} className="era-group-card" style={{ '--era-primary': theme.primary }}>
                        <div className="era-group-header">
                          <h3>{theme.name}</h3>
                          <div className="era-stats">Média: {media} ★ ({data.total} avaliações)</div>
                        </div>
                        <div className="ratings-list">
                          {data.items.slice().reverse().map((item) => (
                            <div key={item.id} className="rating-item">
                              <div className="rating-info">
                                <span className="rating-track">{item.tipo === 'album' ? `${item.era} (Álbum)` : item.musica}</span>
                                <span className="rating-type">{item.tipo === 'musica' ? 'Música' : 'Álbum'} | por @{item.username || 'anônimo'}</span>
                              </div>
                              {editingId === item.id ? (
                                <div className="rating-edit-mode">
                                  {renderEditableStars()}
                                  <div className="edit-actions">
                                    <button onClick={() => handleSaveEdit(item.id)} className="btn-save">Salvar</button>
                                    <button onClick={handleCancelEdit} className="btn-cancel">Cancelar</button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="rating-stars">{renderStars(item.nota)}</div>
                                  <div className="rating-actions">
                                    <button onClick={() => handleEditClick(item)} className="btn-edit" title="Editar">✎</button>
                                    <button onClick={() => handleDelete(item.id)} className="btn-delete" title="Excluir">🗑</button>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )
              )}

              {/* ===== ABA MODERAÇÃO DE SUGESTÕES ===== */}
              {activeTab === 'sugestoes' && (
                <>
                  {/* Filtros de status */}
                  <div className="mod-status-filters">
                    {['pendente', 'aprovado', 'rejeitado', 'exclusao_pendente'].map(s => (
                      <button
                        key={s}
                        className={`mod-filter-btn ${filtroSugestao === s ? 'active' : ''}`}
                        onClick={() => setFiltroSugestao(s)}
                        style={{ '--filter-color': s === 'pendente' ? '#f1c40f' : s === 'aprovado' ? '#51cf66' : s === 'rejeitado' ? '#ff6b6b' : '#c0392b' }}
                      >
                        {s === 'exclusao_pendente' ? 'Excl. Pendentes' : s.charAt(0).toUpperCase() + s.slice(1) + 's'} ({sugestoes.filter(x => x.status === s).length})
                      </button>
                    ))}
                  </div>

                  {sugestoesFiltradas.length === 0 ? (
                    <div className="empty-state">Nenhuma sugestão {filtroSugestao}.</div>
                  ) : (
                    sugestoesFiltradas.map(s => (
                      <div key={s.id} className="mod-card">
                        <div className="mod-card-header">
                          <h3 className="mod-card-title">{s.titulo}</h3>
                          <span className={`mod-status-badge mod-status-${s.status}`}>{s.status}</span>
                        </div>
                        <div className="mod-card-meta">
                          <span>por @{s.autor || 'anônimo'}</span>
                          <span>{s.categoria}</span>
                          <span>{s.data_envio ? new Date(s.data_envio).toLocaleDateString('pt-BR') : ''}</span>
                        </div>
                        <p className="mod-card-content">{s.conteudo}</p>
                        {s.motivo_rejeicao && (
                          <div className="mod-rejeicao-info">
                            <strong>Motivo da rejeição:</strong> {s.motivo_rejeicao}
                          </div>
                        )}

                        {/* Modal de rejeição inline */}
                        {rejeitandoId === s.id && (
                          <div className="mod-motivo-form">
                            <textarea
                              placeholder="Motivo da rejeição (obrigatório)..."
                              value={motivoRejeicao}
                              onChange={(e) => setMotivoRejeicao(e.target.value)}
                              rows={3}
                            />
                            <div className="mod-motivo-actions">
                              <button className="mod-btn mod-btn-danger" onClick={() => handleRejeitar(s.id)}>Confirmar Rejeição</button>
                              <button className="mod-btn mod-btn-cancel" onClick={() => { setRejeitandoId(null); setMotivoRejeicao(''); }}>Cancelar</button>
                            </div>
                          </div>
                        )}

                        <div className="mod-card-actions">
                          {s.status === 'pendente' && (
                            <>
                              <button className="mod-btn mod-btn-approve" onClick={() => handleAprovar(s.id)}>✓ Aprovar</button>
                              <button className="mod-btn mod-btn-reject" onClick={() => setRejeitandoId(s.id)}>✕ Rejeitar</button>
                            </>
                          )}
                          {s.status === 'exclusao_pendente' && (
                            <>
                              <button className="mod-btn mod-btn-approve" onClick={() => handleRejeitarExclusao(s.id)}>✕ Manter Sugestão (Rejeitar Exclusão)</button>
                              <button className="mod-btn mod-btn-delete" onClick={() => handleExcluirSugestao(s.id)}>🗑 Aprovar Exclusão (Deletar)</button>
                            </>
                          )}
                          {s.status !== 'exclusao_pendente' && (
                            <button className="mod-btn mod-btn-delete" onClick={() => handleExcluirSugestao(s.id)}>🗑 Excluir</button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </>

              )}

              {/* ===== ABA MODERAÇÃO DE COMENTÁRIOS ===== */}
              {activeTab === 'comentarios' && (
                comentariosAdmin.length === 0 ? (
                  <div className="empty-state">Nenhum comentário encontrado.</div>
                ) : (
                  comentariosAdmin.map(c => (
                    <div key={c.id} className="mod-card">
                      <div className="mod-card-header">
                        <h3 className="mod-card-title" style={{ fontSize: '0.95rem' }}>{c.noticia_titulo || 'Notícia removida'}</h3>
                        <span className={`mod-status-badge ${c.status === 'ativo' ? 'mod-status-aprovado' : 'mod-status-rejeitado'}`}>{c.status}</span>
                      </div>
                      <div className="mod-card-meta">
                        <span>por @{c.autor || 'anônimo'}</span>
                        <span>{c.data_comentario ? new Date(c.data_comentario).toLocaleDateString('pt-BR') : ''}</span>
                      </div>
                      <p className="mod-card-content">{c.texto}</p>
                      {c.motivo_remocao && (
                        <div className="mod-rejeicao-info">
                          <strong>Motivo da remoção:</strong> {c.motivo_remocao}
                        </div>
                      )}

                      {/* Modal de remoção inline */}
                      {removendoId === c.id && (
                        <div className="mod-motivo-form">
                          <textarea
                            placeholder="Motivo da remoção (obrigatório)..."
                            value={motivoRemocao}
                            onChange={(e) => setMotivoRemocao(e.target.value)}
                            rows={3}
                          />
                          <div className="mod-motivo-actions">
                            <button className="mod-btn mod-btn-danger" onClick={() => handleRemoverComentario(c.id)}>Confirmar Remoção</button>
                            <button className="mod-btn mod-btn-cancel" onClick={() => { setRemovendoId(null); setMotivoRemocao(''); }}>Cancelar</button>
                          </div>
                        </div>
                      )}

                      <div className="mod-card-actions">
                        {c.status === 'ativo' && (
                          <button className="mod-btn mod-btn-reject" onClick={() => setRemovendoId(c.id)}>Remover</button>
                        )}
                        <button className="mod-btn mod-btn-delete" onClick={() => handleExcluirComentario(c.id)}>🗑 Excluir Permanente</button>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Exporto o componente PainelAvaliacoes
export default PainelAvaliacoes;
