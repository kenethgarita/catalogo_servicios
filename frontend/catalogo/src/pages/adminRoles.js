import './adminRoles.css';
import React, { useState, useEffect } from 'react';
import Accesibilidad from '../components/accesibilidad';
import Header from '../components/header';
import Footer from '../components/footer';

function AdminRoles() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [nuevoRol, setNuevoRol] = useState('');

  const roles = [
    { id: 1, nombre: 'Usuario', descripcion: 'Permisos básicos de consulta' },
    { id: 2, nombre: 'Responsable', descripcion: 'Gestiona servicios de su área' },
    { id: 3, nombre: 'Administrador', descripcion: 'Acceso total al sistema' }
  ];

  useEffect(() => {
    fetchUsuarios();
  }, []);

  useEffect(() => {
    filtrarUsuarios();
  }, [searchTerm, usuarios]);

  const fetchUsuarios = async () => {
    try {
      // CONEXIÓN A BASE DE DATOS - Reemplaza con tu endpoint real
      /*
      const response = await fetch('/api/usuarios');
      const data = await response.json();
      setUsuarios(data);
      */

      // DATOS DE EJEMPLO (PLACEHOLDER)
      const usuariosPlaceholder = [
        {
          id_usuario: 1,
          nombre: 'Juan',
          apellido1: 'Pérez',
          apellido2: 'García',
          correo: 'juan.perez@ejemplo.com',
          cargo: 'Desarrollador',
          municipalidad: 'San José',
          rol: 1, // 1=Usuario, 2=Responsable, 3=Administrador
          rol_nombre: 'Usuario'
        },
        {
          id_usuario: 2,
          nombre: 'María',
          apellido1: 'González',
          apellido2: 'Rodríguez',
          correo: 'maria.gonzalez@ejemplo.com',
          cargo: 'Jefa de TI',
          municipalidad: 'Heredia',
          rol: 2,
          rol_nombre: 'Responsable'
        },
        {
          id_usuario: 3,
          nombre: 'Carlos',
          apellido1: 'Martínez',
          apellido2: 'López',
          correo: 'carlos.martinez@ejemplo.com',
          cargo: 'Director',
          municipalidad: 'Cartago',
          rol: 3,
          rol_nombre: 'Administrador'
        },
        {
          id_usuario: 4,
          nombre: 'Ana',
          apellido1: 'Ramírez',
          apellido2: 'Castro',
          correo: 'ana.ramirez@ejemplo.com',
          cargo: 'Analista',
          municipalidad: 'Alajuela',
          rol: 1,
          rol_nombre: 'Usuario'
        },
        {
          id_usuario: 5,
          nombre: 'Luis',
          apellido1: 'Hernández',
          apellido2: 'Mora',
          correo: 'luis.hernandez@ejemplo.com',
          cargo: 'Coordinador',
          municipalidad: 'Puntarenas',
          rol: 2,
          rol_nombre: 'Responsable'
        }
      ];

      setUsuarios(usuariosPlaceholder);
      setUsuariosFiltrados(usuariosPlaceholder);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  const filtrarUsuarios = () => {
    if (!searchTerm.trim()) {
      setUsuariosFiltrados(usuarios);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtrados = usuarios.filter(usuario => {
      const nombreCompleto = `${usuario.nombre} ${usuario.apellido1} ${usuario.apellido2}`.toLowerCase();
      const correo = usuario.correo.toLowerCase();
      const cargo = usuario.cargo.toLowerCase();
      const municipalidad = usuario.municipalidad.toLowerCase();

      return nombreCompleto.includes(term) || 
             correo.includes(term) || 
             cargo.includes(term) || 
             municipalidad.includes(term);
    });

    setUsuariosFiltrados(filtrados);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCambiarRol = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setNuevoRol(usuario.rol.toString());
    setShowModal(true);
  };

  const handleSubmitCambioRol = async (e) => {
    e.preventDefault();

    if (parseInt(nuevoRol) === usuarioSeleccionado.rol) {
      alert('El usuario ya tiene ese rol asignado');
      return;
    }

    try {
      /*
      const response = await fetch(`/api/usuarios/${usuarioSeleccionado.id_usuario}/rol`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rol: parseInt(nuevoRol) })
      });

      if (response.ok) {
        alert('Rol actualizado exitosamente');
        fetchUsuarios();
        setShowModal(false);
      } else {
        alert('Error al actualizar el rol');
      }
      */

      console.log('Cambiando rol:', {
        usuario_id: usuarioSeleccionado.id_usuario,
        rol_anterior: usuarioSeleccionado.rol,
        rol_nuevo: parseInt(nuevoRol)
      });

      // Actualizar localmente
      const usuariosActualizados = usuarios.map(u => 
        u.id_usuario === usuarioSeleccionado.id_usuario 
          ? { ...u, rol: parseInt(nuevoRol), rol_nombre: roles.find(r => r.id === parseInt(nuevoRol)).nombre }
          : u
      );
      setUsuarios(usuariosActualizados);

      alert('Rol actualizado exitosamente');
      setShowModal(false);
    } catch (error) {
      console.error('Error al cambiar rol:', error);
      alert('Error al actualizar el rol');
    }
  };

  const getRolBadgeClass = (rol) => {
    switch (rol) {
      case 1:
        return 'badge-usuario';
      case 2:
        return 'badge-responsable';
      case 3:
        return 'badge-admin';
      default:
        return 'badge-usuario';
    }
  };

  return (
    <div className="adminRoles-page">
      <Accesibilidad />
      <Header />

      <main className="adminRoles">
        <div className="admin-header">
          <h1>Administración de Roles</h1>
          <div className="roles-info">
            <span className="info-item">
              <strong>Total usuarios:</strong> {usuarios.length}
            </span>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="search-section">
          <div className="search-container">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
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
                onClick={() => setSearchTerm('')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Leyenda de Roles */}
        <div className="roles-legend">
          <div className="legend-item">
            <span className="badge badge-usuario">Usuario</span>
            <span className="legend-text">Permisos básicos</span>
          </div>
          <div className="legend-item">
            <span className="badge badge-responsable">Responsable</span>
            <span className="legend-text">Gestiona su área</span>
          </div>
          <div className="legend-item">
            <span className="badge badge-admin">Administrador</span>
            <span className="legend-text">Acceso total</span>
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
                  <th>Rol Actual</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map(usuario => (
                  <tr key={usuario.id_usuario}>
                    <td data-label="ID">{usuario.id_usuario}</td>
                    <td data-label="Nombre" className="td-nombre">
                      {usuario.nombre} {usuario.apellido1} {usuario.apellido2}
                    </td>
                    <td data-label="Correo">{usuario.correo}</td>
                    <td data-label="Cargo">{usuario.cargo}</td>
                    <td data-label="Municipalidad">{usuario.municipalidad}</td>
                    <td data-label="Rol">
                      <span className={`badge ${getRolBadgeClass(usuario.rol)}`}>
                        {usuario.rol_nombre}
                      </span>
                    </td>
                    <td data-label="Acciones" className="td-acciones">
                      <button 
                        className="btn-accion btn-cambiar-rol"
                        onClick={() => handleCambiarRol(usuario)}
                        title="Cambiar rol"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                        </svg>
                        Cambiar Rol
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
      {showModal && usuarioSeleccionado && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Cambiar Rol de Usuario</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="usuario-info">
                <h3>{usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido1} {usuarioSeleccionado.apellido2}</h3>
                <p className="info-detail">
                  <strong>Correo:</strong> {usuarioSeleccionado.correo}
                </p>
                <p className="info-detail">
                  <strong>Cargo:</strong> {usuarioSeleccionado.cargo}
                </p>
                <p className="info-detail">
                  <strong>Municipalidad:</strong> {usuarioSeleccionado.municipalidad}
                </p>
                <p className="info-detail">
                  <strong>Rol actual:</strong> 
                  <span className={`badge ${getRolBadgeClass(usuarioSeleccionado.rol)}`}>
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
                    {roles.map(rol => (
                      <option key={rol.id} value={rol.id}>
                        {rol.nombre} - {rol.descripcion}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancelar" onClick={() => setShowModal(false)}>
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

      <Footer />
    </div>
  );
}

export default AdminRoles;