import './home.css';
import React, { useState, useEffect } from 'react';
import TarjetaServicio from '../components/TarjetaServicio';
import BotonHome from '../components/BotonHome';
import Accesibilidad from '../components/accesibilidad';
import Header from '../components/header';
import Footer from '../components/footer';

function Home() {
  const [serviciosHabilitados, setServiciosHabilitados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiciosHabilitados = async () => {
      try {
        // CONEXIÓN A BASE DE DATOS - Reemplaza con tu endpoint real
        /*
        const response = await fetch('/api/servicios/habilitados');
        const data = await response.json();
        setServiciosHabilitados(data);
        setLoading(false);
        */

        // DATOS DE EJEMPLO (PLACEHOLDER)
        const serviciosPlaceholder = [
          {
            id: 1,
            titulo: 'Servicio 1',
            imagen: 'https://via.placeholder.com/450x220/d3d3d3/666666?text=Servicio+1',
            icono: null,
            descripcion: 'Descripción del servicio 1. Esta es una descripción de ejemplo que se cortará con puntos suspensivos si es muy larga.',
            habilitado: true
          },
          {
            id: 2,
            titulo: 'Servicio 2',
            imagen: 'https://via.placeholder.com/450x220/d3d3d3/666666?text=Servicio+2',
            icono: null,
            descripcion: 'Descripción breve del servicio 2.',
            habilitado: true
          },
          {
            id: 3,
            titulo: 'Servicio 3',
            imagen: 'https://via.placeholder.com/450x220/d3d3d3/666666?text=Servicio+3',
            icono: null,
            descripcion: 'Otra descripción de servicio que también se ajustará automáticamente al espacio disponible.',
            habilitado: true
          },
          {
            id: 4,
            titulo: 'Servicio 4',
            imagen: 'https://via.placeholder.com/450x220/d3d3d3/666666?text=Servicio+4',
            icono: null,
            descripcion: 'Descripción del cuarto servicio disponible.',
            habilitado: true
          }
        ];

        setTimeout(() => {
          setServiciosHabilitados(serviciosPlaceholder);
          setLoading(false);
        }, 500);

      } catch (error) {
        console.error('Error al cargar servicios habilitados:', error);
        setLoading(false);
      }
    };

    fetchServiciosHabilitados();
  }, []);

  const handleVerServicios = () => {
    console.log('Ver Servicios');
    // Navegación o acción
  };

  const handleManejarPeticiones = () => {
    console.log('Manejar Peticiones');
    // Navegación o acción
  };

  const handleSolicitarServicio = () => {
    console.log('Solicitar Servicio');
    // Navegación o acción
  };

  return (
    <div className="home-page">
      <Accesibilidad />
      <Header />

      <main className="home">
        {/* Hero Section con imagen de fondo */}
        <section className="hero-section">
          {/* IMAGEN DE FONDO - Reemplaza '/hero-background.jpg' con tu imagen real */}
          <div 
            className="hero-background" 
            style={{ backgroundImage: `url('https://cdn.vectorstock.com/i/500p/73/65/gradient-orange-abstract-geometric-background-vector-51857365.jpg')` }}
          >
            {/* Overlay transparente gris claro para el texto */}
            <div className="hero-overlay"></div>
          </div>

          <div className="hero-content-wrapper">
            <div className="hero-content">
              <h1>Catálogo de servicios TI</h1>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Suspendisse non nunc ut nibh mattis venenatis sed vel tellus. 
                Phasellus feugiat posuere ipsum, id blandit elit elementum vitae. 
                Sed consectetur, felis sit amet ullamcorper tempus, ligula metus 
                mollis mi, et sagittis risus eros id ex. Donec sit amet ex quam. 
                Phasellus rutrum enim eu dolor vulputate, in dapibus enim malesuada. 
                Morbi viverra mi vel sollicitudin porttitor. Orci varius natoque 
                penatibus et magnis dis parturient montes, nascetur ridiculus mus.
              </p>
            </div>

            {/* Botones en la parte derecha */}
            <div className="hero-buttons">
              <BotonHome 
                texto="Ver Servicios" 
                onClick={handleVerServicios}
              />
              <BotonHome 
                texto="Manejar Peticiones" 
                onClick={handleManejarPeticiones}
              />
              <BotonHome 
                texto="Solicitar Servicio" 
                onClick={handleSolicitarServicio}
              />
            </div>
          </div>
        </section>

        {/* Barra de búsqueda */}
        <section className="search-section">
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Buscar servicios..." 
              className="search-input"
            />
            <button className="search-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          </div>
        </section>

        {/* Sección de Servicios */}
        <section className="servicios-section">
          <h2 className="servicios-titulo">Nuestros Servicios</h2>
          
          {loading ? (
            <div className="loading">Cargando servicios...</div>
          ) : (
            <>
              {serviciosHabilitados.length > 0 ? (
                <div className="servicios-grid">
                  {serviciosHabilitados.map(servicio => (
                    <TarjetaServicio
                      key={servicio.id}
                      titulo={servicio.titulo}
                      imagen={servicio.imagen}
                      icono={servicio.icono}
                      descripcion={servicio.descripcion}
                    />
                  ))}
                </div>
              ) : (
                <p className="no-servicios">No hay servicios habilitados en este momento.</p>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;