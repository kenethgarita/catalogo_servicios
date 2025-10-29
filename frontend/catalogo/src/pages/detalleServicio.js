import './detalleServicio.css';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Accesibilidad from '../components/accesibilidad';
import Header from '../components/header';
import Footer from '../components/footer';

function DetalleServicio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [servicio, setServicio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServicio();
  }, [id]);

  const fetchServicio = async () => {
    try {
      // CONEXIÓN A BASE DE DATOS - Reemplaza con tu endpoint real
      /*
      const response = await fetch(`/api/servicios/${id}`);
      const data = await response.json();
      setServicio(data);
      setLoading(false);
      */

      // DATOS DE EJEMPLO (PLACEHOLDER)
      const serviciosPlaceholder = {
        1: {
          id: 1,
          nombre: 'Soporte Técnico',
          categoria: 'Tecnología',
          imagen: 'https://via.placeholder.com/1200x500/4a90e2/ffffff?text=Soporte+Tecnico',
          descripcion: 'Servicio de soporte técnico para resolver problemas relacionados con hardware, software y conectividad. Incluye diagnóstico, reparación y mantenimiento preventivo de equipos. También ofrece asesoría en la implementación de nuevas tecnologías y capacitación al personal en el uso de herramientas digitales. Nuestro equipo de expertos está disponible para brindar soluciones rápidas y efectivas a cualquier incidencia técnica que pueda surgir en su municipalidad.',
          proposito: 'Garantizar el correcto funcionamiento de los equipos tecnológicos y maximizar la productividad del personal mediante soluciones técnicas eficientes y oportunas.',
          area_responsable: 'Departamento de Tecnologías de Información',
          tiempo_atencion: '24-48 horas',
          documentacion: 'https://ejemplo.com/docs/soporte-tecnico.pdf'
        },
        2: {
          id: 2,
          nombre: 'Gestión de Recursos Humanos',
          categoria: 'Administrativo',
          imagen: 'https://via.placeholder.com/1200x500/2ecc71/ffffff?text=RRHH',
          descripcion: 'Administración integral de recursos humanos incluyendo contratación, capacitación, evaluación de desempeño y gestión de nómina. El servicio abarca desde el reclutamiento y selección de personal hasta el desarrollo profesional continuo de los colaboradores. Implementamos las mejores prácticas en gestión del talento para asegurar un equipo motivado y competente.',
          proposito: 'Optimizar la gestión del talento humano en la organización y fomentar un ambiente laboral positivo que promueva el desarrollo profesional.',
          area_responsable: 'Departamento de Recursos Humanos',
          tiempo_atencion: '5-7 días hábiles',
          documentacion: 'https://ejemplo.com/docs/rrhh.pdf'
        },
        3: {
          id: 3,
          nombre: 'Asesoría Legal',
          categoria: 'Legal',
          imagen: 'https://via.placeholder.com/1200x500/e74c3c/ffffff?text=Asesoria+Legal',
          descripcion: 'Servicio de consultoría y asesoramiento legal en temas corporativos, contratos, cumplimiento normativo y resolución de conflictos. Incluye revisión de documentos legales, representación en procedimientos administrativos y orientación en temas de compliance. Nuestro equipo legal proporciona asesoría especializada para proteger los intereses de su municipalidad.',
          proposito: 'Proveer orientación legal especializada para garantizar el cumplimiento normativo y minimizar riesgos legales en todas las operaciones municipales.',
          area_responsable: 'Departamento Legal y Normativo',
          tiempo_atencion: '3-5 días hábiles',
          documentacion: 'https://ejemplo.com/docs/legal.pdf'
        },
        4: {
          id: 4,
          nombre: 'Capacitación Municipal',
          categoria: 'Educación',
          imagen: 'https://via.placeholder.com/1200x500/9b59b6/ffffff?text=Capacitacion',
          descripcion: 'Programas de capacitación y formación continua para el personal municipal en diversas áreas de especialización. Ofrecemos cursos presenciales y virtuales diseñados para fortalecer las competencias del personal y mejorar la eficiencia en la prestación de servicios municipales.',
          proposito: 'Fortalecer las capacidades del personal municipal mediante programas de formación continua y actualización profesional.',
          area_responsable: 'Centro de Capacitación IFAM',
          tiempo_atencion: '10-15 días hábiles',
          documentacion: 'https://ejemplo.com/docs/capacitacion.pdf'
        }
      };

      setTimeout(() => {
        const servicioEncontrado = serviciosPlaceholder[id];
        setServicio(servicioEncontrado);
        setLoading(false);
      }, 500);

    } catch (error) {
      console.error('Error al cargar servicio:', error);
      setLoading(false);
    }
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
          <button onClick={() => navigate('/')} className="breadcrumb-link">
            Inicio
          </button>
          <span className="breadcrumb-separator">›</span>
          <button onClick={() => navigate('/')} className="breadcrumb-link">
            Servicios
          </button>
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
            <img src={servicio.imagen} alt={servicio.nombre} />
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
          {servicio.documentacion && (
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
                  <h3>Manual del Servicio</h3>
                  <p>Descarga la documentación completa del servicio</p>
                </div>
                <a 
                  href={servicio.documentacion} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-descargar"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Descargar
                </a>
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
            <button className="btn-primario">
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
    </div>
  );
}

export default DetalleServicio;