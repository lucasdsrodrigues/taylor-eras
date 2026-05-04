import React, { useState, useEffect, useRef, useCallback } from 'react';
import './RatingSection.css';

const RatingSection = ({ era, tracks = [], theme }) => {
  const [albumRating, setAlbumRating] = useState(0);
  const [albumHover, setAlbumHover] = useState(0);
  const [songRatings, setSongRatings] = useState({});
  const [songHovers, setSongHovers] = useState({});
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const color = theme?.primary || '#fff';

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

  const getTrackName = useCallback((track) => {
    if (typeof track === 'string') return track;
    return track.titulo || track.title || track.name || '';
  }, []);

  const getTrackKey = useCallback((track, index) => {
    if (typeof track === 'string') return track;
    return track.no || track.id || track.titulo || track.title || track.name || index;
  }, []);

  const handleSongRate = (trackKey, nota) => {
    setSongRatings(prev => ({ ...prev, [trackKey]: nota }));
  };

  const handleSongHover = (trackKey, nota) => {
    setSongHovers(prev => ({ ...prev, [trackKey]: nota }));
  };

  const handleSongLeave = (trackKey) => {
    setSongHovers(prev => ({ ...prev, [trackKey]: 0 }));
  };

  const handleSubmit = async () => {
    setSending(true);
    setMessage('');
    let successCount = 0;
    let errorCount = 0;

    try {
      if (albumRating > 0) {
        try {
          const res = await fetch('http://localhost:3001/avaliar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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

      for (const [trackKey, nota] of Object.entries(songRatings)) {
        if (nota > 0) {
          const track = tracks.find((t, i) => String(getTrackKey(t, i)) === String(trackKey));
          const musicaName = track ? getTrackName(track) : trackKey;

          try {
            const res = await fetch('http://localhost:3001/avaliar', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
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

      if (successCount === 0 && errorCount === 0) {
        setMessage('Selecione pelo menos uma nota antes de enviar.');
      } else if (errorCount === 0) {
        setMessage(`✨ ${successCount} avaliação${successCount > 1 ? 'ões' : ''} enviada${successCount > 1 ? 's' : ''} com sucesso!`);
      } else {
        setMessage(`Enviadas: ${successCount} | Erros: ${errorCount}`);
      }
    } catch (error) {
      console.error('Erro ao enviar avaliações:', error);
      setMessage('Erro ao enviar. Verifique se o servidor está rodando.');
    }

    setSending(false);
    setTimeout(() => setMessage(''), 5000);
  };

  const AlbumStars = () => (
    <div className="rv-album-stars" onMouseLeave={() => setAlbumHover(0)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (albumHover || albumRating);
        return (
          <button
            key={star}
            className={`rv-star rv-star--lg ${isActive ? 'rv-star--active' : ''}`}
            onClick={() => setAlbumRating(star)}
            onMouseEnter={() => setAlbumHover(star)}
            style={{ '--rv-color': color, '--star-i': star }}
            aria-label={`${star} estrela${star > 1 ? 's' : ''}`}
          >
            ★
          </button>
        );
      })}
      {albumRating > 0 && (
        <span className="rv-album-nota" style={{ color }}>{albumRating}/5</span>
      )}
    </div>
  );

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

  const textBase = theme?.textBase || '#fff';
  const starOff = theme?.starOff || 'rgba(255,255,255,0.15)';

  return (
    <div
      ref={sectionRef}
      className={`rv-root ${isVisible ? 'rv-visible' : ''}`}
      style={{ '--rv-color': color, '--rv-text': textBase, '--rv-star-off': starOff }}
    >

      <span className="rv-era-label">avalie a era</span>
      <h2 className="rv-era-title">{theme?.name || era}</h2>

      <div className="rv-album-block">
        <span className="rv-album-label">o álbum</span>
        <AlbumStars />
      </div>

      <div className="rv-divider">
        <svg viewBox="0 0 300 8" fill="none">
          <path d="M0 4 Q75 0 150 4 Q225 8 300 4" stroke={color} strokeWidth="0.6" opacity="0.25" />
        </svg>
      </div>

      {tracks.length > 0 && (
        <div className="rv-tracks-block">
          <span className="rv-tracks-label">avalie as músicas</span>
          <ul className="rv-track-list">
            {tracks.map((track, index) => {
              const name = getTrackName(track);
              const key = getTrackKey(track, index);
              return (
                <li key={key} className="rv-track-row" style={{ '--row-i': index }}>
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

      <button
        className="rv-submit"
        onClick={handleSubmit}
        disabled={sending}
        style={{ '--rv-color': color }}
      >
        {sending ? 'Enviando…' : 'Enviar avaliação'}
      </button>

      {message && (
        <p className="rv-feedback" style={{ color }}>{message}</p>
      )}
    </div>
  );
};

export default RatingSection;
