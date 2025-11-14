import './detalleServicio.css';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Accesibilidad from '../components/accesibilidad';
import Header from '../components/header';
import Footer from '../components/footer';

const API_URL = process.env.REACT_APP_API_URL;

function DetalleServicio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [servicio, setServicio] = useState(null);
  const [imagenUrl, setImagenUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingImagen, setLoadingImagen] = useState(true);

  useEffect(() => {
    fetchServicio();
  }, [id]);

  const fetchServicio = async () => {
    try {
      const response = await fetch(`${API_URL}/Servicio/ListarServicioPorId/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Normalizar los nombres de campos de la API
      const servicioNormalizado = {
        id: data.id_servicio,
        nombre: data.nombre_servicio,
        categoria: data.nombre_categoria,
        descripcion: data.descripcion_servicio,
        proposito: data.proposito_servicio,
        area_responsable: data.area_responsable,
        tiempo_atencion: data.tiempo,
        tiene_imagen: data.tiene_imagen,
        tiene_documentacion: data.tiene_documentacion,
        documentacion_nombre: data.documentacion_nombre
      };

      setServicio(servicioNormalizado);
      setLoading(false);

      // Cargar imagen si existe
      if (data.tiene_imagen) {
        cargarImagen();
      } else {
        setLoadingImagen(false);
      }
    } catch (error) {
      console.error('Error al cargar servicio:', error);
      setLoading(false);
      setLoadingImagen(false);
    }
  };

  const cargarImagen = async () => {
    try {
      const response = await fetch(`${API_URL}/Servicio/Imagen/${id}`);
      if (response.ok) {
        const data = await response.json();
        setImagenUrl(data.data);
      }
    } catch (error) {
      console.error('Error al cargar imagen:', error);
    } finally {
      setLoadingImagen(false);
    }
  };

  const handleDownloadDoc = () => {
    window.open(`${API_URL}/Servicio/Documentacion/${id}`, '_blank');
  };

  if (loading) {
    return (
      <div className="detalle-page">
        <Accesibilidad />
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando servicio...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!servicio) {
    return (
      <div className="detalle-page">
        <Accesibilidad />
        <Header />
        <div className="error-container">
          <h2>Servicio no encontrado</h2>
          <p>El servicio que buscas no está disponible.</p>
          <button onClick={() => navigate('/')} className="btn-volver">
            Volver al inicio
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="detalle-page">
      <Accesibilidad />
      <Header />

      <main className="detalle-servicio">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <button onClick={() => navigate('/')} className="breadcrumb-link">Inicio</button>
          <span className="breadcrumb-separator">›</span>
          <button onClick={() => navigate('/')} className="breadcrumb-link">Servicios</button>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{servicio.nombre}</span>
        </div>

        {/* Hero Section */}
        <section className="servicio-hero">
          <div className="hero-content">
            <span className="servicio-categoria">{servicio.categoria}</span>
            <h1 className="servicio-titulo">{servicio.nombre}</h1>
          </div>
        </section>

        {/* Imagen del Servicio */}
        <section className="servicio-imagen-section">
          <div className="imagen-container">
            {loadingImagen ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '400px',
                backgroundColor: '#f0f0f0'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  border: '4px solid #e0e0e0',
                  borderTop: '4px solid #1d2d5a',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
              </div>
            ) : (
              <img 
                src={imagenUrl || '/placeholder-servicio.jpg'} 
                alt={servicio.nombre}
                onError={(e) => {
                  e.target.src = '/placeholder-servicio.jpg';
                }}
              />
            )}
          </div>
        </section>

        {/* Contenido Principal */}
        <div className="servicio-contenido">
          {/* Descripción */}
          <section className="servicio-seccion">
            <h2 className="seccion-titulo">Descripción del Servicio</h2>
            <p className="seccion-texto">{servicio.descripcion}</p>
          </section>

          {/* Información en Cards */}
          <section className="servicio-info-grid">
            <div className="info-card">
              <div className="info-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3>Área Responsable</h3>
              <p>{servicio.area_responsable}</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h3>Propósito</h3>
              <p>{servicio.proposito}</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <h3>Tiempo de Atención</h3>
              <p>{servicio.tiempo_atencion}</p>
            </div>
          </section>

          {/* Documentación */}
          {servicio.tiene_documentacion && (
            <section className="servicio-seccion documentacion-section">
              <h2 className="seccion-titulo">Documentación</h2>
              <div className="documentacion-card">
                <div className="doc-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <div className="doc-info">
                  <h3>{servicio.documentacion_nombre || 'Manual del Servicio'}</h3>
                  <p>Descarga la documentación completa del servicio</p>
                </div>
                <button 
                  onClick={handleDownloadDoc}
                  className="btn-descargar"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Descargar
                </button>
              </div>
            </section>
          )}

          {/* Botones de Acción */}
          <section className="servicio-acciones">
            <button onClick={() => navigate('/')} className="btn-secundario">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
              Volver a Servicios
            </button>

            <button 
              className="btn-primario"
              onClick={() => navigate(`/solicitar/${servicio.id}`)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Solicitar Servicio
            </button>
          </section>
        </div>
      </main>

      <Footer />
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default DetalleServicio;