import React, { useState, useEffect } from 'react';
import './header.css';

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const toggleMenu = () => {
    if (showMenu) {
      // Iniciar animación de cierre
      setIsClosing(true);
      setTimeout(() => {
        setShowMenu(false);
        setIsClosing(false);
      }, 300); // Duración de la animación de cierre
    } else {
      setShowMenu(true);
      setIsClosing(false);
    }
  };

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showMenu) {
        toggleMenu();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showMenu]);

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

      {/* Sidebar menu - mantener montado durante el cierre */}
      {(showMenu || isClosing) && (
        <>
          <div 
            className={`sidebar-overlay ${isClosing ? 'closing' : ''}`} 
            onClick={toggleMenu}
          ></div>
          <aside className={`sidebar ${isClosing ? 'closing' : ''}`}>
            <nav>
              <ul>
                <li><a href="/" onClick={toggleMenu}>Inicio</a></li>
                <li><a href="/detalle/servicio" onClick={toggleMenu}>Ver servicio</a></li>
                <li><a href="/admin/servicios" onClick={toggleMenu}>Servicios</a></li>
                <li><a href="/login" onClick={toggleMenu}>Acceder a la cuenta</a></li>
              </ul>
            </nav>
          </aside>
        </>
      )}
    </>
  );
};

export default Header;