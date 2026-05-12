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
  // user contém os dados do usuário logado, token é o JWT pra autenticar requisições
  const { user, token } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editNota, setEditNota] = useState(0);
  
  // activeTab controla qual aba tá visível: 'avaliacoes' ou 'configuracoes'
  const [activeTab, setActiveTab] = useState('avaliacoes');
  const [novaSenha, setNovaSenha] = useState('');
  // configMsg mostra feedback de sucesso/erro nas ações de configuração
  const [configMsg, setConfigMsg] = useState({ text: '', type: '' });
  const { logout } = useContext(AuthContext);

  // Busco as avaliações sempre que o painel abre E tem token válido
  useEffect(() => {
    if (isOpen && token) {
      fetchAvaliacoes();
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

  // Se não tem usuário logado, não renderizo nada — o botão nem aparece
  if (!user) return null;

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
      {/* Botão fixo no canto inferior esquerdo pra abrir o painel do usuário */}
      {/* Uso style inline aqui porque preciso posicionar diferente do botão admin */}
      <button 
        className="admin-trigger-btn" 
        style={{ left: '20px', bottom: '20px', backgroundColor: '#333', zIndex: 9998 }}
        onClick={() => setIsOpen(true)}
      >
        Minhas Avaliações
      </button>

      {isOpen && (
        <div className="admin-panel-overlay">
          <div className="admin-panel-modal">
            <header className="admin-header">
              <h2>Painel do Usuário</h2>
              <button className="close-panel-btn" onClick={() => setIsOpen(false)}>×</button>
            </header>

            {/* Abas: Minhas Avaliações e Configurações da Conta */}
            <div style={{ display: 'flex', gap: '10px', padding: '0 20px', marginBottom: '10px' }}>
              <button 
                onClick={() => setActiveTab('avaliacoes')}
                style={{ background: activeTab === 'avaliacoes' ? '#fff' : 'transparent', color: activeTab === 'avaliacoes' ? '#000' : '#fff', border: '1px solid #fff', padding: '5px 15px', borderRadius: '20px', cursor: 'pointer' }}
              >
                Minhas Avaliações
              </button>
              <button 
                onClick={() => setActiveTab('configuracoes')}
                style={{ background: activeTab === 'configuracoes' ? '#fff' : 'transparent', color: activeTab === 'configuracoes' ? '#000' : '#fff', border: '1px solid #fff', padding: '5px 15px', borderRadius: '20px', cursor: 'pointer' }}
              >
                Configurações da Conta
              </button>
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
              ) : (
                // Aba de avaliações: igual ao painel admin mas só com as do usuário
                loading ? (
                  <div className="loading-state">Carregando dados...</div>
                ) : Object.keys(erasAgrupadas).length === 0 ? (
                  <div className="empty-state">Você ainda não fez nenhuma avaliação. Vá para uma era e avalie!</div>
                ) : (
                  Object.entries(erasAgrupadas).map(([eraKey, data]) => {
                  const theme = eraThemes[eraKey] || { primary: '#fff', name: eraKey };
                  // toFixed(1) formata o número com 1 casa decimal (ex: 4.3)
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
                        {/* slice() cria uma cópia do array pra não mutar o original */}
                        {/* reverse() inverte pra mostrar as mais recentes primeiro */}
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
