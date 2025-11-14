import "./solicitudesResponsable.css";
import React, { useState, useEffect } from "react";
import Accesibilidad from "../components/accesibilidad";
import Header from "../components/header";
import Footer from "../components/footer";
import NotificationSystem, {
  showNotification,
} from "../components/NotificationSystem";

const API_URL = process.env.REACT_APP_API_URL;

function SolicitudesResponsable() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [solicitudesFiltradas, setSolicitudesFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("sin-aceptar");
  const [searchTerm, setSearchTerm] = useState("");
  const [prioridadFiltro, setPrioridadFiltro] = useState("todas");
  const [servicioFiltro, setServicioFiltro] = useState("todos");
  const [showModal, setShowModal] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [usuarioInfo, setUsuarioInfo] = useState(null);
  const [misServicios, setMisServicios] = useState([]);
  const [misServiciosIds, setMisServiciosIds] = useState([]);
  const [estados, setEstados] = useState([]);
  const [estadosFiltro, setEstadosFiltro] = useState([]); 
  const [aceptacionFiltro, setAceptacionFiltro] = useState("todas");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({
  destinatario: '',
  asunto: '',
  mensaje: ''
});

  useEffect(() => {
    fetchUsuarioInfoYServicios();
    fetchEstados();
    fetchEstadosFiltro(); 
  }, []);

  useEffect(() => {
    if (misServiciosIds.length > 0) {
      fetchSolicitudes();
    }
  }, [misServiciosIds]);

  useEffect(() => {
  filtrarSolicitudes();
}, [activeTab, searchTerm, prioridadFiltro, servicioFiltro, aceptacionFiltro, solicitudes]); 

  const fetchEstados = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/Estado/ObtenerEstados`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        // El backend devuelve el array directamente, no dentro de un objeto
        setEstados(Array.isArray(data) ? data : []);
        console.log("Estados cargados:", data); // Para debugging
      }
    } catch (error) {
      console.error("Error al cargar estados:", error);
    }
  };

const fetchEstadosFiltro = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/Estado/ObtenerEstados`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();
      setEstadosFiltro(Array.isArray(data) ? data : []);
    }
  } catch (error) {
    console.error("Error al cargar estados para filtro:", error);
  }
};

  const fetchUsuarioInfoYServicios = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const payload = JSON.parse(atob(token.split(".")[1]));

      if (!payload.es_responsable) {
        showNotification({
          type: "error",
          title: "Acceso Denegado",
          message: "No tienes permisos de responsable",
        });
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
        return;
      }

      setUsuarioInfo({
        nombre: payload.nombre || "Usuario",
        id_usuario: payload.id_usuario,
        es_responsable: payload.es_responsable,
        correo: payload.correo,
      });

      const response = await fetch(
        `${API_URL}/Responsables/ObtenerResponsables`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const serviciosUsuario = data.responsables.filter(
          (r) => r.id_usuario === payload.id_usuario
        );

        const nombresServicios = serviciosUsuario.map((r) => r.nombre_servicio);
        const idsServicios = serviciosUsuario.map((r) => r.id_servicio);

        setMisServicios(nombresServicios);
        setMisServiciosIds(idsServicios);

        if (nombresServicios.length === 0) {
          showNotification({
            type: "warning",
            title: "Sin Servicios Asignados",
            message: "No tienes servicios asignados como responsable",
          });
        }
      }
    } catch (error) {
      console.error("Error al obtener info del usuario:", error);
      showNotification({
        type: "error",
        title: "Error",
        message: "No se pudo cargar la información del usuario",
      });
    }
  };

  const fetchSolicitudes = async () => {
    try {
      const token = localStorage.getItem("token");

      const responseSolicitudes = await fetch(
        `${API_URL}/Solicitudes/ObtenerSolicitudes`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!responseSolicitudes.ok) {
        throw new Error("Error al cargar solicitudes");
      }

      const dataSolicitudes = await responseSolicitudes.json();

      const responseSolServ = await fetch(
        `${API_URL}/SolicitudServicios/ObtenerSolicitudServicios`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      let solicitudServicios = [];
      if (responseSolServ.ok) {
        const dataSolServ = await responseSolServ.json();
        solicitudServicios = dataSolServ.relaciones || [];
      }

      const responseServicios = await fetch(
        `${API_URL}/Servicio/ListarServicios`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      let serviciosInfo = [];
      if (responseServicios.ok) {
        const dataServicios = await responseServicios.json();
        serviciosInfo = dataServicios;
      }

      // ✅ NUEVO: Obtener información completa de todos los usuarios
      const responseUsuarios = await fetch(
        `${API_URL}/Usuarios/ObtenerUsuarios`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      let usuariosInfo = [];
      if (responseUsuarios.ok) {
        const dataUsuarios = await responseUsuarios.json();
        usuariosInfo = dataUsuarios.usuarios || [];
      }

      const solicitudesConServicios = dataSolicitudes.solicitudes.map((sol) => {
        const serviciosSolicitud = solicitudServicios.filter(
          (ss) => ss.id_solicitud === sol.id_solicitud
        );

        const serviciosDetalle = serviciosSolicitud.map((ss) => {
          const servicioInfo = serviciosInfo.find(
            (s) => s.id_servicio === ss.id_servicio
          );
          return {
            id: ss.id_servicio,
            nombre:
              ss.nombre_servicio ||
              servicioInfo?.nombre_servicio ||
              "Servicio desconocido",
          };
        });

        // ✅ NUEVO: Buscar información completa del usuario solicitante
        const usuarioCompleto = usuariosInfo.find(
          (u) => u.id_usuario === sol.id_usuario
        );

        return {
          ...sol,
          servicios: serviciosDetalle.map((s) => s.nombre),
          serviciosIds: serviciosDetalle.map((s) => s.id),
          usuarioCompleto: usuarioCompleto || null, // ← Agregar info completa del usuario
        };
      });

      const solicitudesFiltradas = solicitudesConServicios.filter((sol) => {
        const tieneServiciosAsignados = sol.serviciosIds.some((idServicio) =>
          misServiciosIds.includes(idServicio)
        );
        return tieneServiciosAsignados;
      });

      const solicitudesNormalizadas = solicitudesFiltradas.map((sol) => ({
        id: sol.id_solicitud,
        detalles: sol.detalles_solicitud,
        fecha: sol.fecha_solicitud,
        estado: sol.nombre_estado || "Pendiente",
        id_estado: sol.id_estado,
        aceptada: sol.aceptada || false,
        prioridad: calcularPrioridad(sol.fecha_solicitud),
        usuario: {
          // ✅ CORREGIDO: Usar datos reales del usuario
          nombre: sol.usuarioCompleto
            ? `${sol.usuarioCompleto.nombre} ${sol.usuarioCompleto.apellido1} ${sol.usuarioCompleto.apellido2}`
            : `${sol.nombre_usuario} ${sol.apellido_usuario}`,
          cargo: sol.usuarioCompleto?.cargo || "Sin especificar",
          municipalidad:
            sol.usuarioCompleto?.municipalidad || "Sin especificar",
          correo: sol.usuarioCompleto?.correo || "Sin especificar",
          telefono: sol.usuarioCompleto?.num_tel || "Sin especificar",
        },
        servicios: sol.servicios,
        serviciosIds: sol.serviciosIds,
        diasDesdeCreacion: calcularDiasDesdeCreacion(sol.fecha_solicitud),
      }));

      setSolicitudes(solicitudesNormalizadas);
      setLoading(false);

      if (solicitudesNormalizadas.length === 0) {
        showNotification({
          type: "info",
          title: "Sin Solicitudes",
          message: "No hay solicitudes para los servicios que gestionas",
        });
      }
    } catch (error) {
      console.error("Error al cargar solicitudes:", error);
      showNotification({
        type: "error",
        title: "Error",
        message: "No se pudieron cargar las solicitudes",
      });
      setLoading(false);
    }
  };

  const calcularPrioridad = (fecha) => {
    const dias = calcularDiasDesdeCreacion(fecha);
    if (dias >= 10) return "Alta";
    if (dias >= 5) return "Media";
    return "Baja";
  };

  const calcularDiasDesdeCreacion = (fecha) => {
    const fechaSolicitud = new Date(fecha);
    const hoy = new Date();
    const diferencia = hoy - fechaSolicitud;
    return Math.floor(diferencia / (1000 * 60 * 60 * 24));
  };

  const filtrarSolicitudes = () => {
  let filtradas = [...solicitudes];

  // Filtrar por tab (estado)
  if (activeTab !== "todas") {
    const estadoSeleccionado = estadosFiltro.find(
      e => e.nombre_estado.toLowerCase().replace(/\s+/g, '-') === activeTab
    );
    
    if (estadoSeleccionado) {
      filtradas = filtradas.filter(sol => sol.id_estado === estadoSeleccionado.id_estado);
    }
  }

  // Filtro de búsqueda
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    filtradas = filtradas.filter(
      (sol) =>
        sol.detalles.toLowerCase().includes(term) ||
        sol.id.toString().includes(term) ||
        sol.usuario.nombre.toLowerCase().includes(term)
    );
  }

  // Filtro de prioridad
  if (prioridadFiltro !== "todas") {
    filtradas = filtradas.filter(
      (sol) => sol.prioridad.toLowerCase() === prioridadFiltro.toLowerCase()
    );
  }

  // Filtro de servicio
  if (servicioFiltro !== "todos") {
    filtradas = filtradas.filter((sol) =>
      sol.servicios.includes(servicioFiltro)
    );
  }

  // ← AGREGAR ESTE BLOQUE AQUÍ
  // Filtro de aceptación
  if (aceptacionFiltro === "aceptadas") {
    filtradas = filtradas.filter((sol) => sol.aceptada === true);
  } else if (aceptacionFiltro === "sin-aceptar") {
    filtradas = filtradas.filter((sol) => sol.aceptada === false);
  }
  // Si es "todas", no se filtra

  setSolicitudesFiltradas(filtradas);
};

  const handleAceptarSolicitud = async (solicitud) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/Solicitudes/AceptarSolicitud/${solicitud.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        showNotification({
          type: "success",
          title: "✅ Solicitud Aceptada",
          message: `Has aceptado la solicitud #${solicitud.id}. Ahora puedes gestionarla.`,
        });

        fetchSolicitudes();
      } else {
        throw new Error("Error al aceptar solicitud");
      }
    } catch (error) {
      console.error("Error al aceptar solicitud:", error);
      showNotification({
        type: "error",
        title: "Error",
        message: "No se pudo aceptar la solicitud. Intenta de nuevo.",
      });
    }
  };

  const handleCambiarEstado = async (solicitud, nuevoEstadoId) => {
    try {
      const token = localStorage.getItem("token");

      // Primero obtener la solicitud completa para preservar el id_usuario original
      const responseGet = await fetch(
        `${API_URL}/Solicitudes/ObtenerSolicitud/${solicitud.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!responseGet.ok) {
        throw new Error("Error al obtener solicitud");
      }

      const solicitudCompleta = await responseGet.json();

      // Actualizar solo el estado, manteniendo el usuario original
      const response = await fetch(
        `${API_URL}/Solicitudes/EditarSolicitud/${solicitud.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id_usuario: solicitudCompleta.id_usuario, // ← Usuario ORIGINAL de la solicitud
            detalles_solicitud: solicitud.detalles,
            id_estado: nuevoEstadoId,
            aceptada: solicitud.aceptada,
          }),
        }
      );

      if (response.ok) {
        const estadoNombre =
          estados.find((e) => e.id_estado === nuevoEstadoId)?.nombre_estado ||
          "Desconocido";

        showNotification({
          type: "success",
          title: "Estado Actualizado",
          message: `La solicitud #${solicitud.id} ahora está en estado: ${estadoNombre}`,
        });

        fetchSolicitudes();
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      showNotification({
        type: "error",
        title: "Error",
        message: "No se pudo cambiar el estado de la solicitud.",
      });
    }
  };

  const handleVerDetalle = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setShowModal(true);
  };

