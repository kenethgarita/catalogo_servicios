import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TarjetaServicio.css';

const API_URL = process.env.REACT_APP_API_URL;

const TarjetaServicio = ({ 
  id,
  titulo, 
  icono,
  descripcion,
  tiene_imagen
}) => {
  const navigate = useNavigate();
  const [imagenUrl, setImagenUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagenError, setImagenError] = useState(false);

  useEffect(() => {
    // Solo cargar si tiene_imagen es explícitamente verdadero
    if (tiene_imagen === 1 || tiene_imagen === true) {
      cargarImagen();
    }
  }, [id, tiene_imagen]);

  const cargarImagen = async () => {
    setLoading(true);
    setImagenError(false);
    
    try {
      // MEJORA: Usar URL directa de la imagen (formato binario)
      const imageUrl = `${API_URL}/Servicio/Imagen/${id}`;
      
      // Precargar la imagen para verificar que existe
      const img = new Image();
      img.onload = () => {
        setImagenUrl(imageUrl);
        setLoading(false);
      };
      img.onerror = () => {
        console.error(`Error al cargar imagen para servicio ${id}`);
        setImagenError(true);
        setLoading(false);
      };
      img.src = imageUrl;
      
    } catch (error) {
      console.error('Error al cargar imagen:', error);
      setImagenError(true);
      setLoading(false);
    }
  };

  const handleClick = () => {
    navigate(`/servicio/${id}`);
  };

  return (
    <div className="tarjeta-servicio" onClick={handleClick}>
      <div className="tarjeta-imagen">
        {loading ? (
          // Spinner de carga
          <div className="tarjeta-imagen-loading">
            <div className="tarjeta-spinner"></div>
          </div>
        ) : imagenUrl && !imagenError ? (
          // Imagen con optimizaciones de calidad
          <img 
            src={imagenUrl} 
            alt={titulo}
            className="tarjeta-imagen-hq"
            loading="lazy"
            decoding="async"
          />
        ) : (
          // Placeholder cuando no hay imagen o hay error
          <div className="tarjeta-imagen-placeholder">
            <svg 
              width="64" 
              height="64" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#999" 
              strokeWidth="1.5"
              className="placeholder-icon"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        )}
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