// Importo o React e os hooks de estado e efeitos
import React, { useState, useEffect } from 'react';
// Importo o useLocation pra poder ler parâmetros da URL (como ?admin=true)
import { useLocation } from 'react-router-dom';
// Importo os temas de cada era pra estilizar os cards
import { eraThemes } from '../../utils/eraThemes';
// Importo o CSS do painel de administração
import './PainelAvaliacoes.css';

// Componente do Painel de Administração — mostra TODAS as avaliações de todos os usuários
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

  // Atalho secreto do desenvolvedor: Ctrl + Shift + A
  // Quando pressionado, ativa ou desativa o modo admin
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        const newAdminState = !isAdmin;
        setIsAdmin(newAdminState);
        // Salvo no localStorage pra persistir entre recarregamentos
        localStorage.setItem('devAdmin', newAdminState);
        alert(newAdminState ? "Modo Desenvolvedor Ativado! O botão do painel agora ficará visível." : "Modo Desenvolvedor Desativado.");
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdmin]);

  // Quando o painel abre, busco as avaliações do backend
  useEffect(() => {
    if (isOpen) {
      fetchAvaliacoes();
    }
  }, [isOpen]);

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

  // Função pra deletar uma avaliação pelo ID (com confirmação)
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta avaliação?")) return;
    try {
      const res = await fetch(`http://localhost:3001/avaliacoes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        // Recarrego a lista após deletar
        fetchAvaliacoes();
      }
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };

  // Função que ativa o modo de edição pra uma avaliação específica
  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditNota(item.nota);
  };

  // Função que salva a edição da nota no backend
  const handleSaveEdit = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/avaliacoes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nota: editNota })
      });
      if (res.ok) {
        // Saio do modo de edição e recarrego a lista
        setEditingId(null);
        fetchAvaliacoes();
      }
    } catch (error) {
      console.error('Erro ao editar:', error);
    }
  };

  // Função pra cancelar a edição
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditNota(0);
  };

  // Se não é admin (nem pelo atalho nem pela URL), não renderizo nada
  if (!isAdmin && !urlAdmin) return null;

  // Agrupo as avaliações por era pra organizar visualmente
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

  // Função que renderiza as estrelas preenchidas e vazias
  const renderStars = (count) => {
    return '★'.repeat(count) + '☆'.repeat(5 - count);
  };

  // Função que renderiza as estrelas clicáveis durante a edição
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
      {/* Botão que abre o painel — só aparece se é admin */}
      <button className="admin-trigger-btn" onClick={() => setIsOpen(true)}>
        PAINEL ADMIN
      </button>

      {/* Modal do painel que sobrepõe a página */}
      {isOpen && (
        <div className="admin-panel-overlay">
          <div className="admin-panel-modal">
            {/* Header do painel com título e botão de fechar */}
            <header className="admin-header">
              <h2>avaliações eras</h2>
              <button className="close-panel-btn" onClick={() => setIsOpen(false)}>×</button>
            </header>

            <div className="admin-content">
              {/* Estados: carregando, vazio ou exibindo as avaliações agrupadas por era */}
              {loading ? (
                <div className="loading-state">Carregando dados...</div>
              ) : Object.keys(erasAgrupadas).length === 0 ? (
                <div className="empty-state">Nenhuma avaliação encontrada.</div>
              ) : (
                // Renderizo cada grupo de era
                Object.entries(erasAgrupadas).map(([eraKey, data]) => {
                  // Pego o tema da era pra cor e nome
                  const theme = eraThemes[eraKey] || { primary: '#fff', name: eraKey };
                  // Calculo a média das notas dessa era
                  const media = (data.soma / data.total).toFixed(1);

                  return (
                    <div 
                      key={eraKey} 
                      className="era-group-card"
                      style={{ '--era-primary': theme.primary }}
                    >
                      {/* Header do grupo com nome da era e média */}
                      <div className="era-group-header">
                        <h3>{theme.name}</h3>
                        <div className="era-stats">
                          Média: {media} ★ ({data.total} avaliações)
                        </div>
                      </div>

                      {/* Lista de avaliações dessa era (mais recentes primeiro) */}
                      <div className="ratings-list">
                        {data.items.slice().reverse().map((item) => (
                          <div key={item.id} className="rating-item">
                            {/* Info da avaliação: nome da música/álbum e tipo */}
                            <div className="rating-info">
                              <span className="rating-track">
                                {item.tipo === 'album' ? `${item.era} (Álbum)` : item.musica}
                              </span>
                              <span className="rating-type">
                                {item.tipo === 'musica' ? 'Música' : 'Álbum'}
                              </span>
                            </div>
                            
                            {/* Se tá editando essa avaliação, mostro estrelas clicáveis */}
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
                                {/* Modo normal: mostro as estrelas fixas e botões de ação */}
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

// Exporto o componente PainelAvaliacoes
export default PainelAvaliacoes;
