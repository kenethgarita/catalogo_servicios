// Header.js
import React from 'react';
import './header.css'; // Puedes crear un archivo CSS si quieres personalizar el estilo

const Header = () => {
  return (
    <header className="header">
      <h1>Mi Aplicación</h1>
      <nav>
        <ul>
          <li><a href="/">Inicio</a></li>
          <li><a href="/about">Acerca de</a></li>
          <li><a href="/contact">Contacto</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
