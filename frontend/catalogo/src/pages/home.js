import './home.css';
import React, { useState, useEffect } from 'react';
import TarjetaServicio from '../components/TarjetaServicio';
import BotonHome from '../components/BotonHome';
import Accesibilidad from '../components/accesibilidad';
import Header from '../components/header';
import Footer from '../components/footer';

const API_URL = process.env.REACT_APP_API_URL;

function Home() {
  const [serviciosHabilitados, setServiciosHabilitados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiciosHabilitados = async () => {
      try {
        const response = await fetch(`${API_URL}/Servicio/ListarServicios`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log('Respuesta JSON:', data);

        if (Array.isArray(data) && data.length > 0) {
          setServiciosHabilitados(data);
        } else {
          setServiciosHabilitados([]); // fallback si no hay servicios
        }
      } catch (error) {
        console.error('Error al cargar servicios habilitados:', error);
        setServiciosHabilitados([]); // fallback en caso de error
      } finally {
        setLoading(false);
      }
    };

    fetchServiciosHabilitados();
  }, []);

  const handleVerServicios = () => console.log('Ver Servicios');
  const handleManejarPeticiones = () => console.log('Manejar Peticiones');
  const handleSolicitarServicio = () => console.log('Solicitar Servicio');

  return (
    <div className="home-page">
      <Accesibilidad />
      <Header />

      <main className="home">
        {/* Hero Section */}
        <section className="hero-section">
          <div 
            className="hero-background" 
            style={{ backgroundImage: `url('https://cdn.vectorstock.com/i/500p/73/65/gradient-orange-abstract-geometric-background-vector-51857365.jpg')` }}
          >
            <div className="hero-overlay"></div>
          </div>

          <div className="hero-content-wrapper">
            <div className="hero-content">
              <h1>Catálogo de servicios TI</h1>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Suspendisse non nunc ut nibh mattis venenatis sed vel tellus. 
                Phasellus feugiat posuere ipsum, id blandit elit elementum vitae. 
              </p>
            </div>

            <div className="hero-buttons">
              <BotonHome texto="Ver Servicios" onClick={handleVerServicios} />
              <BotonHome texto="Manejar Peticiones" onClick={handleManejarPeticiones} />
              <BotonHome texto="Solicitar Servicio" onClick={handleSolicitarServicio} />
            </div>
          </div>
        </section>

        {/* Barra de búsqueda */}
        <section className="search-section">
          <div className="search-container">
            <input type="text" placeholder="Buscar servicios..." className="search-input" />
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
                    key={servicio.id_servicio}
                    id={servicio.id_servicio}       // <-- aquí
                    titulo={servicio.nombre_servicio}
                    imagen={servicio.imagen_servicio}
                    icono={servicio.icono}
                    descripcion={servicio.descripcion_servicio}
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