import React, { useState } from 'react';
import './header.css';

const Header = ({ onStyleChange }) => {
  const [fontSize, setFontSize] = useState(16);
  const [contrast, setContrast] = useState('default');
  const [showMenu, setShowMenu] = useState(false);
  const [accessMenuVisible, setAccessMenuVisible] = useState(false);

  const handleStyleChange = (style, value) => {
    if (style === 'fontSize') {
      const newFontSize = Math.min(fontSize + 2, 24);
      setFontSize(newFontSize);
      onStyleChange({ fontSize: newFontSize });
    } else if (style === 'contrast') {
      setContrast(prev => (prev === 'default' ? 'high' : 'default'));
      onStyleChange({ contrast: contrast === 'default' ? 'high' : 'default' });
    } else if (style === 'invert') {
      setContrast(prev => (prev === 'inverted' ? 'default' : 'inverted'));
      onStyleChange({ contrast: contrast === 'inverted' ? 'default' : 'inverted' });
    } else if (style === 'reset') {
      setFontSize(16);
      setContrast('default');
      onStyleChange({ fontSize: 16, contrast: 'default' });
    }
  };

  return (
    <>
      <header className={`header ${contrast}`} style={{ fontSize: `${fontSize}px` }}>
        <div className="header-left">
          <img src="https://www.ifam.go.cr/FrontEnd/assets/img/header.png" alt="Logo IFAM" className="logo" />
          <div className="titles">
          </div>
        </div>

        <div className="header-right">
          <div
            className="accessibility-wrapper"
            onMouseEnter={() => setAccessMenuVisible(true)}
            onMouseLeave={() => setAccessMenuVisible(false)}
          >
            

          </div>

          <button className="menu-toggle" onClick={() => setShowMenu(true)}>
            &#9776;
          </button>
        </div>
      </header>

      {/* Sidebar menu */}
      {showMenu && (
        <aside className="sidebar">
          <button className="close-button" onClick={() => setShowMenu(false)}>×</button>
          <nav>
            <ul>
              <li><a href="/">Inicio</a></li>
              <li><a href="/nosotros">Nosotros</a></li>
              <li><a href="/servicios">Servicios</a></li>
              <li><a href="/contacto">Contacto</a></li>
            </ul>
          </nav>
        </aside>
      )}
    </>
  );
};

export default Header;
