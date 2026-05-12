import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './RatingSection.css';

/**
 * RatingSection — Componente reutilizável de avaliação que aparece em CADA página de era
 * 
 * @param {string} era — identificador da era (ex: 'debut', 'fearless', 'midnights')
 * @param {Array} tracks — lista de músicas do álbum (pode ser array de strings ou objetos)
 * @param {Object} theme — tema visual da era (vem do eraThemes.js: primary, textBase, starOff)
 * 
 * Decisão de design: esse componente é genérico pra funcionar com QUALQUER formato de track.
 * Por isso getTrackName() e getTrackKey() tentam vários campos (titulo, title, name, no, id)
 * — cada página usa um formato diferente de dados
 */
const RatingSection = ({ era, tracks = [], theme }) => {
  // Nota do álbum (0 = não avaliado, 1-5 = estrelas)
  const [albumRating, setAlbumRating] = useState(0);
  // Estrela que tá em hover (pra preview visual antes de clicar)
  const [albumHover, setAlbumHover] = useState(0);
  // Objeto com as notas de cada música: { trackKey: nota }
  const [songRatings, setSongRatings] = useState({});
  // Objeto com os hovers de cada música (pra preview)
  const [songHovers, setSongHovers] = useState({});
  // Mensagem de feedback após enviar
  const [message, setMessage] = useState('');
  // Flag de envio pra desabilitar o botão e evitar cliques duplos
  const [sending, setSending] = useState(false);
  // Ref e estado pra animação de entrada via IntersectionObserver
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Pego do contexto: token (JWT), user (dados do logado), openAuthModal (abrir login) e logout
  const { token, user, openAuthModal, logout } = useContext(AuthContext);

  // Cor principal da era — usada nas estrelas, botões e destaques
  const color = theme?.primary || '#fff';

  /**
   * Efeito que carrega as avaliações prévias do usuário logado
   * 
   * POR QUE isso é necessário: quando o usuário já avaliou uma era e volta pra página,
   * as estrelas precisam mostrar a nota que ele já deu. Sem isso, as estrelas
   * sempre começariam zeradas mesmo que ele já tenha avaliado
   * 
   * Se não tem token (deslogou), reseto tudo pra zero
   */
  useEffect(() => {
    if (!token) {
      setAlbumRating(0);
      setSongRatings({});
      return;
    }

    const loadMyRatings = async () => {
      try {
        const res = await fetch('http://localhost:3001/minhas-avaliacoes', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // Filtro só as avaliações dessa era específica
          const eraRatings = data.filter(item => item.era === era);

          let newSongRatings = {};
          let newAlbumRating = 0;

          eraRatings.forEach(rating => {
            if (rating.tipo === 'musica') {
              // findIndex procura a música pelo nome pra descobrir o índice dela no array
              // Preciso do índice pra gerar a key correta e associar a nota
              const trackIndex = tracks.findIndex(t => {
                const name = typeof t === 'string' ? t : (t.titulo || t.title || t.name || '');
                return name === rating.musica;
              });
              if (trackIndex !== -1) {
                const track = tracks[trackIndex];
                // A key é o identificador único da música — pode ser no, id, titulo, etc.
                const key = typeof track === 'string' ? track : (track.no || track.id || track.titulo || track.title || track.name || trackIndex);
                newSongRatings[key] = rating.nota;
              }
            } else {
              // Se o tipo é 'album', salvo a nota do álbum
              newAlbumRating = rating.nota;
            }
          });

          setAlbumRating(newAlbumRating);
          setSongRatings(newSongRatings);
        }
      } catch (error) {
        console.error("Erro ao carregar avaliações prévias", error);
      }
    };

    loadMyRatings();
  }, [token, era, tracks]);

  /**
   * IntersectionObserver — API do navegador que detecta quando um elemento entra na viewport
   * 
   * threshold: 0.05 = ativa quando 5% do elemento tá visível
   * obs.disconnect() = paro de observar após a primeira vez (a animação só roda uma vez)
   * 
   * AVISO: sem o cleanup (return () => obs.disconnect()), o observer continuaria
   * rodando mesmo após o componente desmontar, causando memory leak
   */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setIsVisible(true); obs.disconnect(); }
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /**
   * getTrackName — Extrai o nome da música de qualquer formato de track
   * 
   * POR QUE é tão flexível: cada página de era define tracks de forma diferente:
   * - Debut usa { titulo: "Tim McGraw" }
   * - Evermore usa { name: "willow" }
   * - TTPD usa { title: "Fortnight" }
   * Então essa função tenta todos os campos possíveis
   * 
   * useCallback evita recriar a função a cada render (otimização)
   */
  const getTrackName = useCallback((track) => {
    if (typeof track === 'string') return track;
    return track.titulo || track.title || track.name || '';
  }, []);

  // getTrackKey — Gera um identificador único pra cada música (pra usar como key do React e do estado)
  const getTrackKey = useCallback((track, index) => {
    if (typeof track === 'string') return track;
    return track.no || track.id || track.titulo || track.title || track.name || index;
  }, []);

  // Se não tá logado e tenta avaliar, abre o modal de login
  const handleSongRate = (trackKey, nota) => {
    if (!token) return openAuthModal();
    // Spread operator (...prev) cria uma cópia do objeto anterior e adiciona/atualiza a chave
    setSongRatings(prev => ({ ...prev, [trackKey]: nota }));
  };

  const handleSongHover = (trackKey, nota) => {
    setSongHovers(prev => ({ ...prev, [trackKey]: nota }));
  };

  const handleSongLeave = (trackKey) => {
    setSongHovers(prev => ({ ...prev, [trackKey]: 0 }));
  };

  /**
   * handleSubmit — Envia TODAS as avaliações (álbum + músicas) pro backend
   * 
   * POR QUE envio em sequência (for...of) em vez de Promise.all():
   * O SQLite não lida bem com múltiplas escritas simultâneas — pode dar lock.
   * Enviando uma por uma, evito conflitos de concorrência no banco
   * 
   * AVISO: se o backend tiver caído, errorCount vai acumular e a mensagem mostra quantos falharam
   */
  const handleSubmit = async () => {
    if (!token) {
      openAuthModal();
      return;
    }

    setSending(true);
    setMessage('');
    let successCount = 0;
    let errorCount = 0;

    try {
      // Primeiro envio a avaliação do álbum (se tem nota)
      if (albumRating > 0) {
        try {
          const res = await fetch('http://localhost:3001/avaliar', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              era,
              tipo: 'album',
              nota: albumRating,
              musica: null
            })
          });
          if (res.ok) successCount++;
          else errorCount++;
        } catch {
          errorCount++;
        }
      }

      // Depois envio cada avaliação de música individual
      // Object.entries() transforma o objeto { key: valor } em array de [key, valor]
      for (const [trackKey, nota] of Object.entries(songRatings)) {
        if (nota > 0) {
          // Preciso encontrar o track original pra pegar o nome da música
          // String() garante que a comparação funcione mesmo se um é número e outro string
          const track = tracks.find((t, i) => String(getTrackKey(t, i)) === String(trackKey));
          const musicaName = track ? getTrackName(track) : trackKey;

          try {
            const res = await fetch('http://localhost:3001/avaliar', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                era,
                tipo: 'musica',
                nota,
                musica: musicaName
              })
            });
            if (res.ok) successCount++;
            else errorCount++;
          } catch {
            errorCount++;
          }
        }
      }

      // Monto a mensagem de feedback baseada nos contadores
      if (successCount === 0 && errorCount === 0) {
        setMessage('Selecione pelo menos uma nota antes de enviar.');
      } else if (errorCount === 0) {
        // Template literal com condicional pra plural correto
        setMessage(`✨ ${successCount} avaliaç${successCount > 1 ? 'ões' : 'ão'} enviada${successCount > 1 ? 's' : ''} com sucesso!`);
      } else {
        setMessage(`Enviadas: ${successCount} | Erros: ${errorCount}`);
      }
    } catch (error) {
      console.error('Erro ao enviar avaliações:', error);
      setMessage('Erro ao enviar. Verifique se o servidor está rodando.');
    }

    setSending(false);
    // Limpo a mensagem após 5 segundos
    setTimeout(() => setMessage(''), 5000);
  };

  // Sub-componente das estrelas do álbum (tamanho grande)
  const AlbumStars = () => (
    // onMouseLeave no container reseta o hover quando o mouse sai da área toda
    <div className="rv-album-stars" onMouseLeave={() => setAlbumHover(0)}>
      {[1, 2, 3, 4, 5].map((star) => {
        // A estrela é "ativa" (preenchida) se: tá em hover OU já foi clicada
        // O operador || prioriza o hover sobre o rating (pra preview visual funcionar)
        const isActive = star <= (albumHover || albumRating);
        return (
          <button
            key={star}
            className={`rv-star rv-star--lg ${isActive ? 'rv-star--active' : ''}`}
            onClick={() => token ? setAlbumRating(star) : openAuthModal()}
            onMouseEnter={() => setAlbumHover(star)}
            // Passo a cor como variável CSS pra o CSS usar na estilização
            style={{ '--rv-color': color, '--star-i': star }}
            aria-label={`${star} estrela${star > 1 ? 's' : ''}`}
          >
            ★
          </button>
        );
      })}
      {/* Mostro a nota numérica ao lado das estrelas se já avaliou */}
      {albumRating > 0 && (
        <span className="rv-album-nota" style={{ color }}>{albumRating}/5</span>
      )}
    </div>
  );

  // Sub-componente das estrelas de cada música (tamanho menor)
  const SongStars = ({ trackKey }) => {
    const currentRating = songRatings[trackKey] || 0;
    const currentHover = songHovers[trackKey] || 0;

    return (
      <div className="rv-song-stars" onMouseLeave={() => handleSongLeave(trackKey)}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = star <= (currentHover || currentRating);
          return (
            <button
              key={star}
              className={`rv-star rv-star--sm ${isActive ? 'rv-star--active' : ''}`}
              onClick={() => handleSongRate(trackKey, star)}
              onMouseEnter={() => handleSongHover(trackKey, star)}
              style={{ '--rv-color': color }}
              aria-label={`${star} estrela${star > 1 ? 's' : ''}`}
            >
              ★
            </button>
          );
        })}
      </div>
    );
  };

  // Cores derivadas do tema pra texto e estrelas desligadas
  const textBase = theme?.textBase || '#fff';
  const starOff = theme?.starOff || 'rgba(255,255,255,0.15)';

  return (
    <div
      ref={sectionRef}
      className={`rv-root ${isVisible ? 'rv-visible' : ''}`}
      // Passo as cores como variáveis CSS — o CSS usa pra estilizar tudo tematicamente
      style={{ '--rv-color': color, '--rv-text': textBase, '--rv-star-off': starOff }}
    >

      {/* Header: título da seção e controles de autenticação */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <span className="rv-era-label">avalie a era</span>
          <h2 className="rv-era-title" style={{ margin: 0 }}>{theme?.name || era}</h2>
        </div>

        {/* Se tá logado, mostra "Olá, fulano" + botão sair. Senão, mostra botão de login */}
        <div className="rv-auth-controls">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>Olá, {user.username}</span>
              <button
                onClick={logout}
                style={{ background: 'none', border: `1px solid ${color}`, color: '#fff', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
              >
                Sair
              </button>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              style={{ background: color, border: 'none', color: '#000', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
            >
              Fazer Login para Avaliar
            </button>
          )}
        </div>
      </div>

      {/* Avaliação do álbum (estrelas grandes) */}
      <div className="rv-album-block">
        <span className="rv-album-label">o álbum</span>
        <AlbumStars />
      </div>

      {/* Divisor visual SVG — uma onda sutil entre álbum e músicas */}
      <div className="rv-divider">
        <svg viewBox="0 0 300 8" fill="none">
          {/* Q = curva quadrática de Bézier: cria uma onda suave */}
          <path d="M0 4 Q75 0 150 4 Q225 8 300 4" stroke={color} strokeWidth="0.6" opacity="0.25" />
        </svg>
      </div>

      {/* Lista de músicas com estrelas individuais (só aparece se tem tracks) */}
      {tracks.length > 0 && (
        <div className="rv-tracks-block">
          <span className="rv-tracks-label">avalie as músicas</span>
          <ul className="rv-track-list">
            {tracks.map((track, index) => {
              const name = getTrackName(track);
              const key = getTrackKey(track, index);
              return (
                <li key={key} className="rv-track-row" style={{ '--row-i': index }}>
                  {/* padStart(2, '0') formata "1" como "01", "2" como "02", etc. */}
                  <span className="rv-track-num">
                    {String(track.no || track.id || index + 1).padStart(2, '0')}
                  </span>
                  <span className="rv-track-name">{name}</span>
                  <SongStars trackKey={key} />
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Botão de enviar — desabilitado enquanto tá enviando pra evitar duplicatas */}
      <button
        className="rv-submit"
        onClick={handleSubmit}
        disabled={sending}
        style={{ '--rv-color': color }}
      >
        {sending ? 'Enviando…' : 'Enviar avaliação'}
      </button>

      {/* Mensagem de feedback que aparece por 5 segundos */}
      {message && (
        <p className="rv-feedback" style={{ color }}>{message}</p>
      )}
    </div>
  );
};

export default RatingSection;
