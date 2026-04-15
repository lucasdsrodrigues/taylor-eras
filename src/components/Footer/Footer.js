import React from "react";
import './footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <span className="footer-easter-wrap">
          <span className="footer-default">
            © 2025 • Projeto visual inspirado na discografia de Taylor Swift
          </span>
          <span className="footer-easter">
            long story short, i survived
          </span>
        </span>

        <div className="footer-icons">
          <a href="#" data-era="lover" aria-label="Instagram">
            <svg viewBox="0 0 24 24"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5a5 5 0 100 10 5 5 0 000-10zm6.5-.9a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0z"/></svg>
          </a>

          <a href="#" data-era="midnights" aria-label="Spotify">
            <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm4.6 14.4a.9.9 0 01-1.2.3 8.2 8.2 0 00-6.4-.7.9.9 0 01-.4-1.7 10 10 0 017.7.9.9.9 0 01.3 1.2z"/></svg>
          </a>

          <a href="#" data-era="reputation" aria-label="GitHub">
            <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 00-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-3 .6-3.6-1.4-3.6-1.4z"/></svg>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;