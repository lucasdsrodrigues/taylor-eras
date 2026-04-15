import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './FearlessGallery.css';

import f1 from '../../imagens/fearless1.webp';
import f2 from '../../imagens/fearless2.webp';
import f3 from '../../imagens/fearless3.webp';
import f4 from '../../imagens/fearless4.webp';
import f5 from '../../imagens/fearless5.webp';
import f6 from '../../imagens/fearless6.webp';
import f7 from '../../imagens/fearless7.webp';
import f8 from '../../imagens/fearless8.webp';
import f9 from '../../imagens/fearless9.webp';
import f10 from '../../imagens/fearless10.webp';
import f11 from '../../imagens/fearless11.webp';
import f12 from '../../imagens/fearless12.webp';
import f13 from '../../imagens/fearless13.webp';
import f14 from '../../imagens/fearless14.webp';
import f15 from '../../imagens/fearless15.webp';
import f16 from '../../imagens/fearless16.webp';
import f17 from '../../imagens/fearless17.webp';
import f18 from '../../imagens/fearless18.webp';
import f19 from '../../imagens/fearless19.webp';
import f20 from '../../imagens/fearless20.webp';

const FearlessGallery = () => {
  const [selectedImg, setSelectedImg] = useState(null);

  const photos = [
    { id: 1, url: f1 }, { id: 2, url: f2 }, { id: 3, url: f3 }, { id: 4, url: f4 },
    { id: 5, url: f5 }, { id: 6, url: f6 }, { id: 7, url: f7 }, { id: 8, url: f8 },
    { id: 9, url: f9 }, { id: 10, url: f10 }, { id: 11, url: f11 }, { id: 12, url: f12 },
    { id: 13, url: f13 }, { id: 14, url: f14 }, { id: 15, url: f15 }, { id: 16, url: f16 },
    { id: 17, url: f17 }, { id: 18, url: f18 }, { id: 19, url: f19 }, { id: 20, url: f20 }
  ];

  return (
    <div className="fg-container">
      <nav className="fg-nav">
        <Link to="/fearless" className="fg-back">← FEARLESS ERA</Link>
        <h1 className="fg-title">PHOTO ARCHIVE</h1>
      </nav>

      <div className="fg-masonry-grid">
        {photos.map((photo) => (
          <div 
            key={photo.id} 
            className="fg-item"
            onClick={() => setSelectedImg(photo.url)}
          >
            <img src={photo.url} alt={`Fearless ${photo.id}`} loading="lazy" />
          </div>
        ))}
      </div>

      {selectedImg && (
        <div className="fg-lightbox" onClick={() => setSelectedImg(null)}>
          <div className="fg-modal-content">
            <img src={selectedImg} alt="Preview" />
            <span className="fg-close-hint">CLICK ANYWHERE TO CLOSE</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FearlessGallery;