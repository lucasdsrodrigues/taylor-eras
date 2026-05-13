// Importo o React pra usar JSX
import React from "react";
// Importo o sistema de rotas do React Router pra navegar entre as páginas sem recarregar
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Importo o Provider de autenticação que criei — ele envolve tudo pra compartilhar o estado de login
import { AuthProvider } from "./context/AuthContext";
// Componente que rola a página pro topo ao trocar de rota
import ScrollToTop from "./components/ScrollToTop";

// Importo todas as páginas de cada era da Taylor Swift
import Home from "./pages/Home";
import Debut from "./pages/Debut";
import Fearless from "./pages/Fearless";
import SpeakNow from "./pages/SpeakNow";
import Red from "./pages/Red";
import NineteenEightyNine from "./pages/1989";
import Reputation from "./pages/Reputation";
import Lover from "./pages/Lover";
import Folklore from "./pages/Folklore";
import Evermore from "./pages/Evermore";
import Midnights from "./pages/Midnights";
import TTPD from "./pages/TTPD";
import Showgirl from "./pages/Showgirl";

import PainelAvaliacoes from "./components/PainelAvaliacoes/PainelAvaliacoes";
import PainelUsuario from "./components/PainelUsuario/PainelUsuario";

// Componente principal da aplicação — ele organiza todas as rotas e envolve tudo com o AuthProvider
function App() {
  return (
    // O AuthProvider garante que qualquer componente filho pode acessar os dados de login
    <AuthProvider>
      {/* O Router gerencia a navegação entre páginas */}
      <Router>
        {/* Paineis flutuantes globais - visíveis em todas as páginas */}
        <PainelAvaliacoes />
        <PainelUsuario />
        
        {/* ScrollToTop garante que ao trocar de página, o scroll volta pro topo */}
        {/* Também limpa o fundo do body pra evitar o flash vermelho da página Red */}
        <ScrollToTop />
        {/* Aqui defino todas as rotas da aplicação — cada path leva pra uma era diferente */}
        <Routes>
          {/* Página inicial com o carrossel de eras */}
          <Route path="/" element={<Home />} />
          {/* Cada rota abaixo leva pra página individual de cada era */}
          <Route path="/debut" element={<Debut />} />
          <Route path="/fearless" element={<Fearless />} />
          <Route path="/speak-now" element={<SpeakNow />} />
          <Route path="/red" element={<Red />} />
          <Route path="/1989" element={<NineteenEightyNine />} />
          <Route path="/reputation" element={<Reputation />} />
          <Route path="/lover" element={<Lover />} />
          <Route path="/folklore" element={<Folklore />} />
          <Route path="/evermore" element={<Evermore />} />
          <Route path="/midnights" element={<Midnights />} />
          <Route path="/ttpd" element={<TTPD />} />
          <Route path="/showgirl" element={<Showgirl />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Exporto o App pra ser usado no index.js
export default App;