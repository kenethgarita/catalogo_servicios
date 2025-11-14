// Footer.js
import React from 'react';
import './footer.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">Dirección</h3>
          <p className="footer-text">
            Los Colegios, San Vicente de Moravia, de la esquina noreste de Lincoln Plaza 100m Oeste, 100m Sur y 100 Oeste, contiguo al Centro Nacional de la Música.
          </p>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Horario de atención</h3>
          <p className="footer-text">
            
            <strong>Lunes a viernes:</strong>
            8:00am - 4:00pm
          </p>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Contacto</h3>
          <p className="footer-text">
            <strong>Central telefónica</strong>
            2507-1000
          </p>
          <p className="footer-text">
            <br />
            <strong>Correo electrónico</strong>
            comunicacion@ifam.go.cr
          </p>
          <div className="footer-social">
            <a href="#" className="social-icon" aria-label="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" className="social-icon" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="#" className="social-icon" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-logo-section">
          <div className="footer-logo">
            <img src="https://www.ifam.go.cr/FrontEnd/assets/img/footer.png" alt="Presidencia de la República - Gobierno de Costa Rica" />
          </div>
          <div className="footer-buttons-static">
            <button className="footer-btn accessibility" aria-label="Accesibilidad">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C10.9 2 10 2.9 10 4C10 5.1 10.9 6 12 6C13.1 6 14 5.1 14 4C14 2.9 13.1 2 12 2ZM21 9H15V22H13V16H11V22H9V9H3V7H21V9Z"/>
              </svg>
            </button>
            <button className="footer-btn scroll-top" aria-label="Volver arriba" onClick={scrollToTop}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.41 15.41L12 10.83L16.59 15.41L18 14L12 8L6 14L7.41 15.41Z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Todos los derechos reservados © IFAM</p>
      </div>
    </footer>
  );
}

export default Footer;