// Importo o React e os hooks que preciso pra criar o contexto de autenticação
import React, { createContext, useContext, useState, useEffect } from 'react';

// Crio o contexto de autenticação — isso permite compartilhar os dados de login entre todos os componentes
// export é necessário porque RatingSection, PainelUsuario e AuthModal importam { AuthContext } diretamente
export const AuthContext = createContext();

// Esse é o Provider que envolve toda a aplicação e fornece os dados de autenticação
export function AuthProvider({ children }) {
  // MUDANÇA: troquei localStorage por sessionStorage
  // localStorage persiste PARA SEMPRE (mesmo fechando o navegador)
  // sessionStorage é apagado quando a aba/navegador é fechado
  // Resultado: ao iniciar o servidor, o usuário SEMPRE começa deslogado
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [username, setUsername] = useState(sessionStorage.getItem('username'));

  // Estado que controla se o modal de login/registro está aberto ou fechado
  // Qualquer componente pode chamar openAuthModal() pra abrir o modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Toda vez que o token ou username mudam, eu salvo ou removo do sessionStorage
  useEffect(() => {
    if (token) {
      // Se tem token, salvo no sessionStorage (vive enquanto a aba estiver aberta)
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('username', username);
    } else {
      // Se não tem token (logout), removo do sessionStorage
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('username');
    }
    // Também limpo qualquer token antigo que ficou no localStorage
    // Isso garante que ao reabrir o navegador, o login antigo não volte
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }, [token, username]);

  // Função de login: salvo o token e o username que vieram do backend
  const login = (newToken, newUsername) => {
    setToken(newToken);
    setUsername(newUsername);
  };

  // Função de logout: limpo tudo (token e username viram null)
  const logout = () => {
    setToken(null);
    setUsername(null);
  };

  // Funções pra controlar o modal de autenticação de qualquer lugar da app
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // Retorno o Provider com todos os valores que quero compartilhar na aplicação:
  // token, username, login, logout, isLoggedIn, e controle do modal
  return (
    <AuthContext.Provider value={{
      token, username, login, logout, isLoggedIn: !!token,
      isAuthModalOpen, openAuthModal, closeAuthModal
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Esse hook customizado facilita usar o contexto de autenticação em qualquer componente
// Em vez de escrever useContext(AuthContext) toda hora, é só chamar useAuth()
export function useAuth() {
  return useContext(AuthContext);
}
