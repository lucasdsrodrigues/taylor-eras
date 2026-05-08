import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { eraThemes } from '../../utils/eraThemes';
import '../PainelAvaliacoes/PainelAvaliacoes.css'; // Reutilizando os mesmos estilos do Admin

const PainelUsuario = () => {
  const { user, token } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editNota, setEditNota] = useState(0);
  
  const [activeTab, setActiveTab] = useState('avaliacoes');
  const [novaSenha, setNovaSenha] = useState('');
  const [configMsg, setConfigMsg] = useState({ text: '', type: '' });
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    if (isOpen && token) {
      fetchAvaliacoes();
    }
  }, [isOpen, token]);

  const fetchAvaliacoes = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/minhas-avaliacoes', {
        headers: {
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
        logout();
      } else {
        const data = await res.json();
        alert(data.error || "Erro ao deletar conta.");
      }
    } catch (error) {
      alert("Erro de conexão.");
    }
  };

  if (!user) return null; // Só renderiza se o usuário estiver logado

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

  const renderStars = (count) => {
    return '★'.repeat(count) + '☆'.repeat(5 - count);
  };

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
              {activeTab === 'configuracoes' ? (
                <div style={{ padding: '20px', color: '#fff' }}>
                  <h3 style={{ marginBottom: '20px' }}>Mudar Senha</h3>
                  <form onSubmit={handleMudarSenha} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', marginBottom: '40px' }}>
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
                    {configMsg.text && (
                      <span style={{ color: configMsg.type === 'success' ? '#4CAF50' : '#f44336', fontSize: '14px' }}>
                        {configMsg.text}
                      </span>
                    )}
                  </form>

                  <hr style={{ borderColor: '#333', marginBottom: '30px' }} />

                  <h3 style={{ color: '#f44336', marginBottom: '10px' }}>Zona de Perigo</h3>
                  <p style={{ fontSize: '14px', color: '#ccc', marginBottom: '15px' }}>
                    Ao excluir sua conta, todas as suas avaliações serão apagadas permanentemente do sistema. Essa ação não pode ser desfeita.
                  </p>
                  <button onClick={handleDeletarConta} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #f44336', color: '#f44336', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Excluir Minha Conta
                  </button>
                </div>
              ) : (
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
                                {item.musica || 'Álbum'}
                              </span>
                              <span className="rating-type">
                                {item.musica ? 'Música' : 'Álbum'}
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