const contarPorTab = (tab) => {
  if (tab === "todas") {
    return solicitudes.length;
  }
  
  // Buscar el estado correspondiente al tab
  const estadoSeleccionado = estadosFiltro.find(
    e => e.nombre_estado.toLowerCase().replace(/\s+/g, '-') === tab
  );
  
  if (estadoSeleccionado) {
    return solicitudes.filter(sol => sol.id_estado === estadoSeleccionado.id_estado).length;
  }
  
  // Si no encuentra el estado, devolver 0
  return 0;
};

  const formatFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString("es-CR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const handleAbrirEmail = (solicitud) => {
  setEmailForm({
    destinatario: solicitud.usuario.correo,
    asunto: `Re: Solicitud #${solicitud.id} - ${solicitud.servicios[0] || 'Servicios solicitados'}`,
    mensaje: ''
  });
  setSolicitudSeleccionada(solicitud);
  setShowEmailModal(true);
};

const handleEmailChange = (e) => {
  const { name, value } = e.target;
  setEmailForm(prev => ({
    ...prev,
    [name]: value
  }));
};

const handleEnviarEmail = async (e) => {
  e.preventDefault();
  
  if (!emailForm.mensaje.trim()) {
    showNotification({
      type: 'warning',
      title: 'Campo requerido',
      message: 'Debes escribir un mensaje'
    });
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    const response = await fetch(`${API_URL}/Email/manual`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        to: emailForm.destinatario,
        subject: emailForm.asunto,
        message: emailForm.mensaje,
        senderName: payload.nombre || 'IFAM Informa'
      })
    });

    if (response.ok) {
      showNotification({
        type: 'success',
        title: '✉️ Correo Enviado',
        message: `Tu respuesta ha sido enviada a ${solicitudSeleccionada.usuario.nombre}`
      });
      
      setShowEmailModal(false);
      setEmailForm({ destinatario: '', asunto: '', mensaje: '' });
    } else {
      throw new Error('Error al enviar correo');
    }
  } catch (error) {
    console.error('Error al enviar correo:', error);
    showNotification({
      type: 'error',
      title: 'Error',
      message: 'No se pudo enviar el correo. Intenta de nuevo.'
    });
  }
};


  if (loading) {
    
    return (
      <div className="responsable-page">
        <Accesibilidad />
        <Header />
        <NotificationSystem />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando solicitudes...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="responsable-page">
      <Accesibilidad />
      <Header />
      <NotificationSystem />

      <main className="responsable-container">
        <div className="responsable-header">
          <div className="header-content">
            <div className="header-info">
              <h1>Panel de Responsable</h1>
              <p className="header-subtitle">
                Bienvenido, {usuarioInfo?.nombre}
              </p>
              <div className="servicios-responsable">
                {misServicios.length > 0 ? (
                  misServicios.map((servicio, index) => (
                    <div key={index} className="servicio-badge">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect
                          x="2"
                          y="3"
                          width="20"
                          height="14"
                          rx="2"
                          ry="2"
                        />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                      {servicio}
                    </div>
                  ))
                ) : (
                  <div className="servicio-badge">
                    <span style={{ color: "#666" }}>
                      Sin servicios asignados
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="header-stats">
  <div className="stat-card">
    <span className="stat-number">
      {solicitudes.filter(sol => !sol.aceptada).length}
    </span>
    <span className="stat-label">Sin Aceptar</span>
  </div>
  <div className="stat-card">
    <span className="stat-number">
      {solicitudes.filter(sol => sol.aceptada).length}
    </span>
    <span className="stat-label">Aceptadas</span>
  </div>
  <div className="stat-card">
    <span className="stat-number">
      {solicitudes.length}
    </span>
    <span className="stat-label">Total</span>
  </div>
</div>
          </div>
        </div>

        <div className="tabs-section">
  <div className="tabs-container">
    {/* Tab "Todas" siempre visible */}
    <button
      className={`tab-btn ${activeTab === "todas" ? "active" : ""}`}
      onClick={() => setActiveTab("todas")}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
      Todas
      <span className="tab-count">{solicitudes.length}</span>
    </button>

    {/* Tabs dinámicos desde el backend */}
    {estadosFiltro.map((estado) => {
      const tabKey = estado.nombre_estado.toLowerCase().replace(/\s+/g, '-');
      const count = contarPorTab(tabKey);
      
      // Mapeo de íconos según el nombre del estado
      const getIconForEstado = (nombreEstado) => {
        const nombre = nombreEstado.toLowerCase();
        
        if (nombre.includes('pendiente') || nombre.includes('sin')) {
          return (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          );
        }
        
        if (nombre.includes('proceso') || nombre.includes('progreso')) {
          return (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          );
        }
        
        if (nombre.includes('completa') || nombre.includes('finaliza') || nombre.includes('aproba')) {
          return (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          );
        }
        
        if (nombre.includes('rechaza') || nombre.includes('cancela')) {
          return (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          );
        }
        
        // Ícono por defecto
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        );
      };
      
      return (
        <button
          key={estado.id_estado}
          className={`tab-btn ${activeTab === tabKey ? "active" : ""}`}
          onClick={() => setActiveTab(tabKey)}
        >
          {getIconForEstado(estado.nombre_estado)}
          {estado.nombre_estado}
          <span className="tab-count">{count}</span>
        </button>
      );
    })}
  </div>
</div>

       <div className="filtros-section">
  <div className="filtros-grid" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
    {/* Búsqueda */}
    <div className="filtro-group">
      <label>Buscar</label>
      <div className="search-wrapper">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por ID, usuario, detalles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>

    {/* Filtro de Aceptación - NUEVO */}
    <div className="filtro-group">
      <label>Estado de Aceptación</label>
      <select
        className="filtro-select"
        value={aceptacionFiltro}
        onChange={(e) => setAceptacionFiltro(e.target.value)}
      >
        <option value="todas">Todas</option>
        <option value="aceptadas">✓ Aceptadas</option>
        <option value="sin-aceptar">⚠ Sin Aceptar</option>
      </select>
    </div>

    {/* Prioridad */}
    <div className="filtro-group">
      <label>Prioridad</label>
      <select
        className="filtro-select"
        value={prioridadFiltro}
        onChange={(e) => setPrioridadFiltro(e.target.value)}
      >
        <option value="todas">Todas</option>
        <option value="alta">Alta</option>
        <option value="media">Media</option>
        <option value="baja">Baja</option>
      </select>
    </div>

    {/* Servicio */}
    <div className="filtro-group">
      <label>Servicio</label>
      <select
        className="filtro-select"
        value={servicioFiltro}
        onChange={(e) => setServicioFiltro(e.target.value)}
      >
        <option value="todos">Todos</option>
        {misServicios.map((servicio, index) => (
          <option key={index} value={servicio}>
            {servicio}
          </option>
        ))}
      </select>
    </div>
  </div>
</div>

        {solicitudesFiltradas.length > 0 ? (
          <div className="solicitudes-lista">
            {solicitudesFiltradas.map((solicitud) => (
              <div
                key={solicitud.id}
                className={`solicitud-item ${
                  solicitud.prioridad.toLowerCase() === "alta"
                    ? "urgente"
                    : "normal"
                }`}
              >
                <div className="solicitud-header">
                  <div className="solicitud-meta">
                    <div className="solicitud-id">
                      Solicitud #{solicitud.id}
                    </div>
                    <div className="solicitud-fecha">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {formatFecha(solicitud.fecha)}
                    </div>
                    <div className="usuario-info">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      {solicitud.usuario.nombre}
                    </div>

                    {solicitud.aceptada ? (
                      <div className="aceptacion-badge aceptada">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Aceptada
                      </div>
                    ) : (
                      <div className="aceptacion-badge sin-aceptar">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        Sin Aceptar
                      </div>
                    )}

                    <div className="estado-badge">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                      {solicitud.estado}
                    </div>
                  </div>

                  <div
                    className={`prioridad-badge prioridad-${solicitud.prioridad.toLowerCase()}`}
                  >
                    {solicitud.prioridad}
                  </div>
                </div>

                <div className="solicitud-body">
                  <div className="servicios-solicitados">
                    {solicitud.servicios.map((servicio, index) => (
                      <div key={index} className="servicio-tag">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect
                            x="2"
                            y="3"
                            width="20"
                            height="14"
                            rx="2"
                            ry="2"
                          />
                          <line x1="8" y1="21" x2="16" y2="21" />
                          <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                        {servicio}
                      </div>
                    ))}
                  </div>

                  <div className="detalles-solicitud">
                    {solicitud.detalles.length > 200
                      ? `${solicitud.detalles.substring(0, 200)}...`
                      : solicitud.detalles}
                  </div>

                  <div className="solicitud-actions">
                    {!solicitud.aceptada ? (
                      <button
                        className="btn-aceptar"
                        onClick={() => handleAceptarSolicitud(solicitud)}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Aceptar Solicitud
                      </button>
                    ) : (
                      <div className="estado-selector-inline">
  <label>Cambiar Estado:</label>
  <select
    className="estado-select"
    value={solicitud.id_estado}
    onChange={(e) =>
      handleCambiarEstado(
        solicitud,
        parseInt(e.target.value)
      )
    }
  >
    {estados.map((estado) => (
      <option
        key={estado.id_estado}
        value={estado.id_estado}
      >
        {estado.nombre_estado}
      </option>
    ))}
  </select>
</div>
                    )}

                    <button
                      className="btn-ver-detalle"
                      onClick={() => handleVerDetalle(solicitud)}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      Ver Detalle
                    </button>
                    <button
  className="btn-responder"
  onClick={() => handleAbrirEmail(solicitud)}
  title="Responder por correo"
>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
  Responder
</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <svg
              className="empty-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3>No hay solicitudes</h3>
            <p>No se encontraron solicitudes con los filtros aplicados</p>
          </div>
        )}
        {/* Modal de Email */}
{showEmailModal && solicitudSeleccionada && (
  <div className="modal-overlay" onClick={() => setShowEmailModal(false)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h2>📧 Responder Solicitud #{solicitudSeleccionada.id}</h2>
        <button className="modal-close" onClick={() => setShowEmailModal(false)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div className="modal-body">
        <div className="modal-section">
          <h3>Información del Destinatario</h3>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Nombre</div>
              <div className="info-value">{solicitudSeleccionada.usuario.nombre}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Correo</div>
              <div className="info-value">{solicitudSeleccionada.usuario.correo}</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleEnviarEmail} className="email-form">
          <div className="form-group">
            <label htmlFor="email-destinatario">Para:</label>
            <input
              type="email"
              id="email-destinatario"
              name="destinatario"
              value={emailForm.destinatario}
              onChange={handleEmailChange}
              readOnly
              className="email-input readonly"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email-asunto">Asunto: *</label>
            <input
              type="text"
              id="email-asunto"
              name="asunto"
              value={emailForm.asunto}
              onChange={handleEmailChange}
              required
              className="email-input"
              placeholder="Asunto del correo..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="email-mensaje">Mensaje: *</label>
            <textarea
              id="email-mensaje"
              name="mensaje"
              value={emailForm.mensaje}
              onChange={handleEmailChange}
              required
              rows="10"
              className="email-textarea"
              placeholder="Escribe tu respuesta aquí..."
            />
            <div className="character-count">
              {emailForm.mensaje.length} caracteres
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-modal-cancelar" onClick={() => setShowEmailModal(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn-modal-enviar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13"/>
                <path d="M22 2L15 22L11 13L2 9L22 2z"/>
              </svg>
              Enviar Correo
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}
      </main>

      {showModal && solicitudSeleccionada && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalle de Solicitud #{solicitudSeleccionada.id}</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h3>Información General</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-label">ID de Solicitud</div>
                    <div className="info-value">
                      #{solicitudSeleccionada.id}
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Fecha</div>
                    <div className="info-value">
                      {formatFecha(solicitudSeleccionada.fecha)}
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Estado Actual</div>
                    <div className="info-value estado-badge">
                      {solicitudSeleccionada.estado}
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Estado de Aceptación</div>
                    {solicitudSeleccionada.aceptada ? (
                      <div className="aceptacion-badge aceptada">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Aceptada
                      </div>
                    ) : (
                      <div className="aceptacion-badge sin-aceptar">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        Sin Aceptar
                      </div>
                    )}
                  </div>
                  <div className="info-item">
                    <div className="info-label">Prioridad</div>
                    <div
                      className={`prioridad-badge prioridad-${solicitudSeleccionada.prioridad.toLowerCase()}`}
                    >
                      {solicitudSeleccionada.prioridad}
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Días desde creación</div>
                    <div className="info-value">
                      {solicitudSeleccionada.diasDesdeCreacion} días
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3>Información del Solicitante</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-label">Nombre</div>
                    <div className="info-value">
                      {solicitudSeleccionada.usuario.nombre}
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Cargo</div>
                    <div className="info-value">
                      {solicitudSeleccionada.usuario.cargo}
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Municipalidad</div>
                    <div className="info-value">
                      {solicitudSeleccionada.usuario.municipalidad}
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Correo</div>
                    <div className="info-value">
                      {solicitudSeleccionada.usuario.correo}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3>Servicios Solicitados</h3>
                <div className="servicios-solicitados">
                  {solicitudSeleccionada.servicios.map((servicio, index) => (
                    <div key={index} className="servicio-tag">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect
                          x="2"
                          y="3"
                          width="20"
                          height="14"
                          rx="2"
                          ry="2"
                        />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                      {servicio}
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-section">
                <h3>Detalles de la Solicitud</h3>
                <div className="detalles-solicitud">
                  {solicitudSeleccionada.detalles}
                </div>
              </div>

              {solicitudSeleccionada.aceptada && (
                <div className="modal-section">
                  <h3>Gestión de Estado</h3>
                  <div className="estado-selector-modal">
                    <label>Cambiar estado de la solicitud:</label>
                    <select
                      className="estado-select-modal"
                      value={solicitudSeleccionada.id_estado}
                      onChange={(e) =>
                        handleCambiarEstado(
                          solicitudSeleccionada,
                          parseInt(e.target.value)
                        )
                      }
                    >
                      {estados.map((estado) => (
                        <option key={estado.id_estado} value={estado.id_estado}>
                          {estado.nombre_estado}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="modal-actions">
                {!solicitudSeleccionada.aceptada ? (
                  <>
                    <button
                      className="btn-modal-aceptar"
                      onClick={() => {
                        handleAceptarSolicitud(solicitudSeleccionada);
                        setShowModal(false);
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Aceptar Solicitud
                    </button>
                    <button
                      className="btn-modal-cancelar"
                      onClick={() => setShowModal(false)}
                    >
                      Cerrar
                    </button>
                  </>
                ) : (
                  <button
                    className="btn-modal-cancelar"
                    onClick={() => setShowModal(false)}
                  >
                    Cerrar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default SolicitudesResponsable;
