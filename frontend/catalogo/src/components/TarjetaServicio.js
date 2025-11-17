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
  const [loading, setLoading] = useState(false); // ← Cambiar a false por defecto
  const [errorCarga, setErrorCarga] = useState(false);

  useEffect(() => {
    // ✅ SOLUCIÓN: Solo cargar si explícitamente tiene_imagen es true
    if (tiene_imagen === true || tiene_imagen === 1) {
      cargarImagen();
    } else {
      setLoading(false);
      setImagenUrl(null);
    }
  }, [id, tiene_imagen]);

  const cargarImagen = async () => {
    // Evitar cargas duplicadas
    if (loading || imagenUrl) return;
    
    setLoading(true);
    setErrorCarga(false);

    try {
      const response = await fetch(`${API_URL}/Servicio/Imagen/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setImagenUrl(data.data);
        } else {
          setErrorCarga(true);
        }
      } else {
        setErrorCarga(true);
      }
    } catch (error) {
      console.error('Error al cargar imagen:', error);
      setErrorCarga(true);
    } finally {
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
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            backgroundColor: '#f0f0f0'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #e0e0e0',
              borderTop: '4px solid #1d2d5a',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          </div>
        ) : (
          <img 
            src={imagenUrl || '/placeholder-servicio.jpg'} 
            alt={titulo}
            onError={(e) => {
              // Solo intentar cambiar a placeholder una vez
              if (e.target.src !== '/placeholder-servicio.jpg') {
                e.target.src = '/placeholder-servicio.jpg';
              }
            }}
          />
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
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default TarjetaServicio;