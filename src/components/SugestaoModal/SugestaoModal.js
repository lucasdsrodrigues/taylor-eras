// Modal para envio de sugestões de notícias — segue o padrão visual do AuthModal
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './SugestaoModal.css';

// Categorias reutilizadas do sistema PHP + "Outro"
const CATEGORIAS = ['Tour', 'Streaming', 'Premiação', 'Estilo', 'Lançamento', 'Outro'];

const SugestaoModal = ({ isOpen, onClose, onSuccess }) => {
  const { token } = useAuth();
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('Outro');
  const [conteudo, setConteudo] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ text: '', type: '' });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ text: '', type: '' });
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3001/sugestoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ titulo, conteudo, categoria })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao enviar');

      setFeedback({ text: 'Sugestão enviada! Aguarde a moderação. ✨', type: 'success' });
      setTitulo('');
      setConteudo('');
      setCategoria('Outro');
      // Notifica o componente pai e fecha após 1.5s
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setFeedback({ text: '', type: '' });
        onClose();
      }, 1500);
    } catch (err) {
      setFeedback({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sugestao-modal-overlay" onClick={onClose}>
      <div className="sugestao-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="sugestao-modal-close" onClick={onClose}>×</button>
        <h2 className="sugestao-modal-title">Sugerir Notícia</h2>
        <p className="sugestao-modal-desc">Compartilhe uma notícia com a comunidade Swiftie</p>

        <form className="sugestao-form" onSubmit={handleSubmit}>
          {feedback.text && (
            <div className={`sugestao-feedback ${feedback.type}`}>
              {feedback.text}
            </div>
          )}

          <div className="sugestao-input-group">
            <label>Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título da notícia"
              required
              maxLength={120}
            />
          </div>

          <div className="sugestao-input-group">
            <label>Categoria</label>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              {CATEGORIAS.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="sugestao-input-group">
            <label>Conteúdo</label>
            <textarea
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              placeholder="Escreva o conteúdo da notícia..."
              required
              rows={5}
              maxLength={2000}
            />
          </div>

          <button type="submit" className="sugestao-submit-btn" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Sugestão'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SugestaoModal;
