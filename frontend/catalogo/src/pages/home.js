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

  useEffect(() => {
    const fetchServiciosHabilitados = async () => {
      try {
        const response = await fetch(`${API_URL}/Servicio/ListarServicios`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log('Respuesta JSON:', data);

        if (Array.isArray(data) && data.length > 0) {
          setServiciosHabilitados(data);
          setServiciosFiltrados(data); // ← Inicializar filtrados
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

  // Filtrar servicios cuando cambia el término de búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setServiciosFiltrados(serviciosHabilitados);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtrados = serviciosHabilitados.filter(servicio => {
      const nombre = (servicio.nombre_servicio || '').toLowerCase();
      const descripcion = (servicio.descripcion_servicio || '').toLowerCase();
      const categoria = (servicio.nombre_categoria || '').toLowerCase();
      
      return nombre.includes(term) || 
             descripcion.includes(term) || 
             categoria.includes(term);
    });

    setServiciosFiltrados(filtrados);
  }, [searchTerm, serviciosHabilitados]);

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



            <div className="hero-buttons">
              {!isAuthenticated && (
                <>
                  <BotonHome texto="Iniciar Sesión" ruta="/login" />
                  <BotonHome texto="Ver Servicios" onClick={() => {
                    document.querySelector('.servicios-section')?.scrollIntoView({ behavior: 'smooth' });
                  }} />
                </>
              )}

              {isAuthenticated && !isResponsable && userRole !== 'administrador' && userRole !== 'admin' && (
                <>
                  <BotonHome texto="Mis Solicitudes" ruta="/mis-solicitudes" />
                  <BotonHome texto="Solicitar Servicio" ruta="/solicitar" />
                  <BotonHome texto="Ver Servicios" onClick={() => {

                    document.querySelector('.servicios-section')?.scrollIntoView({ behavior: 'smooth' });
                  }} />
                  <BotonHome texto="Ver perfil" ruta="/perfil" />
                </>
              )}

              {isAuthenticated && (isResponsable || userRole === 'administrador' || userRole === 'admin') && (
                <>
                  <BotonHome texto="Mis Solicitudes" ruta="/mis-solicitudes" />
                  <BotonHome texto="Ver Solicitudes Asignadas" ruta="/responsable/solicitudes" />
                  <BotonHome texto="Ver Servicios" onClick={() => {
                    document.querySelector('.servicios-section')?.scrollIntoView({ behavior: 'smooth' });
                  }} />
                  <BotonHome texto="Ver perfil" ruta="/perfil" />
                </>
              )}

              {isAuthenticated && (userRole === 'administrador' || userRole === 'admin') && (
                <>
                  <BotonHome texto="Gestionar Servicios" ruta="/admin/servicios" />
                  <BotonHome texto="Gestionar Roles" ruta="/admin/roles" />
                  <BotonHome texto="Gestionar Secciones" ruta="/admin/categorias" />                
                  </>
              )}
            </div>
          </div>
        </section>



        {/* Sección de Servicios */}
        <section className="servicios-section">
          <h2 className="servicios-titulo">Nuestros Servicios</h2>

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
          
          {loading ? (
            <div className="loading">Cargando servicios...</div>
          ) : (
            <>
              {serviciosHabilitados.length > 0 ? (
                <div className="servicios-grid">
                  {serviciosHabilitados.map(servicio => (
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