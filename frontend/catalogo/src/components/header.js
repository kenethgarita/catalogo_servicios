import React, { useState, useEffect } from 'react';
import './header.css';

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isResponsable, setIsResponsable] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

// header.js - Función checkAuth mejorada
// Reemplazar la función checkAuth existente con esta:

const checkAuth = () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    // Decodificar el token JWT
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // ✅ NUEVO: Verificar si el token está expirado
    const currentTime = Date.now() / 1000;
    if (payload.exp && payload.exp < currentTime) {
      console.log('Token expirado, cerrando sesión...');
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUserRole(null);
      setIsResponsable(false);
      
      // Si está en una ruta protegida, redirigir al login
      const protectedRoutes = [
        '/mis-solicitudes', 
        '/admin/servicios', 
        '/admin/roles', 
        '/admin/categorias',
        '/responsable/solicitudes',
        '/perfil'
      ];
      
      if (protectedRoutes.some(route => window.location.pathname.includes(route))) {
        window.location.href = '/login';
      }
      return;
    }
    
    // Obtener rol e información de responsable
    const rol = payload.rol?.toLowerCase() || '';
    const esResponsable = payload.es_responsable === true || payload.es_responsable === 1;
    
    setUserRole(rol);
    setIsResponsable(esResponsable);
    setIsAuthenticated(true);
  } catch (error) {
    console.error('Error al verificar autenticación:', error);
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserRole(null);
    setIsResponsable(false);
  }
};

// ✅ NUEVO: Agregar verificación periódica del token
useEffect(() => {
  checkAuth();
  
  // Verificar el token cada 5 minutos
  const interval = setInterval(() => {
    checkAuth();
  }, 5 * 60 * 1000);
  
  return () => clearInterval(interval);
}, []);

  const toggleMenu = () => {
    if (showMenu) {
      // Iniciar animación de cierre
      setIsClosing(true);
      setTimeout(() => {
        setShowMenu(false);
        setIsClosing(false);
      }, 300);
    } else {
      setShowMenu(true);
      setIsClosing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showMenu) {
        toggleMenu();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showMenu]);

  // Verificar si es admin
  const isAdmin = userRole === 'administrador' || userRole === 'admin';

  return (
    <>
      <header className="header">
        <div className="header-left">
          <img src="https://www.ifam.go.cr/FrontEnd/assets/img/header.png" alt="Logo IFAM" className="logo" />
          <div className="titles">
          </div>
        </div>

        <div className="header-right">
          {/* Botón hamburguesa con transformación a X */}
          <button 
            className={`menu-toggle ${showMenu ? 'active' : ''}`} 
            onClick={toggleMenu}
            aria-label="Menú"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </header>

      {/* Sidebar menu */}
      {(showMenu || isClosing) && (
        <>
          <div 
            className={`sidebar-overlay ${isClosing ? 'closing' : ''}`} 
            onClick={toggleMenu}
          ></div>
          <aside className={`sidebar ${isClosing ? 'closing' : ''}`}>
            <nav>
              <ul>
                <li><a href="/" onClick={toggleMenu}>Inicio</a></li>
                
                {/* Opciones para usuarios autenticados */}
                {isAuthenticated && (
                  <>
                    <li><a href="/mis-solicitudes" onClick={toggleMenu}>Mis Solicitudes</a></li>
                    <li><a href="/solicitar" onClick={toggleMenu}>Solicitar Servicio</a></li>
                  </>
                )}
                
                {/* Opciones para Responsables y Administradores */}
                {isAuthenticated && (isResponsable || isAdmin) && (
                  <li><a href="/responsable/solicitudes" onClick={toggleMenu}>Solicitudes Asignadas</a></li>
                )}
                
                {/* Opciones solo para Administradores */}
                {isAuthenticated && isAdmin && (
                  <>
                    <li><a href="/admin/servicios" onClick={toggleMenu}>Gestionar Servicios</a></li>
                    <li><a href="/admin/roles" onClick={toggleMenu}>Gestionar Roles</a></li>
                    <li><a href="/admin/categorias" onClick={toggleMenu}>Gestionar Secciones</a></li>
                  </>
                )}
                
                {/* Opción de Login/Logout */}
                {!isAuthenticated ? (
                  <li><a href="/login" onClick={toggleMenu}>Iniciar Sesión</a></li>
                ) : (
                  <li>
                    <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                      Cerrar Sesión
                    </a>
                  </li>
                )}
              </ul>
            </nav>
          </aside>
        </>
      )}
    </>
  );
};

export default Header;