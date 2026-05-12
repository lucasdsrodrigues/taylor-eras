import React, { useEffect, useRef, useCallback } from "react";
// useNavigate é do React Router — uso pra redirecionar o usuário pra outra página sem recarregar o navegador
import { useNavigate } from "react-router-dom";
import './eras.css';

// Importo as capas de cada era como imagens locais pra evitar dependência de URLs externas
import debutImg from '../../imagens/debut.jpg';
import fearlessImg from '../../imagens/fearless.jpg';
import speaknowImg from '../../imagens/speaknow.jpg';
import redImg from '../../imagens/red.jpg';
import _1989Img from '../../imagens/1989.jpg';
import reputationImg from '../../imagens/reputation.jpg';
import loverImg from '../../imagens/lover.jpg';
import folkloreImg from '../../imagens/folklore.jpg';
import evermoreImg from '../../imagens/evermore.jpg';
import midnightsImg from '../../imagens/midnights.jpg';
import ttpdImg from '../../imagens/ttpd.jpg';
import showgirlImg from '../../imagens/showgirl.jpg';

/**
 * ErasCarousel — Carrossel 3D interativo com drag-to-swipe e efeito parallax
 * 
 * @param {number} currentIndex — índice do slide ativo (controlado pelo pai)
 * @param {function} setCurrentIndex — função pra mudar o slide ativo
 * 
 * Decisão de design: o estado do índice vive no componente pai (Home) porque
 * o componente Timeline também precisa sincronizar com o carrossel.
 * Se o estado morasse aqui dentro, a Timeline não teria como saber qual era tá ativa.
 */
