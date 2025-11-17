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

  useEffect(() => {
    // Solo cargar si tiene_imagen es explícitamente verdadero
    if (tiene_imagen === 1 || tiene_imagen === true) {
      cargarImagen();
    }
  }, [id, tiene_imagen]);

  const cargarImagen = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/Servicio/Imagen/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setImagenUrl(data.data);
        }
      }
    } catch (error) {
      console.error('Error al cargar imagen:', error);
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
          // Mostrar spinner solo mientras carga
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            backgroundColor: '#e0e0e0'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #d0d0d0',
              borderTop: '4px solid #1d2d5a',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          </div>
        ) : imagenUrl ? (
          // Solo mostrar img si hay URL
          <img 
            src={imagenUrl} 
            alt={titulo}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          // Si no hay imagen, solo fondo gris - sin placeholder
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#e0e0e0'
          }}></div>
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