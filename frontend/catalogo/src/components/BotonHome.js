import React from 'react';
import './BotonHome.css';

const BotonHome = ({ texto, onClick, icono }) => {
  return (
    <button className="boton-home" onClick={onClick}>
      <span className="boton-home-texto">{texto}</span>
      <div className="boton-home-icono">
        {icono || (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        )}
      </div>
    </button>
  );
};

export default BotonHome;