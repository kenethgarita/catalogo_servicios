import React from 'react';
import './TarjetaServicio.css';

const TarjetaServicio = ({ 
  titulo, 
  imagen, 
  icono,
  descripcion 
}) => {
  return (
    <div className="tarjeta-servicio">
      <div className="tarjeta-imagen">
        <img src={imagen || '/placeholder-servicio.jpg'} alt={titulo} />
      </div>
      
      <div className="tarjeta-info">
        <div className="tarjeta-titulo-container">
          <div className="tarjeta-icono">
            {icono ? (
              <img src={icono} alt="" />
            ) : (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1d2d5a" strokeWidth="1.5">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            )}
          </div>
          <h3 className="tarjeta-titulo">{titulo}</h3>
        </div>
        
        <p className="tarjeta-descripcion">{descripcion}</p>
      </div>
    </div>
  );
};

export default TarjetaServicio;