import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { eraThemes } from '../../utils/eraThemes';
import './PainelAvaliacoes.css';

const PainelAvaliacoes = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editNota, setEditNota] = useState(0);
  
  // Lê do localStorage se a pessoa é admin (ativado pelo atalho secreto)
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('devAdmin') === 'true');
  const location = useLocation();

  // Permite ainda usar a URL ?admin=true se quiser
  const urlAdmin = new URLSearchParams(location.search).get('admin') === 'true';

  // Atalho secreto do desenvolvedor: Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        const newAdminState = !isAdmin;
        setIsAdmin(newAdminState);
        localStorage.setItem('devAdmin', newAdminState);
        alert(newAdminState ? "Modo Desenvolvedor Ativado! O botão do painel agora ficará visível." : "Modo Desenvolvedor Desativado.");
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdmin]);

  useEffect(() => {
    if (isOpen) {
      fetchAvaliacoes();
    }
  }, [isOpen]);

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

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta avaliação?")) return;
    try {
      const res = await fetch(`http://localhost:3001/avaliacoes/${id}`, { method: 'DELETE' });
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
        headers: { 'Content-Type': 'application/json' },
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

  if (!isAdmin && !urlAdmin) return null;

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
      <button className="admin-trigger-btn" onClick={() => setIsOpen(true)}>
        PAINEL ADMIN
      </button>

      {isOpen && (
        <div className="admin-panel-overlay">
          <div className="admin-panel-modal">
            <header className="admin-header">
              <h2>avaliações eras</h2>
              <button className="close-panel-btn" onClick={() => setIsOpen(false)}>×</button>
            </header>

            <div className="admin-content">
              {loading ? (
                <div className="loading-state">Carregando dados...</div>
              ) : Object.keys(erasAgrupadas).length === 0 ? (
                <div className="empty-state">Nenhuma avaliação encontrada.</div>
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
                          Média: {media} ★ ({data.total} avaliações)
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
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PainelAvaliacoes;
