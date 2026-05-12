// Importo o React e os hooks que preciso pro modal de login/registro
import React, { useContext, useState } from 'react';
// Importo o contexto de autenticação pra acessar o estado de login e as funções
import { AuthContext } from '../../context/AuthContext';
// Importo o CSS específico desse modal
import './AuthModal.css';

// Componente do Modal de Autenticação (login e registro)
const AuthModal = () => {
  // Pego do contexto: se o modal tá aberto, a função de fechar e a função de login
  const { isAuthModalOpen, closeAuthModal, login } = useContext(AuthContext);
  // Estado pra saber se tá no modo "login" ou "criar conta"
  const [isLoginMode, setIsLoginMode] = useState(true);
  // Estados dos campos do formulário
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // Estado pra exibir mensagens de erro ou sucesso
  const [error, setError] = useState('');
  // Estado de carregamento pra desabilitar o botão enquanto processa
  const [loading, setLoading] = useState(false);

  // Se o modal não tá aberto, não renderizo nada
  if (!isAuthModalOpen) return null;

  // Função que lida com o envio do formulário (login ou registro)
  const handleSubmit = async (e) => {
    // Previno o recarregamento da página
    e.preventDefault();
    // Limpo erros anteriores
    setError('');
    // Ativo o estado de carregamento
    setLoading(true);

    // Defino qual endpoint chamar baseado no modo atual
    const endpoint = isLoginMode ? '/login' : '/register';

    try {
      // Faço a requisição POST pro backend na porta 3001
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Mando o nome de usuário e senha como JSON
        body: JSON.stringify({ username, password }),
      });

      // Converto a resposta pra JSON
      const data = await response.json();

      // Se a resposta não foi ok (status 400, 401, etc), lanço um erro
      if (!response.ok) {
        throw new Error(data.error || 'Erro de autenticação');
      }

      if (isLoginMode) {
        // Se tá logando, uso a função login do contexto pra salvar o token e username
        login(data.token, data.username);
        // Limpo os campos do formulário
        setUsername('');
        setPassword('');
      } else {
        // Se registrou com sucesso, troco pra aba de login e mostro mensagem de sucesso
        setIsLoginMode(true);
        setError('Conta criada com sucesso! Faça o login.');
        // Limpo a senha por segurança
        setPassword('');
      }
    } catch (err) {
      // Se deu erro, mostro a mensagem na tela
      setError(err.message);
    } finally {
      // Desativo o carregamento independente do resultado
      setLoading(false);
    }
  };

  return (
    // Overlay escuro que cobre a tela — clicar nele fecha o modal
    <div className="auth-modal-overlay" onClick={closeAuthModal}>
      {/* Conteúdo do modal — stopPropagation impede que clicar aqui feche o modal */}
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Botão de fechar (X) no canto */}
        <button className="auth-modal-close" onClick={closeAuthModal}>×</button>

        {/* Abas pra alternar entre Login e Criar Conta */}
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

        {/* Formulário de login/registro */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Mensagem de erro ou sucesso — se tem "sucesso" no texto, uso a classe verde */}
          {error && (
            <div className={`auth-error ${error.includes('sucesso') ? 'success' : ''}`}>
              {error}
            </div>
          )}

          {/* Campo de nome de usuário */}
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

          {/* Campo de senha — uso WebkitTextSecurity pra mascarar os caracteres */}
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

          {/* Botão de enviar — fica desabilitado enquanto carrega */}
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Carregando...' : (isLoginMode ? 'Entrar' : 'Registrar')}
          </button>
        </form>
      </div>
    </div>
  );
};

// Exporto o componente pra usar em outras partes da aplicação
export default AuthModal;