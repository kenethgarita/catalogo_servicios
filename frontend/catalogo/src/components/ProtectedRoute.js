// ProtectedRoute.js - Componente mejorado para proteger rutas
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [userRole, setUserRole] = useState(null);
  const [isResponsable, setIsResponsable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const token = localStorage.getItem('token');
      
      // Si no hay token, usuario no autenticado
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      // Verificar si el token no está expirado
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp && payload.exp < currentTime) {
        // Token expirado
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      
      // Obtener rol e información de responsable
      const rol = payload.rol?.toLowerCase() || '';
      const esResponsable = payload.es_responsable === true || payload.es_responsable === 1;
      
      setUserRole(rol);
      setIsResponsable(esResponsable);
      setIsAuthenticated(true);
      setLoading(false);
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      localStorage.removeItem('token'); // Limpiar token inválido
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  // Mostrar loader mientras verifica
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '20px',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #f0f0f0',
          borderTop: '4px solid #1d2d5a',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ 
          color: '#666', 
          fontFamily: 'IBM Plex Sans',
          fontSize: '1rem'
        }}>
          Verificando permisos...
        </p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // PRIMERA VERIFICACIÓN: Si no está autenticado, redirigir a login
  // Guardamos la ruta actual para redirigir después del login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // SEGUNDA VERIFICACIÓN: Verificar permisos según el rol requerido
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    // Verificar si tiene el rol requerido
    const hasRequiredRole = roles.some(role => {
      const normalizedRole = role.toLowerCase();
      
      // Admin tiene acceso a todo
      if (userRole === 'administrador' || userRole === 'admin') {
        return true;
      }
      
      // Verificar rol específico
      if (normalizedRole === userRole) {
        return true;
      }
      
      // Verificar si requiere ser responsable
      if (normalizedRole === 'responsable' && isResponsable) {
        return true;
      }
      
      return false;
    });

    if (!hasRequiredRole) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
          gap: '20px',
          padding: '20px',
          backgroundColor: '#f9fafb'
        }}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <h2 style={{ 
            color: '#1d2d5a', 
            fontFamily: 'IBM Plex Sans',
            fontSize: '1.8rem',
            margin: '0',
            textAlign: 'center'
          }}>
            Acceso Denegado
          </h2>
          <p style={{ 
            color: '#666', 
            fontFamily: 'IBM Plex Sans',
            textAlign: 'center',
            maxWidth: '500px',
            lineHeight: '1.6'
          }}>
            No tienes los permisos necesarios para acceder a esta página.
            {userRole && ` Tu rol actual: ${userRole}`}
          </p>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              padding: '12px 24px',
              backgroundColor: '#1d2d5a',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'IBM Plex Sans',
              marginTop: '20px',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0f1a35'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#1d2d5a'}
          >
            Volver al Inicio
          </button>
        </div>
      );
    }
  }

  // Usuario autenticado y con permisos correctos
  return children;
};

export default ProtectedRoute;