import './misSolicitudes.css';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Accesibilidad from '../components/accesibilidad';
import Header from '../components/header';
import Footer from '../components/footer';
import NotificationSystem, { showNotification } from '../components/NotificationSystem'; 

const API_URL = process.env.REACT_APP_API_URL;

function MisSolicitudes() {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState([]);
  const [solicitudesFiltradas, setSolicitudesFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('todos');
  const [showModal, setShowModal] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
const [estados, setEstados] = useState([]);  // <-- Agregar esta línea
const [activeTab, setActiveTab] = useState('todas');

  useEffect(() => {
    fetchSolicitudes();
    fetchEstados(); 
  }, []);

  useEffect(() => {
    filtrarSolicitudes();

  }, [searchTerm, estadoFiltro, solicitudes]);
const fetchEstados = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/Estado/ObtenerEstados`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      const data = await response.json();
      setEstados(Array.isArray(data) ? data : []);
    }
  } catch (error) {
    console.error('Error al cargar estados:', error);
  }
};
const fetchSolicitudes = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No hay token de autenticación');
        navigate('/login');
        setLoading(false);
        return;
      }

      const payload = JSON.parse(atob(token.split('.')[1]));
      const id_usuario = payload.id_usuario;

      const response = await fetch(`${API_URL}/Solicitudes/ObtenerSolicitudesPorUsuario/${id_usuario}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error al cargar solicitudes: ${response.status}`);
      }

      const data = await response.json();
      const solicitudesArray = Array.isArray(data) ? data : [];
      
      // Obtener información de servicios asociados
      const responseSolServ = await fetch(`${API_URL}/SolicitudServicios/ObtenerSolicitudServicios`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      let solicitudServicios = [];
      if (responseSolServ.ok) {
        const dataSolServ = await responseSolServ.json();
        solicitudServicios = dataSolServ.relaciones || [];
      }

      // Normalizar datos con información completa
const solicitudesNormalizadas = solicitudesArray.map(sol => {
    const serviciosSolicitud = solicitudServicios
        .filter(ss => ss.id_solicitud === sol.id_solicitud)
        .map(ss => ss.nombre_servicio);

    //  CONSTRUIR OBJETO RESPONSABLE COMPLETO
    let responsableInfo = null;
    if (sol.aceptada && sol.responsable_nombre) {
        const nombreCompleto = [
            sol.responsable_nombre,
            sol.responsable_apellido1,
            sol.responsable_apellido2
        ]
            .filter(Boolean) // Elimina valores null/undefined
            .join(' ')
            .trim();

        responsableInfo = {
            nombre: nombreCompleto || 'No asignado',
            correo: sol.responsable_correo || 'Sin correo'
        };
    }

    return {
        id: sol.id_solicitud,
        detalles: sol.detalles_solicitud || 'Sin detalles',
        fecha: new Date(sol.fecha_solicitud).toLocaleDateString('es-CR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }),
        estado: sol.nombre_estado || 'Pendiente',
        aceptada: sol.aceptada === 1 || sol.aceptada === true,
        usuario: `${sol.nombre_usuario || ''} ${sol.apellido_usuario || ''}`.trim() || 'Usuario',
        servicios: serviciosSolicitud.length > 0 ? serviciosSolicitud : ['Sin servicios asignados'],
        responsable: responsableInfo
    };
});
      setSolicitudes(solicitudesNormalizadas);
      setLoading(false);
    } catch (error) {
      console.error('❌ Error al cargar solicitudes:', error);
      setLoading(false);
      setSolicitudes([]);
    }
  };

  const filtrarSolicitudes = () => {
    let filtradas = [...solicitudes];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtradas = filtradas.filter(sol =>
        sol.detalles.toLowerCase().includes(term) ||
        sol.id.toString().includes(term) ||
        sol.servicios.some(serv => serv.toLowerCase().includes(term))
      );
    }

    if (estadoFiltro !== 'todos') {
      filtradas = filtradas.filter(sol => 
        sol.estado.toLowerCase() === estadoFiltro.toLowerCase()
      );
    }

    setSolicitudesFiltradas(filtradas);
  };

  const getEstadoClass = (estado) => {
    const estadoLower = estado.toLowerCase();
    if (estadoLower.includes('pendiente')) return 'estado-pendiente';
    if (estadoLower.includes('proceso')) return 'estado-proceso';
    if (estadoLower.includes('completado') || estadoLower.includes('aprobado')) return 'estado-completado';
    if (estadoLower.includes('rechazado') || estadoLower.includes('cancelado')) return 'estado-rechazado';
    return 'estado-pendiente';
  };

  const getEstadoIcon = (estado) => {
    const estadoLower = estado.toLowerCase();
    if (estadoLower.includes('pendiente')) {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      );
    }
    if (estadoLower.includes('proceso')) {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
      );
    }
    if (estadoLower.includes('completado')) {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      );
    }
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    );
  };

  const handleVerDetalle = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setShowModal(true);
  };

const handleCancelar = async (id) => {
  if (window.confirm('¿Está seguro de cancelar esta solicitud?')) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/Solicitudes/EliminarSolicitud/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // REEMPLAZAR: alert('Solicitud cancelada exitosamente');
        showNotification({
          type: 'success',
          title: 'Solicitud Cancelada',
          message: 'La solicitud ha sido cancelada correctamente'
        });
        fetchSolicitudes();
      } else {
        showNotification({
          type: 'error',
          title: 'Error',
          message: 'No se pudo cancelar la solicitud'
        });
      }
    } catch (error) {
      console.error('Error al cancelar solicitud:', error);
      // REEMPLAZAR: alert('Error al cancelar la solicitud');
      showNotification({
        type: 'error',
        title: 'Error de conexión',
        message: 'No se pudo conectar con el servidor'
      });
    }
  }
};

  const contarPorEstado = (estado) => {
    return solicitudes.filter(sol => 
      sol.estado.toLowerCase() === estado.toLowerCase()
    ).length;
  };

  if (loading) {
    return (
      <div className="mis-solicitudes-page">
        <Accesibilidad />
        <Header />
        <NotificationSystem />
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Cargando solicitudes...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="mis-solicitudes-page">
      <Accesibilidad />
      <Header />
      <NotificationSystem />

      <main className="mis-solicitudes">
        {/* Header */}
        <div className="solicitudes-header">
          <h1>Mis Solicitudes</h1>
          <div className="header-stats">
            <div className="stat-badge">
              <strong>{solicitudes.length}</strong>
              <span>Total</span>
            </div>
            <div className="stat-badge">
              <strong>{contarPorEstado('Pendiente')}</strong>
              <span>Pendientes</span>
            </div>
            <div className="stat-badge">
              <strong>{contarPorEstado('En Proceso')}</strong>
              <span>En Proceso</span>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="filtros-section">
          <div className="filtros-row">
            <div className="filtro-group">
              <label>Buscar</label>
              <div className="search-input-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Buscar por ID, detalles o servicios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="filtro-group">
  <label>Filtrar por Estado</label>
  <select
    className="filtro-select"
    value={estadoFiltro}
    onChange={(e) => setEstadoFiltro(e.target.value)}
  >
    <option value="todos">Todos los Estados</option>
    {estados.map(estado => (
      <option key={estado.id_estado} value={estado.nombre_estado.toLowerCase()}>
        {estado.nombre_estado}
      </option>
    ))}
  </select>
</div>
          </div>
        </div>

        {/* Grid de Solicitudes */}
        {solicitudesFiltradas.length > 0 ? (
          <div className="solicitudes-grid">
            {solicitudesFiltradas.map(solicitud => (
              <div key={solicitud.id} className="solicitud-card">
                <div className="card-header">
                  <div className="card-id">Solicitud #{solicitud.id}</div>
                  <div className="card-fecha">{solicitud.fecha}</div>
                </div>

                <div className="card-body">
                  <div className={`estado-badge ${getEstadoClass(solicitud.estado)}`}>
                    {getEstadoIcon(solicitud.estado)}
                    {solicitud.estado}
                  </div>

{/* Badge de aceptación */}
{solicitud.aceptada ? (
  <>
    <div className="aceptacion-badge aceptada">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      Aceptada por Responsable
    </div>
    
    {/* NUEVO: Mostrar correo del responsable */}
    {solicitud.responsable && (
      <div className="info-item responsable-info">
        <div className="info-label">Responsable Asignado</div>
        <div className="info-value">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display: 'inline', marginRight: '6px'}}>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          {solicitud.responsable.nombre}
        </div>
        <div className="info-value" style={{fontSize: '0.85rem', color: '#CEAC65', marginTop: '4px'}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display: 'inline', marginRight: '6px'}}>
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          {solicitud.responsable.correo}
        </div>
      </div>
    )}
  </>
) : (
  <div className="aceptacion-badge sin-aceptar">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
    Pendiente de Aceptación
  </div>
)}

                  <div className="info-item">
                    <div className="info-label">Detalles de la Solicitud</div>
                    <div className="info-value">
                      {solicitud.detalles.length > 100
                        ? `${solicitud.detalles.substring(0, 100)}...`
                        : solicitud.detalles}
                    </div>
                  </div>

                  {solicitud.servicios.length > 0 && (
                    <div className="info-item">
                      <div className="info-label">Servicios Solicitados</div>
                      <div className="servicios-list">
                        {solicitud.servicios.map((servicio, index) => (
                          <div key={index} className="servicio-tag">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                              <line x1="8" y1="21" x2="16" y2="21"/>
                              <line x1="12" y1="17" x2="12" y2="21"/>
                            </svg>
                            {servicio}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="card-actions">
                  <button 
                    className="btn-ver-detalle"
                    onClick={() => handleVerDetalle(solicitud)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    Ver Detalle
                  </button>
                  
                  {solicitud.estado.toLowerCase() === 'pendiente' && !solicitud.aceptada && (
                    <button 
                      className="btn-cancelar"
                      onClick={() => handleCancelar(solicitud.id)}
                      title="Cancelar solicitud"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <h3>No hay solicitudes</h3>
            <p>
              {searchTerm || estadoFiltro !== 'todos'
                ? 'No se encontraron solicitudes con los filtros aplicados'
                : 'Aún no has realizado ninguna solicitud'}
            </p>
            {!searchTerm && estadoFiltro === 'todos' && (
              <button 
                className="btn-nueva-solicitud"
                onClick={() => navigate('/solicitar')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Nueva Solicitud
              </button>
            )}
          </div>
        )}
      </main>

      {/* Modal de Detalle */}
      {showModal && solicitudSeleccionada && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalle de Solicitud #{solicitudSeleccionada.id}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="detalle-section">
                <div className="detalle-grid">
                  <div className="detalle-item">
                    <div className="detalle-label">ID de Solicitud</div>
                    <div className="detalle-value">#{solicitudSeleccionada.id}</div>
                  </div>

                  <div className="detalle-item">
                    <div className="detalle-label">Fecha de Solicitud</div>
                    <div className="detalle-value">{solicitudSeleccionada.fecha}</div>
                  </div>

                  <div className="detalle-item">
                    <div className="detalle-label">Estado Actual</div>
                    <div className={`estado-badge ${getEstadoClass(solicitudSeleccionada.estado)}`}>
                      {getEstadoIcon(solicitudSeleccionada.estado)}
                      {solicitudSeleccionada.estado}
                    </div>
                  </div>

<div className="detalle-item">
  <div className="detalle-label">Estado de Aceptación</div>
  {solicitudSeleccionada.aceptada ? (
    <div className="aceptacion-badge aceptada">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      Aceptada
    </div>
  ) : (
    <div className="aceptacion-badge sin-aceptar">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      Sin Aceptar
    </div>
  )}
</div>

{/* NUEVO: Sección de información del responsable */}
{solicitudSeleccionada.aceptada && solicitudSeleccionada.responsable && (
  <>
    <div className="detalle-item">
      <div className="detalle-label">Responsable Asignado</div>
      <div className="detalle-value">{solicitudSeleccionada.responsable.nombre}</div>
    </div>
    
    <div className="detalle-item">
      <div className="detalle-label">Correo del Responsable</div>
      <div className="detalle-value">
        <a href={`mailto:${solicitudSeleccionada.responsable.correo}`} style={{color: '#CEAC65', textDecoration: 'none'}}>
          {solicitudSeleccionada.responsable.correo}
        </a>
      </div>
    </div>
  </>
)}

                  <div className="detalle-item">
                    <div className="detalle-label">Solicitante</div>
                    <div className="detalle-value">{solicitudSeleccionada.usuario}</div>
                  </div>
                </div>
              </div>

              <div className="detalle-section">
                <h3>Detalles de la Solicitud</h3>
                <div className="detalles-texto">
                  {solicitudSeleccionada.detalles}
                </div>
              </div>

              {solicitudSeleccionada.servicios.length > 0 && (
                <div className="detalle-section">
                  <h3>Servicios Solicitados</h3>
                  <div className="servicios-list">
                    {solicitudSeleccionada.servicios.map((servicio, index) => (
                      <div key={index} className="servicio-tag">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                          <line x1="8" y1="21" x2="16" y2="21"/>
                          <line x1="12" y1="17" x2="12" y2="21"/>
                        </svg>
                        {servicio}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="detalle-section">
                <h3>Historial de Cambios</h3>
                <div className="timeline">
                  <div className="timeline-item">
                    <div className="timeline-content">
                      <div className="timeline-date">{solicitudSeleccionada.fecha}</div>
                      <div className="timeline-text">Solicitud creada</div>
                    </div>
                  </div>
                  {solicitudSeleccionada.aceptada && (
                    <div className="timeline-item">
                      <div className="timeline-content">
                        <div className="timeline-date">Fecha de aceptación</div>
                        <div className="timeline-text">Solicitud aceptada por el responsable</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default MisSolicitudes;