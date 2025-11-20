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

  const checkAuth = () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      const payload = JSON.parse(atob(token.split('.')[1]));
      
      const currentTime = Date.now() / 1000;
      if (payload.exp && payload.exp < currentTime) {
        console.log('Token expirado, cerrando sesión...');
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserRole(null);
        setIsResponsable(false);
        
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

  useEffect(() => {
    checkAuth();
    
    const interval = setInterval(() => {
      checkAuth();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const toggleMenu = () => {
    if (showMenu) {
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

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showMenu) {
        toggleMenu();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showMenu]);

  const isAdmin = userRole === 'administrador' || userRole === 'admin';

  const MenuItem = ({ href, icon, label, onClick }) => (
    <li>
      <a href={href} onClick={onClick} className="menu-link">
        {icon && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{icon}</svg>}
        <span>{label}</span>
      </a>
    </li>
  );

  return (
    <>
      <header className="header">
        <div className="header-left">
          <img src="https://www.ifam.go.cr/FrontEnd/assets/img/header.png" alt="Logo IFAM" className="logo" />
          <div className="titles">
          </div>
        </div>

        <div className="header-right">
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
                {/* SECCIÓN: GENERAL */}
                <li className="menu-section-header">
                  <span className="section-title">General</span>
                </li>
                <MenuItem href="/" label="Inicio" onClick={toggleMenu} />
                
                {isAuthenticated && (
                  <>
                    <MenuItem href="/mis-solicitudes" label="Mis Solicitudes" onClick={toggleMenu} />
                    <MenuItem href="/solicitar" label="Solicitar Servicio" onClick={toggleMenu} />
                    <MenuItem href="/perfil" label="Perfil" onClick={toggleMenu} />
                  </>
                )}

                {!isAuthenticated && (
                  <MenuItem href="/login" label="Iniciar Sesión" onClick={toggleMenu} />
                )}

                {/* SECCIÓN: RESPONSABLE */}
                {isAuthenticated && (isResponsable || isAdmin) && (
                  <>
                    <li className="menu-divider"></li>
                    <li className="menu-section-header">
                      <span className="section-title">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        Responsable
                      </span>
                    </li>
                    <MenuItem href="/responsable/solicitudes" label="Solicitudes Asignadas" onClick={toggleMenu} />
                  </>
                )}

                {/* SECCIÓN: ADMINISTRACIÓN */}
                {isAuthenticated && isAdmin && (
                  <>
                    <li className="menu-divider"></li>
                    <li className="menu-section-header">
                      <span className="section-title">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          <circle cx="12" cy="12" r="1"/>
                        </svg>
                        Administración
                      </span>
                    </li>
                    <MenuItem href="/admin/servicios" label="Gestionar Servicios" onClick={toggleMenu} />
                    <MenuItem href="/admin/roles" label="Gestionar Roles" onClick={toggleMenu} />
                    <MenuItem href="/admin/categorias" label="Gestionar Secciones" onClick={toggleMenu} />
                  </>
                )}

                {/* SECCIÓN: SEGURIDAD */}
                {isAuthenticated && (
                  <>
                    <li className="menu-divider"></li>
                    <li className="menu-section-header">
                      <span className="section-title">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                        Seguridad
                      </span>
                    </li>
                    <li>
                      <a 
                        href="#" 
                        onClick={(e) => { 
                          e.preventDefault(); 
                          handleLogout(); 
                        }}
                        className="menu-link logout-link"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                          <polyline points="16 17 21 12 16 7"/>
                          <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        <span>Cerrar Sesión</span>
                      </a>
                    </li>
                  </>
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