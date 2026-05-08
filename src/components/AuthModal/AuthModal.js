import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './AuthModal.css';

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, login } = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLoginMode ? '/login' : '/register';
    
    try {
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro de autenticação');
      }

      if (isLoginMode) {
        // Loga o usuário usando a função do contexto
        login(data.token, data.username);
        // Limpa os campos
        setUsername('');
        setPassword('');
      } else {
        // Se registrou, troca para a aba de login com mensagem de sucesso
        setIsLoginMode(true);
        setError('Conta criada com sucesso! Faça o login.');
        setPassword(''); // Força digitar a senha de novo por segurança
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={closeAuthModal}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={closeAuthModal}>×</button>
        
        <div className="auth-modal-header">
          <button 
            className={`auth-tab ${isLoginMode ? 'active' : ''}`}
            onClick={() => { setIsLoginMode(true); setError(''); }}
          >
            Entrar
          </button>
          <button 
            className={`auth-tab ${!isLoginMode ? 'active' : ''}`}
            onClick={() => { setIsLoginMode(false); setError(''); }}
          >
            Criar Conta
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className={`auth-error ${error.includes('sucesso') ? 'success' : ''}`}>
              {error}
            </div>
          )}
          
          <div className="auth-input-group">
            <label>Usuário</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu nome de usuário"
              autoComplete="off"
              required
            />
          </div>

          <div className="auth-input-group">
            <label>Senha</label>
            <input 
              type="text" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              autoComplete="new-password"
              style={{ WebkitTextSecurity: 'disc' }}
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Carregando...' : (isLoginMode ? 'Entrar' : 'Registrar')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
