import "./adminRoles.css";
import React, { useState, useEffect } from "react";
import Accesibilidad from "../components/accesibilidad";
import Header from "../components/header";
import Footer from "../components/footer";
import NotificationSystem, {
  showNotification,
} from "../components/NotificationSystem";

const token = localStorage.getItem("token");
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function AdminRoles() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModalRol, setShowModalRol] = useState(false);
  const [showModalServicios, setShowModalServicios] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [nuevoRol, setNuevoRol] = useState("");
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar roles primero, luego usuarios
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  useEffect(() => {
    filtrarUsuarios();
  }, [searchTerm, usuarios]);

  // Función helper para obtener nombre de rol (sin depender del estado)
  const obtenerNombreRolPorId = (id_rol, rolesArray) => {
    const rol = rolesArray.find((r) => r.id_rol === id_rol);
    return rol ? rol.nombre_rol : "Usuario";
  };

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);

      // Cargar roles PRIMERO
      const rolesData = await fetchRoles();

      // Luego cargar usuarios usando los roles ya cargados
      await fetchUsuarios(rolesData);

      // Cargar servicios en paralelo (no afecta a los roles)
      await fetchServicios();
    } catch (error) {
      console.error("Error al cargar datos iniciales:", error);
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  //  Modificar fetchRoles para retornar los datos
  const fetchRoles = async () => {
    try {
      const response = await fetch(`${API_URL}/Roles/ObtenerRoles`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al cargar roles");

      const data = await response.json();
      const rolesData = data.roles || [];

      setRoles(rolesData);
      return rolesData; // Retornar los datos
    } catch (error) {
      console.error("Error al cargar roles:", error);
      // Fallback a roles por defecto
      const defaultRoles = [
        { id_rol: 1, nombre_rol: "Usuario" },
        { id_rol: 3, nombre_rol: "Administrador" },
      ];
      setRoles(defaultRoles);
      return defaultRoles; // Retornar fallback
    }
  };

  // Modificar fetchUsuarios para recibir roles como parámetro
  const fetchUsuarios = async (rolesArray) => {
    try {
      const [usuariosRes, responsablesRes] = await Promise.all([
        fetch(`${API_URL}/Usuarios/ObtenerUsuarios`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/Responsables/ObtenerResponsables`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!usuariosRes.ok) throw new Error("Error al cargar usuarios");

      const usuariosData = await usuariosRes.json();
      const responsablesData = responsablesRes.ok
        ? await responsablesRes.json()
        : { responsables: [] };

      // Usar rolesArray pasado como parámetro
      const usuariosConServicios = usuariosData.usuarios.map((usuario) => {
        const serviciosDelUsuario = responsablesData.responsables
          .filter((r) => r.id_usuario === usuario.id_usuario)
          .map((r) => r.id_servicio);

        return {
          ...usuario,
          servicios_responsable: serviciosDelUsuario,
          rol_nombre: obtenerNombreRolPorId(usuario.id_rol, rolesArray), // Usar array directamente
        };
      });

      setUsuarios(usuariosConServicios);
      setUsuariosFiltrados(usuariosConServicios);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      setError("Error al cargar usuarios");
    }
  };

  const fetchServicios = async () => {
    try {
      const response = await fetch(`${API_URL}/Servicio/ListarServicios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al cargar servicios");

      const data = await response.json();
      setServicios(data || []);
    } catch (error) {
      console.error("Error al cargar servicios:", error);
      setError("Error al cargar servicios");
    }
  };

  // Mantener esta función para uso en otros lugares
  const obtenerNombreRol = (id_rol) => {
    return obtenerNombreRolPorId(id_rol, roles);
  };

  const filtrarUsuarios = () => {
    if (!searchTerm.trim()) {
      setUsuariosFiltrados(usuarios);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtrados = usuarios.filter((usuario) => {
      const nombreCompleto =
        `${usuario.nombre} ${usuario.apellido1} ${usuario.apellido2}`.toLowerCase();
      const correo = (usuario.correo || "").toLowerCase();
      const cargo = (usuario.cargo || "").toLowerCase();
      const municipalidad = (usuario.municipalidad || "").toLowerCase();

      return (
        nombreCompleto.includes(term) ||
        correo.includes(term) ||
        cargo.includes(term) ||
        municipalidad.includes(term)
      );
    });

    setUsuariosFiltrados(filtrados);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCambiarRol = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setNuevoRol(usuario.id_rol.toString());
    setShowModalRol(true);
  };

  const handleAsignarServicios = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setServiciosSeleccionados(usuario.servicios_responsable || []);
    setShowModalServicios(true);
  };

  const handleSubmitCambioRol = async (e) => {
    e.preventDefault();

    const nuevoRolInt = parseInt(nuevoRol);

    if (nuevoRolInt === usuarioSeleccionado.id_rol) {
      showNotification({
        type: "info",
        title: "Sin cambios",
        message: "El usuario ya tiene ese rol asignado",
      });
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/Usuarios/EditarUsuario/${usuarioSeleccionado.id_usuario}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nombre: usuarioSeleccionado.nombre,
            apellido1: usuarioSeleccionado.apellido1,
            apellido2: usuarioSeleccionado.apellido2,
            cargo: usuarioSeleccionado.cargo,
            municipalidad: usuarioSeleccionado.municipalidad,
            correo: usuarioSeleccionado.correo,
            num_tel: usuarioSeleccionado.num_tel,
            id_rol: nuevoRolInt,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar el rol");
      }

      const usuariosActualizados = usuarios.map((u) =>
        u.id_usuario === usuarioSeleccionado.id_usuario
          ? {
              ...u,
              id_rol: nuevoRolInt,
              rol_nombre: obtenerNombreRol(nuevoRolInt),
            }
          : u
      );
      setUsuarios(usuariosActualizados);

      showNotification({
        type: "success",
        title: "Rol Actualizado",
        message: "El rol del usuario ha sido actualizado correctamente",
      });

      setShowModalRol(false);
    } catch (error) {
      console.error("Error al cambiar rol:", error);
      showNotification({
        type: "error",
        title: "Error",
        message: "No se pudo actualizar el rol del usuario",
      });
    }
  };

  const handleSubmitServicios = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/Responsables/ObtenerResponsables`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      const responsabilidadesActuales = data.responsables.filter(
        (r) => r.id_usuario === usuarioSeleccionado.id_usuario
      );

      // Eliminar responsabilidades que ya no están seleccionadas
      for (const resp of responsabilidadesActuales) {
        if (!serviciosSeleccionados.includes(resp.id_servicio)) {
          await fetch(
            `${API_URL}/Responsables/EliminarResponsable/${resp.id_responsable}`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }
      }

      // Agregar nuevas responsabilidades
      const serviciosActuales = responsabilidadesActuales.map(
        (r) => r.id_servicio
      );
      for (const servicioId of serviciosSeleccionados) {
        if (!serviciosActuales.includes(servicioId)) {
          await fetch(`${API_URL}/Responsables/CrearResponsable`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              id_usuario: usuarioSeleccionado.id_usuario,
              id_servicio: servicioId,
            }),
          });
        }
      }

      const usuariosActualizados = usuarios.map((u) =>
        u.id_usuario === usuarioSeleccionado.id_usuario
          ? { ...u, servicios_responsable: serviciosSeleccionados }
          : u
      );
      setUsuarios(usuariosActualizados);

      showNotification({
        type: "success",
        title: "Servicios Asignados",
        message: "Los servicios han sido asignados correctamente al usuario",
      });

      setShowModalServicios(false);
    } catch (error) {
      console.error("Error al asignar servicios:", error);
      showNotification({
        type: "error",
        title: "Error",
        message: "No se pudieron asignar los servicios al usuario",
      });
    }
  };

  const toggleServicio = (servicioId) => {
    if (serviciosSeleccionados.includes(servicioId)) {
      setServiciosSeleccionados(
        serviciosSeleccionados.filter((id) => id !== servicioId)
      );
    } else {
      setServiciosSeleccionados([...serviciosSeleccionados, servicioId]);
    }
  };

  const getRolBadgeClass = (id_rol) => {
    switch (id_rol) {
      case 1:
        return "badge-usuario";
      case 3:
        return "badge-admin";
      default:
        return "badge-usuario";
    }
  };

  const getServiciosNombres = (serviciosIds) => {
    if (!serviciosIds || serviciosIds.length === 0) return "Ninguno";
    return serviciosIds
      .map((id) => servicios.find((s) => s.id_servicio === id)?.nombre_servicio)
      .filter(Boolean)
      .join(", ");
  };

  if (loading) {
    return (
      <div className="adminRoles-page">
        <Accesibilidad />
        <Header />
        <main className="adminRoles">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando datos...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="adminRoles-page">
        <Accesibilidad />
        <Header />
        <main className="adminRoles">
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={cargarDatosIniciales} className="btn-retry">
              Reintentar
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="adminRoles-page">
      <Accesibilidad />
      <Header />
      <NotificationSystem />

      <main className="adminRoles">
        <div className="admin-header">
          <h1>Administración de Roles y Responsabilidades</h1>
          <div className="roles-info">
            <span className="info-item">
              <strong>Total usuarios:</strong> {usuarios.length}
            </span>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="search-section">
          <div className="search-container">
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
              placeholder="Buscar por nombre, correo, cargo o municipalidad..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => setSearchTerm("")}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Leyenda */}
        <div className="roles-legend">
          <div className="legend-item">
            <span className="badge badge-usuario">Usuario</span>
            <span className="legend-text">Permisos básicos</span>
          </div>
          <div className="legend-item">
            <span className="badge badge-admin">Administrador</span>
            <span className="legend-text">Acceso total</span>
          </div>
          <div className="legend-item">
            <span className="badge badge-responsable">Responsable</span>
            <span className="legend-text">Asignado a servicios</span>
          </div>
        </div>

        {/* Tabla de Usuarios */}
        <div className="usuarios-table-container">
          <div className="table-responsive">
            <table className="usuarios-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre Completo</th>
                  <th>Correo</th>
                  <th>Cargo</th>
                  <th>Municipalidad</th>
                  <th>Rol</th>
                  <th>Servicios Asignados</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id_usuario}>
                    <td data-label="ID">{usuario.id_usuario}</td>
                    <td data-label="Nombre" className="td-nombre">
                      {usuario.nombre} {usuario.apellido1} {usuario.apellido2}
                    </td>
                    <td data-label="Correo">{usuario.correo}</td>
                    <td data-label="Cargo">{usuario.cargo}</td>
                    <td data-label="Municipalidad">{usuario.municipalidad}</td>
                    <td data-label="Rol">
                      <span
                        className={`badge ${getRolBadgeClass(usuario.id_rol)}`}
                      >
                        {usuario.rol_nombre}
                      </span>
                    </td>
                    <td data-label="Servicios">
                      <div className="servicios-badges">
                        {usuario.servicios_responsable &&
                        usuario.servicios_responsable.length > 0 ? (
                          <>
                            <span className="badge badge-responsable">
                              {usuario.servicios_responsable.length} servicio
                              {usuario.servicios_responsable.length !== 1
                                ? "s"
                                : ""}
                            </span>
                            <span className="servicios-list">
                              {getServiciosNombres(
                                usuario.servicios_responsable
                              )}
                            </span>
                          </>
                        ) : (
                          <span className="text-muted">Sin servicios</span>
                        )}
                      </div>
                    </td>
                    <td data-label="Acciones" className="td-acciones">
                      <button
                        className="btn-accion btn-cambiar-rol"
                        onClick={() => handleCambiarRol(usuario)}
                        title="Cambiar rol"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                        </svg>
                        Rol
                      </button>
                      <button
                        className="btn-accion btn-asignar-servicios"
                        onClick={() => handleAsignarServicios(usuario)}
                        title="Asignar servicios"
                      >
                        <svg
                          width="18"
                          height="18"
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
                        Servicios
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {usuariosFiltrados.length === 0 && (
            <div className="no-data">
              <p>No se encontraron usuarios con ese criterio de búsqueda</p>
            </div>
          )}
        </div>
      </main>

      {/* Modal para cambiar rol */}
      {showModalRol && usuarioSeleccionado && (
        <div className="modal-overlay" onClick={() => setShowModalRol(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Cambiar Rol de Usuario</h2>
              <button
                className="modal-close"
                onClick={() => setShowModalRol(false)}
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
              <div className="usuario-info">
                <h3>
                  {usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido1}{" "}
                  {usuarioSeleccionado.apellido2}
                </h3>
                <p className="info-detail">
                  <strong>Correo:</strong> {usuarioSeleccionado.correo}
                </p>
                <p className="info-detail">
                  <strong>Rol actual:</strong>
                  <span
                    className={`badge ${getRolBadgeClass(
                      usuarioSeleccionado.id_rol
                    )}`}
                  >
                    {usuarioSeleccionado.rol_nombre}
                  </span>
                </p>
              </div>

              <form onSubmit={handleSubmitCambioRol} className="modal-form">
                <div className="form-group">
                  <label htmlFor="nuevo-rol">Nuevo Rol *</label>
                  <select
                    id="nuevo-rol"
                    value={nuevoRol}
                    onChange={(e) => setNuevoRol(e.target.value)}
                    required
                  >
                    {roles.map((rol) => (
                      <option key={rol.id_rol} value={rol.id_rol}>
                        {rol.nombre_rol}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-cancelar"
                    onClick={() => setShowModalRol(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-guardar">
                    Actualizar Rol
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para asignar servicios */}
      {showModalServicios && usuarioSeleccionado && (
        <div
          className="modal-overlay"
          onClick={() => setShowModalServicios(false)}
        >
          <div
            className="modal-content modal-servicios"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Asignar Servicios como Responsable</h2>
              <button
                className="modal-close"
                onClick={() => setShowModalServicios(false)}
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
              <div className="usuario-info">
                <h3>
                  {usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido1}{" "}
                  {usuarioSeleccionado.apellido2}
                </h3>
                <p className="info-detail">
                  <strong>Correo:</strong> {usuarioSeleccionado.correo}
                </p>
                <p className="info-detail">
                  <strong>Cargo:</strong> {usuarioSeleccionado.cargo}
                </p>
              </div>

              <form onSubmit={handleSubmitServicios} className="modal-form">
                <div className="form-group">
                  <label className="section-label">
                    Servicios Asignados
                    <span className="selection-count">
                      ({serviciosSeleccionados.length} seleccionado
                      {serviciosSeleccionados.length !== 1 ? "s" : ""})
                    </span>
                  </label>
                  <p className="helper-text">
                    Selecciona los servicios de los cuales este usuario será
                    responsable
                  </p>

                  <div className="servicios-grid">
                    {servicios.map((servicio) => (
                      <div
                        key={servicio.id_servicio}
                        className={`servicio-checkbox ${
                          serviciosSeleccionados.includes(servicio.id_servicio)
                            ? "selected"
                            : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          id={`servicio-${servicio.id_servicio}`}
                          checked={serviciosSeleccionados.includes(
                            servicio.id_servicio
                          )}
                          onChange={() => toggleServicio(servicio.id_servicio)}
                        />
                        <label
                          htmlFor={`servicio-${servicio.id_servicio}`}
                          className="servicio-label"
                        >
                          <span className="servicio-nombre">
                            {servicio.nombre_servicio}
                          </span>
                          <div className="check-icon">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-cancelar"
                    onClick={() => setShowModalServicios(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-guardar">
                    Guardar Asignación
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default AdminRoles;
