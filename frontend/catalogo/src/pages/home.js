import './home.css';
import React, { useState, useEffect } from 'react';
import TarjetaServicio from '../components/TarjetaServicio';
import BotonHome from '../components/BotonHome';
import Accesibilidad from '../components/accesibilidad';
import Header from '../components/header';
import Footer from '../components/footer';

const API_URL = process.env.REACT_APP_API_URL;

function Home() {

  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isResponsable, setIsResponsable] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const payload = JSON.parse(atob(token.split('.')[1]));
      const rol = payload.rol?.toLowerCase() || '';
      const esResponsable = payload.es_responsable === true || payload.es_responsable === 1;
      setUserRole(rol);
      setIsResponsable(esResponsable);
      setIsAuthenticated(true);
    } catch {}
  }, []);

  const [serviciosHabilitados, setServiciosHabilitados] = useState([]);
  const [serviciosFiltrados, setServiciosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');

  useEffect(() => {
    const fetchServiciosHabilitados = async () => {
      try {
        const response = await fetch(`${API_URL}/Servicio/ListarServicios`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log('Respuesta JSON:', data);

        if (Array.isArray(data) && data.length > 0) {
          setServiciosHabilitados(data);
          setServiciosFiltrados(data);
          
          // Extraer categorías únicas
          const categoriasUnicas = [...new Set(data.map(s => s.nombre_categoria))].filter(Boolean);
          setCategorias(categoriasUnicas);
        } else {
          setServiciosHabilitados([]);
          setServiciosFiltrados([]);
        }
      } catch (error) {
        console.error('Error al cargar servicios habilitados:', error);
        setServiciosHabilitados([]);
        setServiciosFiltrados([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServiciosHabilitados();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim() && categoriaFiltro === 'todas') {
      setServiciosFiltrados(serviciosHabilitados);
      return;
    }

    let filtrados = [...serviciosHabilitados];

    // Filtrar por búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtrados = filtrados.filter(servicio => {
        const nombre = (servicio.nombre_servicio || '').toLowerCase();
        const descripcion = (servicio.descripcion_servicio || '').toLowerCase();
        const categoria = (servicio.nombre_categoria || '').toLowerCase();
        
        return nombre.includes(term) || 
               descripcion.includes(term) || 
               categoria.includes(term);
      });
    }

    // Filtrar por categoría
    if (categoriaFiltro !== 'todas') {
      filtrados = filtrados.filter(servicio => 
        servicio.nombre_categoria === categoriaFiltro
      );
    }

    setServiciosFiltrados(filtrados);
  }, [searchTerm, categoriaFiltro, serviciosHabilitados]);

  return (
    <div className="home-page">
      <Accesibilidad />
      <Header />

      <main className="home">
        {/* Hero Section */}
        <section className="hero-section">
          <div 
            className="hero-background" 
            style={{ backgroundImage: `url('https://owl.excelsior.edu/wp-content/uploads/2018/08/book-408302_1920-768x384.jpg')` }}
          >
            <div className="hero-overlay"></div>
          </div>

          <div className="hero-content-wrapper">
            <div className="hero-content">
              <h1>Catálogo de servicios TI</h1>
              <p>
                Te damos la bienvenida a el catálogo de servicios del departamento de TI,
                Ofrecemos distintos servicios que puedes pedir en este sitio web.
              </p>
              <br></br>
              <p>
                Explora nuestros servicios y solicita el que necesites de manera fácil y rápida
                dentro de un formulario.
              </p>
            </div>

            <div className="hero-buttons-container">
              {/* Usuario no autenticado */}
              {!isAuthenticated && (
                <div className="buttons-section">
                  <h3 className="buttons-section-title">Acceso al Sistema</h3>
                  <div className="hero-buttons">
                    <BotonHome texto="Iniciar Sesión" ruta="/login" />
                    <BotonHome texto="Ver Servicios" onClick={() => {
                      document.querySelector('.servicios-section')?.scrollIntoView({ behavior: 'smooth' });
                    }} />
                  </div>
                </div>
              )}

                {/* Usuario autenticado (no responsable, no admin) */}
              {isAuthenticated && !isResponsable && userRole !== 'administrador' && userRole !== 'admin' && (
                <>
                  <div className="buttons-section">
                    <h3 className="buttons-section-title">Mis Servicios</h3>
                    <div className="hero-buttons">
                      <BotonHome texto="Mis Solicitudes" ruta="/mis-solicitudes" />
                      <BotonHome texto="Solicitar Servicio" ruta="/solicitar" />
                      <BotonHome texto="Ver Servicios" onClick={() => {
                        document.querySelector('.servicios-section')?.scrollIntoView({ behavior: 'smooth' });
                      }} />
                    </div>
                  </div>
                  <div className="buttons-section">
                    <h3 className="buttons-section-title">Mi Cuenta</h3>
                    <div className="hero-buttons">
                      <BotonHome texto="Ver perfil" ruta="/perfil" />
                    </div>
                  </div>
                </>
              )}

              {/* Usuario responsable o admin (pero mostrando vista de responsable) */}
              {isAuthenticated && (isResponsable || userRole === 'administrador' || userRole === 'admin') && (
                <>
                  <div className="buttons-section">
                    <h3 className="buttons-section-title">Mis Servicios</h3>
                    <div className="hero-buttons">
                      <BotonHome texto="Mis Solicitudes" ruta="/mis-solicitudes" />
                      <BotonHome texto="Solicitar Servicio" ruta="/solicitar" />
                      <BotonHome texto="Ver Servicios" onClick={() => {
                        document.querySelector('.servicios-section')?.scrollIntoView({ behavior: 'smooth' });
                      }} />
                    </div>
                  </div>

                  <div className="buttons-section">
                    <h3 className="buttons-section-title">Gestión de Solicitudes</h3>
                    <div className="hero-buttons">
                      <BotonHome texto="Ver Solicitudes Asignadas" ruta="/responsable/solicitudes" />
                    </div>
                  </div>

                  {(userRole === 'administrador' || userRole === 'admin') && (
                    <div className="buttons-section">
                      <h3 className="buttons-section-title">Administración del Sistema</h3>
                      <div className="hero-buttons">
                        <BotonHome texto="Gestionar Servicios" ruta="/admin/servicios" />
                        <BotonHome texto="Gestionar Roles" ruta="/admin/roles" />
                        <BotonHome texto="Gestionar Secciones" ruta="/admin/categorias" />
                      </div>
                    </div>
                  )}

                  <div className="buttons-section">
                    <h3 className="buttons-section-title">Mi Cuenta</h3>
                    <div className="hero-buttons">
                      <BotonHome texto="Ver perfil" ruta="/perfil" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Sección de Servicios */}
        <section className="servicios-section">
          <h2 className="servicios-titulo">Nuestros Servicios</h2>

          {/* Barra de búsqueda y filtros */}
          <section className="search-section">
            <div className="search-container">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input 
                type="text" 
                placeholder="Buscar servicios..." 
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="search-button"
                  onClick={() => setSearchTerm('')}
                  style={{ right: '12px' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>

            {/* Filtro de categorías */}
            {categorias.length > 0 && (
              <div className="filter-container">
                <label htmlFor="categoria-filter" className="filter-label">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
                  </svg>
                  Filtrar por categoría:
                </label>
                <select 
                  id="categoria-filter"
                  className="filter-select"
                  value={categoriaFiltro}
                  onChange={(e) => setCategoriaFiltro(e.target.value)}
                >
                  <option value="todas">Todas las categorías</option>
                  {categorias.map((categoria, index) => (
                    <option key={index} value={categoria}>
                      {categoria}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </section>
          
          {loading ? (
            <div className="loading">Cargando servicios...</div>
          ) : (
            <>
              {serviciosFiltrados.length > 0 ? (
                <div className="servicios-grid">
                  {serviciosFiltrados.map(servicio => (
                    <TarjetaServicio
                      key={servicio.id_servicio}
                      id={servicio.id_servicio}
                      titulo={servicio.nombre_servicio}
                      icono={servicio.icono}
                      descripcion={servicio.descripcion_servicio}
                      tiene_imagen={servicio.tiene_imagen}
                    />
                  ))}
                </div>
              ) : (
                <p className="no-servicios">No se encontraron servicios que coincidan con tu búsqueda.</p>
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