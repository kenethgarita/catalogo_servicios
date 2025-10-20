import React, { useState } from 'react';
import './header.css';

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          <img src="https://www.ifam.go.cr/FrontEnd/assets/img/header.png" alt="Logo IFAM" className="logo" />
          <div className="titles">
          </div>
        </div>

        <div className="header-right">
          {/* Botón hamburguesa con transformación a X */}
          <button 
            className={`menu-toggle ${showMenu ? 'active' : ''}`} 
            onClick={toggleMenu}
            aria-label="Menú"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </header>

      {/* Sidebar menu */}
      {showMenu && (
        <>
          <div className="sidebar-overlay" onClick={toggleMenu}></div>
          <aside className="sidebar">
            <nav>
              <ul>
                <li><a href="/">Sobre IFAM</a></li>
                <li><a href="/nosotros">Nosotros</a></li>
                <li><a href="/servicios">Servicios</a></li>
                <li><a href="/contacto">Contacto</a></li>
              </ul>
            </nav>
          </aside>
        </>
      )}
    </>
  );
};

export default Header;