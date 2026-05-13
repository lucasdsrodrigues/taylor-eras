import React, { useState, useEffect, useContext } from 'react';
// Pego o contexto de autenticação pra acessar o token JWT e as funções de logout
import { AuthContext } from '../../context/AuthContext';
import { eraThemes } from '../../utils/eraThemes';
// Reutilizo o CSS do PainelAvaliacoes porque a estrutura visual é idêntica
// Decisão: evitar duplicar 200+ linhas de CSS — a única diferença é que esse painel
// mostra só as avaliações do usuário logado, não todas
import '../PainelAvaliacoes/PainelAvaliacoes.css';

/**
 * PainelUsuario — Painel pessoal do usuário logado
 * Diferente do PainelAvaliacoes (admin), este mostra APENAS as avaliações do próprio usuário
 * e permite alterar senha ou deletar a conta
 * 
 * AVISO: todas as requisições aqui enviam o token JWT no header Authorization
 * Se o token expirar (24h), o backend retorna 403 e o usuário precisa fazer login de novo
 */
const PainelUsuario = () => {
  // username contém o nome do usuário logado, token é o JWT pra autenticar requisições
  const { username, token } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editNota, setEditNota] = useState(0);

  // Estados de edição de sugestão
  const [editSugestaoId, setEditSugestaoId] = useState(null);
  const [editSugestaoTitulo, setEditSugestaoTitulo] = useState('');
  const [editSugestaoConteudo, setEditSugestaoConteudo] = useState('');
  const [editSugestaoCategoria, setEditSugestaoCategoria] = useState('');

  
  // activeTab controla qual aba tá visível: 'avaliacoes', 'sugestoes', 'comentarios' ou 'configuracoes'
  const [activeTab, setActiveTab] = useState('avaliacoes');
  const [novaSenha, setNovaSenha] = useState('');
  // configMsg mostra feedback de sucesso/erro nas ações de configuração
  const [configMsg, setConfigMsg] = useState({ text: '', type: '' });
  const { logout } = useContext(AuthContext);

  // Estados para sugestões e comentários do usuário
  const [sugestoes, setSugestoes] = useState([]);
  const [comentarios, setComentarios] = useState([]);

  // Busco os dados sempre que o painel abre E tem token válido
  useEffect(() => {
    if (isOpen && token) {
      fetchAvaliacoes();
      fetchSugestoes();
      fetchComentarios();
    }
  }, [isOpen, token]);

  /**
   * Busca APENAS as avaliações do usuário logado
   * Usa a rota /minhas-avaliacoes que filtra pelo usuario_id do token
   * 
   * O header 'Authorization: Bearer TOKEN' é obrigatório aqui —
   * sem ele o backend retorna 401 (acesso negado)
   */
  const fetchAvaliacoes = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/minhas-avaliacoes', {
        headers: {
          // O formato 'Bearer TOKEN' é um padrão de autenticação JWT
          // O backend extrai o token após o espaço e valida
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setAvaliacoes(data);
    } catch (error) {
      console.error('Erro ao buscar suas avaliações:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSugestoes = async () => {
    try {
      const res = await fetch('http://localhost:3001/minhas-sugestoes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setSugestoes(data);
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
    }
  };

  const fetchComentarios = async () => {
    try {
      const res = await fetch('http://localhost:3001/meus-comentarios', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setComentarios(data);
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
    }
  };

  // Deleta uma avaliação — o backend verifica se o usuario_id bate com o do token
  // Isso impede que um usuário delete avaliações de outro
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir sua avaliação?")) return;
    try {
      const res = await fetch(`http://localhost:3001/avaliacoes/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        fetchAvaliacoes();
      }
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditNota(item.nota);
  };

  // Salva a edição da nota — mesma lógica de segurança: backend confere o dono
  const handleSaveEdit = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/avaliacoes/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
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

  // ===== AÇÕES PARA SUGESTÕES =====
  const handleSolicitarExclusao = async (id) => {
    if (!window.confirm("Solicitar à moderação a exclusão desta sugestão?")) return;
    try {
      const res = await fetch(`http://localhost:3001/sugestoes/${id}/solicitar-exclusao`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchSugestoes();
      else {
        const data = await res.json();
        alert(data.error || 'Erro ao solicitar exclusão.');
      }
    } catch (error) { console.error('Erro:', error); }
  };

  const handleEditSugestaoClick = (sugestao) => {
    setEditSugestaoId(sugestao.id);
    setEditSugestaoTitulo(sugestao.titulo);
    setEditSugestaoConteudo(sugestao.conteudo);
    setEditSugestaoCategoria(sugestao.categoria || 'Outro');
  };

  const handleCancelEditSugestao = () => {
    setEditSugestaoId(null);
    setEditSugestaoTitulo('');
    setEditSugestaoConteudo('');
    setEditSugestaoCategoria('');
  };

  const handleSaveEditSugestao = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/sugestoes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          titulo: editSugestaoTitulo,
          conteudo: editSugestaoConteudo,
          categoria: editSugestaoCategoria
        })
      });
      if (res.ok) {
        setEditSugestaoId(null);
        fetchSugestoes();
        alert('Sugestão editada e reenviada para moderação.');
      } else {
        const data = await res.json();
        alert(data.error || 'Erro ao editar sugestão.');
      }
    } catch (error) { console.error('Erro:', error); }
  };


  /**
   * Altera a senha do usuário logado
   * 
   * e.preventDefault() impede o comportamento padrão do formulário (recarregar a página)
   * Sem isso, ao clicar "Atualizar Senha" a página recarregaria e perderia o estado
   */
  const handleMudarSenha = async (e) => {
    e.preventDefault();
    setConfigMsg({ text: 'Atualizando...', type: 'info' });
    try {
      const res = await fetch('http://localhost:3001/usuarios/senha', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ novaSenha })
      });
      const data = await res.json();
      if (res.ok) {
        setConfigMsg({ text: 'Senha atualizada com sucesso!', type: 'success' });
        setNovaSenha('');
      } else {
        setConfigMsg({ text: data.error || 'Erro ao atualizar', type: 'error' });
      }
    } catch (error) {
      setConfigMsg({ text: 'Erro de conexão.', type: 'error' });
    }
  };

  /**
   * Deleta a conta do usuário permanentemente
   * 
   * AVISO: essa ação não pode ser desfeita!
   * O backend primeiro deleta todas as avaliações (por causa da Foreign Key)
   * e depois deleta o usuário. Após isso, chamo logout() pra limpar o token
   */
  const handleDeletarConta = async () => {
    if (!window.confirm("ATENÇÃO: Você tem certeza que deseja excluir sua conta e TODAS as suas avaliações para sempre?")) return;
    try {
      const res = await fetch('http://localhost:3001/usuarios', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Sua conta foi excluída permanentemente.");
        setIsOpen(false);
        // logout() limpa o token do localStorage e do contexto
        logout();
      } else {
        const data = await res.json();
        alert(data.error || "Erro ao deletar conta.");
      }
    } catch (error) {
      alert("Erro de conexão.");
    }
  };

  // Se não tem usuário logado (sem token), não renderizo nada — o botão nem aparece
  if (!token) return null;
  
  // Se for administrador, não exibe o botão do usuário comum
  if (username === 'admin') return null;

  // Agrupo as avaliações por era usando reduce()
  // reduce() itera o array e acumula num objeto onde cada chave é uma era
  const erasAgrupadas = avaliacoes.reduce((acc, current) => {
    const era = current.era;
    if (!acc[era]) {
      acc[era] = {
        items: [],
        soma: 0,
        total: 0
      };
    }
    acc[era].items.push(current);
    acc[era].soma += current.nota;
    acc[era].total += 1;
    return acc;
  }, {});

  // Gera uma string de estrelas preenchidas + vazias (ex: "★★★☆☆")
  // repeat(n) repete a string n vezes
  const renderStars = (count) => {
    return '★'.repeat(count) + '☆'.repeat(5 - count);
  };

  // Estrelas clicáveis pra edição — cada estrela é um span que muda a nota ao clicar
  const renderEditableStars = () => {
    return (
      <div className="editable-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star} 
            className={`edit-star ${star <= editNota ? 'active' : ''}`}
            onClick={() => setEditNota(star)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Botão flutuante pra abrir o painel do usuário */}
      <button 
        className="floating-panel-btn user-btn" 
        onClick={() => setIsOpen(true)}
      >
        👤 Meu Painel
      </button>

      {isOpen && (
        <div className="admin-panel-overlay">
          <div className="admin-panel-modal">
            <header className="admin-header">
              <h2>Painel do Usuário</h2>
              <button className="close-panel-btn" onClick={() => setIsOpen(false)}>×</button>
            </header>

            {/* Abas do painel do usuário */}
            <div style={{ display: 'flex', gap: '10px', padding: '0 20px', marginBottom: '10px', flexWrap: 'wrap' }}>
              {['avaliacoes', 'sugestoes', 'comentarios', 'configuracoes'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{ background: activeTab === tab ? '#fff' : 'transparent', color: activeTab === tab ? '#000' : '#fff', border: '1px solid #fff', padding: '5px 15px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  {tab === 'avaliacoes' ? 'Minhas Avaliações' : tab === 'sugestoes' ? 'Minhas Sugestões' : tab === 'comentarios' ? 'Meus Comentários' : 'Configurações'}
                </button>
              ))}
            </div>

            <div className="admin-content">
              {/* Aba de configurações: mudar senha e deletar conta */}
              {activeTab === 'configuracoes' ? (
                <div style={{ padding: '20px', color: '#fff' }}>
                  <h3 style={{ marginBottom: '20px' }}>Mudar Senha</h3>
                  <form onSubmit={handleMudarSenha} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', marginBottom: '40px' }}>
                    {/* WebkitTextSecurity: 'disc' mascara o texto como senha */}
                    {/* Uso type="text" + WebkitTextSecurity em vez de type="password" */}
                    {/* pra evitar que o navegador sugira autopreenchimento de senhas */}
                    <input 
                      type="text" 
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      placeholder="Digite a nova senha"
                      style={{ WebkitTextSecurity: 'disc', padding: '10px', borderRadius: '5px', border: '1px solid #555', background: '#222', color: '#fff' }}
                      required
                      minLength={3}
                    />
                    <button type="submit" style={{ padding: '10px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                      Atualizar Senha
                    </button>
                    {/* Mensagem de feedback: verde pra sucesso, vermelho pra erro */}
                    {configMsg.text && (
                      <span style={{ color: configMsg.type === 'success' ? '#4CAF50' : '#f44336', fontSize: '14px' }}>
                        {configMsg.text}
                      </span>
                    )}
                  </form>

                  <hr style={{ borderColor: '#333', marginBottom: '30px' }} />

                  {/* Zona de perigo: exclusão permanente da conta */}
                  <h3 style={{ color: '#f44336', marginBottom: '10px' }}>Zona de Perigo</h3>
                  <p style={{ fontSize: '14px', color: '#ccc', marginBottom: '15px' }}>
                    Ao excluir sua conta, todas as suas avaliações serão apagadas permanentemente do sistema. Essa ação não pode ser desfeita.
                  </p>
                  <button onClick={handleDeletarConta} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #f44336', color: '#f44336', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Excluir Minha Conta
                  </button>
                </div>
              ) : activeTab === 'sugestoes' ? (
                // Aba Minhas Sugestões
                sugestoes.length === 0 ? (
                  <div className="empty-state">Você ainda não enviou nenhuma sugestão de notícia.</div>
                ) : (
                  sugestoes.map(s => (
                    <div key={s.id} className="era-group-card" style={{ '--era-primary': s.status === 'aprovado' ? '#51cf66' : s.status === 'rejeitado' ? '#ff6b6b' : s.status === 'exclusao_pendente' ? '#c0392b' : '#f1c40f' }}>
                      {editSugestaoId === s.id ? (
                        <div className="mod-motivo-form" style={{ padding: '15px' }}>
                          <input 
                            type="text" 
                            value={editSugestaoTitulo} 
                            onChange={(e) => setEditSugestaoTitulo(e.target.value)}
                            placeholder="Título da sugestão"
                            style={{ width: '100%', marginBottom: '10px', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '5px' }}
                          />
                          <select 
                            value={editSugestaoCategoria} 
                            onChange={(e) => setEditSugestaoCategoria(e.target.value)}
                            style={{ width: '100%', marginBottom: '10px', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '5px' }}
                          >
                            <option value="Notícia">Notícia</option>
                            <option value="Teoria">Teoria</option>
                            <option value="Rumor">Rumor</option>
                            <option value="Outro">Outro</option>
                          </select>
                          <textarea 
                            value={editSugestaoConteudo} 
                            onChange={(e) => setEditSugestaoConteudo(e.target.value)}
                            placeholder="Conteúdo..."
                            rows={4}
                            style={{ width: '100%', marginBottom: '10px', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '5px' }}
                          />
                          <div className="mod-motivo-actions">
                            <button className="mod-btn mod-btn-approve" onClick={() => handleSaveEditSugestao(s.id)}>Salvar e Reenviar</button>
                            <button className="mod-btn mod-btn-cancel" onClick={handleCancelEditSugestao}>Cancelar</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="era-group-header">
                            <h3 style={{ fontSize: '1.1rem' }}>{s.titulo}</h3>
                            <div className="era-stats">
                              <span style={{
                                padding: '3px 10px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 600,
                                background: s.status === 'aprovado' ? 'rgba(81,207,102,0.15)' : s.status === 'rejeitado' ? 'rgba(255,107,107,0.15)' : s.status === 'exclusao_pendente' ? 'rgba(192, 57, 43, 0.15)' : 'rgba(241,196,15,0.15)',
                                color: s.status === 'aprovado' ? '#51cf66' : s.status === 'rejeitado' ? '#ff6b6b' : s.status === 'exclusao_pendente' ? '#c0392b' : '#f1c40f',
                                textTransform: 'uppercase', letterSpacing: '1px'
                              }}>{s.status === 'exclusao_pendente' ? 'Excl. Pendente' : s.status}</span>
                              <span style={{ marginLeft: '10px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                                {s.data_envio ? new Date(s.data_envio).toLocaleDateString('pt-BR') : ''}
                              </span>
                            </div>
                          </div>
                          <div style={{ padding: '10px 0', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.categoria}</span>
                          </div>
                          {s.status === 'rejeitado' && s.motivo_rejeicao && (
                            <div style={{ padding: '10px', background: 'rgba(255,107,107,0.08)', borderRadius: '8px', border: '1px solid rgba(255,107,107,0.15)', marginTop: '5px', marginBottom: '10px' }}>
                              <span style={{ fontSize: '0.7rem', color: '#ff6b6b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Motivo da rejeição:</span>
                              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', margin: '6px 0 0' }}>{s.motivo_rejeicao}</p>
                            </div>
                          )}
                          
                          <div className="mod-card-actions" style={{ marginTop: '15px' }}>
                            <button className="mod-btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }} onClick={() => handleEditSugestaoClick(s)}>✎ Editar</button>
                            {s.status === 'aprovado' && (
                              <button className="mod-btn mod-btn-delete" onClick={() => handleSolicitarExclusao(s.id)}>🗑 Solicitar Exclusão</button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )
              ) : activeTab === 'comentarios' ? (
                // Aba Meus Comentários
                comentarios.length === 0 ? (
                  <div className="empty-state">Você ainda não fez nenhum comentário.</div>
                ) : (
                  comentarios.map(c => (
                    <div key={c.id} className="era-group-card" style={{ '--era-primary': c.status === 'ativo' ? '#7b8aff' : '#ff6b6b' }}>
                      <div className="era-group-header">
                        <h3 style={{ fontSize: '1rem' }}>{c.noticia_titulo || 'Notícia removida'}</h3>
                        <div className="era-stats">
                          <span style={{
                            padding: '3px 10px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 600,
                            background: c.status === 'ativo' ? 'rgba(123,138,255,0.15)' : 'rgba(255,107,107,0.15)',
                            color: c.status === 'ativo' ? '#7b8aff' : '#ff6b6b',
                            textTransform: 'uppercase', letterSpacing: '1px'
                          }}>{c.status}</span>
                        </div>
                      </div>
                      <div style={{ padding: '8px 0', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                        {c.texto}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>
                        {c.data_comentario ? new Date(c.data_comentario).toLocaleDateString('pt-BR') : ''}
                      </div>
                      {c.status === 'removido' && c.motivo_remocao && (
                        <div style={{ padding: '10px', background: 'rgba(255,107,107,0.08)', borderRadius: '8px', border: '1px solid rgba(255,107,107,0.15)', marginTop: '8px' }}>
                          <span style={{ fontSize: '0.7rem', color: '#ff6b6b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Motivo da remoção:</span>
                          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', margin: '6px 0 0' }}>{c.motivo_remocao}</p>
                        </div>
                      )}
                    </div>
                  ))
                )
              ) : (
                // Aba de avaliações: igual ao painel admin mas só com as do usuário
                loading ? (
                  <div className="loading-state">Carregando dados...</div>
                ) : Object.keys(erasAgrupadas).length === 0 ? (
                  <div className="empty-state">Você ainda não fez nenhuma avaliação. Vá para uma era e avalie!</div>
                ) : (
                  Object.entries(erasAgrupadas).map(([eraKey, data]) => {
                  const theme = eraThemes[eraKey] || { primary: '#fff', name: eraKey };
                  const media = (data.soma / data.total).toFixed(1);

                  return (
                    <div 
                      key={eraKey} 
                      className="era-group-card"
                      style={{ '--era-primary': theme.primary }}
                    >
                      <div className="era-group-header">
                        <h3>{theme.name}</h3>
                        <div className="era-stats">
                          Sua Média: {media} ★ ({data.total} avaliações)
                        </div>
                      </div>

                      <div className="ratings-list">
                        {data.items.slice().reverse().map((item) => (
                          <div key={item.id} className="rating-item">
                            <div className="rating-info">
                              <span className="rating-track">
                                {item.tipo === 'album' ? `${item.era} (Álbum)` : item.musica}
                              </span>
                              <span className="rating-type">
                                {item.tipo === 'musica' ? 'Música' : 'Álbum'}
                              </span>
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
                                <div className="rating-stars">
                                  {renderStars(item.nota)}
                                </div>
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
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PainelUsuario;