export default function ErasCarousel({ currentIndex, setCurrentIndex }) {
  // useRef cria uma referência que persiste entre renderizações sem causar re-render
  // Uso pra acessar diretamente os elementos DOM (o track e o container do carrossel)
  const trackRef = useRef(null);
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  // Guardo o estado do drag num ref em vez de useState porque:
  // 1. Preciso atualizar esses valores em event listeners do window
  // 2. Se usasse useState, cada atualização causaria re-render (= lag no arraste)
  // 3. useRef muda o valor sem re-renderizar, perfeito pra tracking de mouse
  const dragState = useRef({ isDragging: false, startX: 0, delta: 0, didDrag: false });

  // Cada era tem uma cor temática — essa cor pinta o fundo da seção via variável CSS
  const eraColors = [
    '#6aebb4', '#f7c948', '#c77dff', '#e74c3c', '#74b9ff', '#2d3436',
    '#ffb6c1', '#b8cbb8', '#7d8f69', '#1e3799', '#3d3d3d', '#c75b12'
  ];

  // Dados de cada slide — path é a rota que o React Router usa pra navegação
  const slidesData = [
    { title: "Taylor Swift", text: "A mess of a dreamer, with the nerve to adore you", eraClass: "era-debut", img: debutImg, path: "/debut" },
    { title: "Fearless", text: "All the pages are just slipping through my hands", eraClass: "era-fearless", img: fearlessImg, path: "/fearless" },
    { title: "Speak Now", text: "Long live all the magic we made", eraClass: "era-speak-now", img: speaknowImg, path: "/speak-now" },
    { title: "Red", text: "Love is a ruthless game unless you play it good and right", eraClass: "era-red", img: redImg, path: "/red" },
    { title: "1989", text: "The rumors are terrible and cruel", eraClass: "era-1989", img: _1989Img, path: "/1989" },
    { title: "Reputation", text: "Please don't ever become a stranger", eraClass: "era-reputation", img: reputationImg, path: "/reputation" },
    { title: "Lover", text: "You gotta step into the daylight and let it go", eraClass: "era-lover", img: loverImg, path: "/lover" },
    { title: "Folklore", text: "Living for the hope of it all", eraClass: "era-folklore", img: folkloreImg, path: "/folklore" },
    { title: "Evermore", text: "One for the money, two for the show", eraClass: "era-evermore", img: evermoreImg, path: "/evermore" },
    { title: "Midnights", text: "I'll stare directly at the sun, but never in the mirror", eraClass: "era-midnights", img: midnightsImg, path: "/midnights" },
    { title: "The Tortured Poets Department", text: "Please, i've been on my knees, change the prophecy", eraClass: "era-tortured-poets-department", img: ttpdImg, path: "/ttpd" },
    { title: "The Life of a Showgirl", text: "This empire belongs to me", eraClass: "era-the-life-of-a-showgirl", img: showgirlImg, path: "/showgirl" },
  ];

  /**
   * updateCarousel — Centraliza o slide ativo no meio da tela e aplica efeito parallax
   * 
   * COMO FUNCIONA:
   * getBoundingClientRect() retorna a posição e dimensões de um elemento relativo à viewport
   * (retorna {top, left, right, bottom, width, height})
   * Uso pra calcular onde o slide tá na tela e quanto preciso mover o track pra centralizá-lo
   * 
   * AVISO: essa função é chamada no resize também — se remover o listener de resize,
   * o carrossel vai ficar descentralizado quando o usuário redimensionar a janela
   */
  const updateCarousel = () => {
    const carousel = carouselRef.current;
    const track = trackRef.current;
    if (!carousel || !track) return;
    const slides = Array.from(track.children);
    const activeSlide = slides[currentIndex];
    if (!activeSlide) return;

    // getBoundingClientRect() me dá as dimensões reais do elemento na tela
    // Uso isso pra saber a largura do carrossel e calcular o centro
    const carouselRect = carousel.getBoundingClientRect();
    const slideRect = activeSlide.getBoundingClientRect();
    const carouselCenter = carouselRect.width / 2;
    // offsetLeft me dá a posição do slide relativo ao pai (track), não à viewport
    // Junto com a largura, calculo o centro exato do slide
    const slideCenter = activeSlide.offsetLeft + slideRect.width / 2;
    // O offset é quanto preciso deslocar o track pra alinhar o slide no centro
    const offset = slideCenter - carouselCenter;

    // translateX move o track horizontalmente — valor negativo move pra esquerda
    track.style.transform = `translateX(${-offset}px)`;

    // Aplico classes de proximidade pra estilizar os slides vizinhos de forma diferente
    // 'active' = slide central, 'near' = vizinhos imediatos (levemente visíveis), 'far' = distantes (mais borrados)
    slides.forEach((slide, index) => {
      slide.classList.remove("active", "near", "far");
      if (index === currentIndex) slide.classList.add("active");
      else if (Math.abs(index - currentIndex) === 1) slide.classList.add("near");
      else if (Math.abs(index - currentIndex) >= 2) slide.classList.add("far");

      // Efeito parallax: o background se desloca na direção oposta à navegação
      // Isso cria uma sensação de profundidade — slides à esquerda têm background deslocado pra direita e vice-versa
      const distance = index - currentIndex;
      // setProperty define uma variável CSS (--parallax-bg) que o CSS usa no background-position
      slide.style.setProperty('--parallax-bg', `${distance * 30}px`);
      const content = slide.querySelector('.era-content');
      if (content) {
        // O texto se move na direção contrária ao background, reforçando o efeito 3D
        content.style.setProperty('--parallax-text', `${distance * -8}px`);
      }
    });
  };

  /**
   * handleMouseMove — Cria o efeito de inclinação 3D (tilt) quando o mouse passa pelo slide
   * 
   * COMO FUNCIONA:
   * Calculo a posição relativa do mouse dentro do slide (0 a 1)
   * e converto em ângulos de rotação CSS via variáveis --tilt-x e --tilt-y
   * O CSS então aplica transform: rotateX(var(--tilt-x)) rotateY(var(--tilt-y))
   * 
   * POR QUE useCallback: evita recriar a função a cada render.
   * Como ela é passada como prop (onMouseMove), sem useCallback o React
   * re-renderizaria os filhos desnecessariamente
   */
  const handleMouseMove = useCallback((e, index) => {
    if (dragState.current.isDragging) return;
    const slide = e.currentTarget;
    // getBoundingClientRect() aqui pra saber a posição exata do slide na tela
    const rect = slide.getBoundingClientRect();
    // Normalizo a posição do mouse pra um valor entre 0 e 1
    // 0 = lado esquerdo/topo, 1 = lado direito/base
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    // O slide ativo inclina mais (6°) pra dar sensação de interatividade
    // Os inativos inclinam menos (2°) pra não distrair
    const isActive = index === currentIndex;
    const maxDeg = isActive ? 6 : 2;
    // Subtraio 0.5 pra que o centro do slide seja o "ponto neutro" (0°)
    const rotateY = (x - 0.5) * maxDeg * 2;
    const rotateX = (0.5 - y) * maxDeg * 2;
    slide.style.setProperty('--tilt-x', `${rotateX}deg`);
    slide.style.setProperty('--tilt-y', `${rotateY}deg`);
  }, [currentIndex]);

  // Quando o mouse sai do slide, reseto a inclinação pra zero suavemente (o CSS cuida da transição)
  const handleMouseLeave = useCallback((e) => {
    const slide = e.currentTarget;
    slide.style.setProperty('--tilt-x', '0deg');
    slide.style.setProperty('--tilt-y', '0deg');
  }, []);

  /**
   * handlePointerDown — Início do gesto de arrastar
   * Funciona tanto com mouse quanto com touch (mobile)
   * 
   * e.target.closest('.carousel-controls') verifica se o clique foi nos botões ‹ ›
   * Se foi, ignoro o drag pra não conflitar com o clique nos botões
   */
  const handlePointerDown = useCallback((e) => {
    if (e.target.closest('.carousel-controls')) return;
    // e.touches existe em eventos de toque (mobile), e.clientX em eventos de mouse
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    dragState.current = { isDragging: true, startX: clientX, delta: 0, didDrag: false };
  }, []);

  /**
   * Efeito que registra listeners de arraste no WINDOW (não no carrossel)
   * 
   * POR QUE no window e não no carrossel?
   * Porque se o usuário arrastar rápido e o mouse sair do carrossel,
   * o evento de mousemove pararia de ser capturado. Registrando no window,
   * o arraste continua funcionando mesmo se o mouse sair do elemento.
   * 
   * AVISO: sem o cleanup (return), os listeners se acumulariam a cada re-render
   * e o arraste ficaria bugado (múltiplos handlers respondendo ao mesmo evento)
   */
  useEffect(() => {
    const onMove = (e) => {
      if (!dragState.current.isDragging) return;
      const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      const delta = clientX - dragState.current.startX;
      dragState.current.delta = delta;
      // Se moveu mais de 5px, marco como "arrastou de verdade"
      // Isso diferencia um clique simples de um drag — sem isso, qualquer micro-movimento
      // ao clicar seria interpretado como arraste e não navegaria pra página
      if (Math.abs(delta) > 5) dragState.current.didDrag = true;
      const track = trackRef.current;
      const carousel = carouselRef.current;
      if (!track || !carousel) return;
      const slides = Array.from(track.children);
      const activeSlide = slides[currentIndex];
      if (!activeSlide) return;
      // Desativo a transição CSS pra o track seguir o dedo/mouse instantaneamente
      // Se mantivesse a transição, haveria um delay irritante no arraste
      track.style.transition = 'none';
      const carouselCenter = carousel.getBoundingClientRect().width / 2;
      const slideCenter = activeSlide.offsetLeft + activeSlide.offsetWidth / 2;
      const baseOffset = slideCenter - carouselCenter;
      // Movo o track: posição base + delta do arraste
      track.style.transform = `translateX(${-baseOffset + delta}px)`;
    };

    const onEnd = () => {
      if (!dragState.current.isDragging) return;
      dragState.current.isDragging = false;
      const track = trackRef.current;
      // Reativo a transição pra animar suavemente de volta à posição final
      if (track) track.style.transition = '';
      const delta = dragState.current.delta;
      // 80px é o threshold mínimo pra considerar que o usuário quis trocar de slide
      // Escolhi 80px porque: muito baixo (ex: 30px) causaria trocas acidentais,
      // muito alto (ex: 200px) tornaria difícil navegar — 80px é um bom equilíbrio
      if (Math.abs(delta) > 80) {
        if (delta < 0 && currentIndex < slidesData.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else if (delta > 0 && currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
        } else {
          updateCarousel();
        }
      } else {
        updateCarousel();
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    // { passive: true } diz ao navegador que NÃO vou chamar preventDefault()
    // Isso melhora a performance do scroll em mobile
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [currentIndex, setCurrentIndex]);

  // Atualizo a posição do carrossel quando o índice muda ou a janela é redimensionada
  useEffect(() => {
    updateCarousel();
    window.addEventListener("resize", updateCarousel);
    return () => window.removeEventListener("resize", updateCarousel);
  }, [currentIndex]);

  return (
    <section
      className="eras-section"
      id="eras"
      // Passo a cor da era como variável CSS — o CSS usa pra colorir o overlay de fundo
      style={{ '--section-era-color': eraColors[currentIndex] || '#fff' }}
    >
      <div className="eras-section-bg-overlay" />
      <div
        className="eras-carousel"
        ref={carouselRef}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
      >
        <div className="carousel-track" ref={trackRef}>
          {slidesData.map((slide, index) => (
            <div
              key={index}
              className={`carousel-slide ${slide.eraClass}`}
              style={{
                backgroundImage: `url(${slide.img})`,
                cursor: index === currentIndex ? 'pointer' : 'grab'
              }}
              onClick={() => {
                // didDrag diferencia um clique de um arraste
                // Sem essa verificação, ao soltar o mouse após arrastar, o navegador
                // entenderia como um clique e navegaria pra página da era sem querer
                if (dragState.current.didDrag) {
                  dragState.current.didDrag = false;
                  return;
                }
                // Se clicou no slide ativo, navego pra página da era
                if (index === currentIndex) {
                  navigate(slide.path);
                } else {
                  // Se clicou num slide vizinho, troco o carrossel pra ele
                  setCurrentIndex(index);
                }
              }}
              onMouseDown={(e) => {
                if (index === currentIndex) {
                  const slide = e.currentTarget;
                  // Adiciono uma classe visual de "pressionando" pra feedback tátil
                  slide.classList.add('pressing');
                  setTimeout(() => {
                    slide.classList.remove('pressing');
                  }, 150);
                }
              }} onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={(e) => handleMouseLeave(e)}
            >
              <div className="era-content">
                <h3>{slide.title}</h3>
                <p>{slide.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="carousel-controls">
          <button
            className="prev"
            aria-label="Anterior"
            onClick={(e) => {
              // stopPropagation() impede que o evento "suba" pro pai
              // Sem isso, o clique no botão ‹ também ativaria o onClick do carrossel,
              // que tentaria navegar pra página da era — causando um bug
              e.stopPropagation();
              currentIndex > 0 && setCurrentIndex(currentIndex - 1);
            }}
          >
            ‹
          </button>
          <button
            className="next"
            aria-label="Próximo"
            onClick={(e) => {
              // stopPropagation() aqui pelo mesmo motivo: evita que o clique no botão ›
              // seja interpretado como clique no carrossel
              e.stopPropagation();
              currentIndex < slidesData.length - 1 && setCurrentIndex(currentIndex + 1);
            }}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}