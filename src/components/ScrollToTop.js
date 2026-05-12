// Componente que rola a página pro topo toda vez que a rota muda
// e limpa estilos do body pra evitar "flash" de cor entre páginas
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  // useLocation retorna o objeto da rota atual — toda vez que pathname muda, o efeito roda
  const { pathname } = useLocation();

  useEffect(() => {
    // Rola instantaneamente pro topo (0, 0) ao trocar de página
    window.scrollTo(0, 0);

    // LIMPA estilos globais do body que outras páginas podem ter aplicado
    // A página Red, por exemplo, seta background vermelho direto no body via CSS
    // Se não limpar aqui, o fundo vermelho "vaza" pra outras eras por um frame
    // causando um flash vermelho visível antes do CSS da nova página carregar
    document.body.style.background = '';
    document.body.style.backgroundImage = '';
    document.body.style.backgroundAttachment = '';
    document.body.style.backgroundColor = '';
    document.documentElement.style.background = '';
  }, [pathname]);

  // Esse componente não renderiza nada — só executa o efeito colateral
  return null;
}
