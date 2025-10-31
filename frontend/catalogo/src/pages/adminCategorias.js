import './adminCategorias.css';
import React, { useState, useEffect } from 'react';
import Accesibilidad from '../components/accesibilidad';
import Header from '../components/header';
import Footer from '../components/footer';

function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [estados, setEstados] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showModalCategoria, setShowModalCategoria] = useState(false);
  const [showModalEstado, setShowModalEstado] = useState(false);
  const [showModalRol, setShowModalRol] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [editingEstado, setEditingEstado] = useState(null);
  const [editingRol, setEditingRol] = useState(null);
  const [activeTab, setActiveTab] = useState('categorias'); // 'categorias', 'estados' o 'roles'

  const [formCategoria, setFormCategoria] = useState({
    nombre: '',
    descripcion: '',
    color: '#4a90e2'
  });

  const [formEstado, setFormEstado] = useState({
    nombre: '',
    descripcion: '',
    color: '#28a745'
  });

  const [formRol, setFormRol] = useState({
    nombre: '',
    descripcion: '',
    color: '#9c27b0'
  });

  useEffect(() => {
    fetchCategorias();
    fetchEstados();
    fetchRoles();
  }, []);

  const fetchCategorias = async () => {
    try {
      // CONEXIÓN A BASE DE DATOS
      /*
      const response = await fetch('/api/categorias');
      const data = await response.json();
      setCategorias(data);
      */

      // PLACEHOLDER
      const categoriasPlaceholder = [
        {
          id_categoria: 1,
          nombre: 'Tecnología',
          descripcion: 'Servicios relacionados con TI y sistemas',
          color: '#4a90e2'
        },
        {
          id_categoria: 2,
          nombre: 'Administrativo',
          descripcion: 'Gestión administrativa y recursos humanos',
          color: '#2ecc71'
        },
        {
          id_categoria: 3,
          nombre: 'Legal',
          descripcion: 'Asesoría y servicios legales',
          color: '#e74c3c'
        },
        {
          id_categoria: 4,
          nombre: 'Educación',
          descripcion: 'Capacitación y formación',
          color: '#9b59b6'
        }
      ];
      setCategorias(categoriasPlaceholder);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const fetchEstados = async () => {
    try {
      // CONEXIÓN A BASE DE DATOS
      /*
      const response = await fetch('/api/estados-solicitud');
      const data = await response.json();
      setEstados(data);
      */

      // PLACEHOLDER
      const estadosPlaceholder = [
        {
          id_estado: 1,
          nombre: 'Pendiente',
          descripcion: 'Solicitud recibida, pendiente de revisión',
          color: '#ffc107'
        },
        {
          id_estado: 2,
          nombre: 'En Proceso',
          descripcion: 'Solicitud en proceso de atención',
          color: '#2196f3'
        },
        {
          id_estado: 3,
          nombre: 'Admitida',
          descripcion: 'Solicitud aprobada y admitida',
          color: '#28a745'
        },
        {
          id_estado: 4,
          nombre: 'Rechazada',
          descripcion: 'Solicitud rechazada',
          color: '#dc3545'
        },
        {
          id_estado: 5,
          nombre: 'Completada',
          descripcion: 'Solicitud completada exitosamente',
          color: '#17a2b8'
        }
      ];
      setEstados(estadosPlaceholder);
    } catch (error) {
      console.error('Error al cargar estados:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      // CONEXIÓN A BASE DE DATOS
      /*
      const response = await fetch('/api/roles');
      const data = await response.json();
      setRoles(data);
      */

      // PLACEHOLDER
      const rolesPlaceholder = [
        {
          id_rol: 1,
          nombre: 'Administrador',
          descripcion: 'Acceso completo al sistema y gestión de usuarios',
          color: '#9c27b0'
        },
        {
          id_rol: 2,
          nombre: 'Funcionario',
          descripcion: 'Gestión de servicios y solicitudes',
          color: '#ff9800'
        },
        {
          id_rol: 3,
          nombre: 'Usuario',
          descripcion: 'Usuario estándar con acceso a servicios públicos',
          color: '#03a9f4'
        },
        {
          id_rol: 4,
          nombre: 'Supervisor',
          descripcion: 'Supervisión y aprobación de solicitudes',
          color: '#4caf50'
        }
      ];
      setRoles(rolesPlaceholder);
    } catch (error) {
      console.error('Error al cargar roles:', error);
    }
  };

  // ==================== MANEJADORES DE CATEGORÍAS ====================
  const handleCategoriaChange = (e) => {
    const { name, value } = e.target;
    setFormCategoria({ ...formCategoria, [name]: value });
  };

  const handleSubmitCategoria = async (e) => {
    e.preventDefault();

    try {
      if (editingCategoria) {
        /*
        await fetch(`/api/categorias/${editingCategoria.id_categoria}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formCategoria)
        });
        */
        console.log('Actualizando categoría:', formCategoria);
      } else {
        /*
        await fetch('/api/categorias', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formCategoria)
        });
        */
        console.log('Creando categoría:', formCategoria);
      }

      alert(editingCategoria ? 'Categoría actualizada' : 'Categoría creada');
      setShowModalCategoria(false);
      setEditingCategoria(null);
      resetFormCategoria();
      fetchCategorias();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
    }
  };

  const handleEditCategoria = (categoria) => {
    setEditingCategoria(categoria);
    setFormCategoria({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
      color: categoria.color
    });
    setShowModalCategoria(true);
  };

  const handleDeleteCategoria = async (id) => {
    if (window.confirm('¿Eliminar esta categoría? Los servicios asociados quedarán sin categoría.')) {
      try {
        /*
        await fetch(`/api/categorias/${id}`, { method: 'DELETE' });
        */
        console.log('Eliminando categoría:', id);
        alert('Categoría eliminada');
        fetchCategorias();
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  const resetFormCategoria = () => {
    setFormCategoria({ nombre: '', descripcion: '', color: '#4a90e2' });
  };

  const openNewCategoria = () => {
    setEditingCategoria(null);
    resetFormCategoria();
    setShowModalCategoria(true);
  };

  // ==================== MANEJADORES DE ESTADOS ====================
  const handleEstadoChange = (e) => {
    const { name, value } = e.target;
    setFormEstado({ ...formEstado, [name]: value });
  };

  const handleSubmitEstado = async (e) => {
    e.preventDefault();

    try {
      if (editingEstado) {
        /*
        await fetch(`/api/estados-solicitud/${editingEstado.id_estado}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formEstado)
        });
        */
        console.log('Actualizando estado:', formEstado);
      } else {
        /*
        await fetch('/api/estados-solicitud', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formEstado)
        });
        */
        console.log('Creando estado:', formEstado);
      }

      alert(editingEstado ? 'Estado actualizado' : 'Estado creado');
      setShowModalEstado(false);
      setEditingEstado(null);
      resetFormEstado();
      fetchEstados();
    } catch (error) {
      console.error('Error al guardar estado:', error);
    }
  };

  const handleEditEstado = (estado) => {
    setEditingEstado(estado);
    setFormEstado({
      nombre: estado.nombre,
      descripcion: estado.descripcion,
      color: estado.color
    });
    setShowModalEstado(true);
  };

  const handleDeleteEstado = async (id) => {
    if (window.confirm('¿Eliminar este estado? Las solicitudes con este estado quedarán sin estado.')) {
      try {
        /*
        await fetch(`/api/estados-solicitud/${id}`, { method: 'DELETE' });
        */
        console.log('Eliminando estado:', id);
        alert('Estado eliminado');
        fetchEstados();
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  const resetFormEstado = () => {
    setFormEstado({ nombre: '', descripcion: '', color: '#28a745' });
  };

  const openNewEstado = () => {
    setEditingEstado(null);
    resetFormEstado();
    setShowModalEstado(true);
  };

  // ==================== MANEJADORES DE ROLES ====================
  const handleRolChange = (e) => {
    const { name, value } = e.target;
    setFormRol({ ...formRol, [name]: value });
  };

  const handleSubmitRol = async (e) => {
    e.preventDefault();

    try {
      if (editingRol) {
        /*
        await fetch(`/api/roles/${editingRol.id_rol}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formRol)
        });
        */
        console.log('Actualizando rol:', formRol);
      } else {
        /*
        await fetch('/api/roles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formRol)
        });
        */
        console.log('Creando rol:', formRol);
      }

      alert(editingRol ? 'Rol actualizado' : 'Rol creado');
      setShowModalRol(false);
      setEditingRol(null);
      resetFormRol();
      fetchRoles();
    } catch (error) {
      console.error('Error al guardar rol:', error);
    }
  };

  const handleEditRol = (rol) => {
    setEditingRol(rol);
    setFormRol({
      nombre: rol.nombre,
      descripcion: rol.descripcion,
      color: rol.color
    });
    setShowModalRol(true);
  };

  const handleDeleteRol = async (id) => {
    if (window.confirm('¿Eliminar este rol? Los usuarios con este rol quedarán sin rol asignado.')) {
      try {
        /*
        await fetch(`/api/roles/${id}`, { method: 'DELETE' });
        */
        console.log('Eliminando rol:', id);
        alert('Rol eliminado');
        fetchRoles();
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  const resetFormRol = () => {
    setFormRol({ nombre: '', descripcion: '', color: '#9c27b0' });
  };

  const openNewRol = () => {
    setEditingRol(null);
    resetFormRol();
    setShowModalRol(true);
  };

  return (
    <div className="adminCategorias-page">
      <Accesibilidad />
      <Header />

      <main className="adminCategorias">
        <div className="admin-header">
          <h1>Gestión de Categorías, Estados y Roles</h1>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <button
            className={`tab ${activeTab === 'categorias' ? 'active' : ''}`}
            onClick={() => setActiveTab('categorias')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
            Categorías de Servicios
          </button>
          <button
            className={`tab ${activeTab === 'estados' ? 'active' : ''}`}
            onClick={() => setActiveTab('estados')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 11 12 14 22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            Estados de Solicitudes
          </button>
          <button
            className={`tab ${activeTab === 'roles' ? 'active' : ''}`}
            onClick={() => setActiveTab('roles')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Roles de Usuario
          </button>
        </div>

        {/* Contenido de Categorías */}
        {activeTab === 'categorias' && (
          <div className="tab-content">
            <div className="content-header">
              <h2>Categorías de Servicios</h2>
              <button className="btn-nuevo" onClick={openNewCategoria}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Nueva Categoría
              </button>
            </div>

            <div className="items-grid">
              {categorias.map(categoria => (
                <div key={categoria.id_categoria} className="item-card">
                  <div className="item-color" style={{ backgroundColor: categoria.color }}></div>
                  <div className="item-content">
                    <h3>{categoria.nombre}</h3>
                    <p>{categoria.descripcion}</p>
                  </div>
                  <div className="item-actions">
                    <button
                      className="btn-icon btn-edit"
                      onClick={() => handleEditCategoria(categoria)}
                      title="Editar"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => handleDeleteCategoria(categoria.id_categoria)}
                      title="Eliminar"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contenido de Estados */}
        {activeTab === 'estados' && (
          <div className="tab-content">
            <div className="content-header">
              <h2>Estados de Solicitudes</h2>
              <button className="btn-nuevo" onClick={openNewEstado}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Nuevo Estado
              </button>
            </div>

            <div className="items-grid">
              {estados.map(estado => (
                <div key={estado.id_estado} className="item-card">
                  <div className="item-color" style={{ backgroundColor: estado.color }}></div>
                  <div className="item-content">
                    <h3>{estado.nombre}</h3>
                    <p>{estado.descripcion}</p>
                  </div>
                  <div className="item-actions">
                    <button
                      className="btn-icon btn-edit"
                      onClick={() => handleEditEstado(estado)}
                      title="Editar"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => handleDeleteEstado(estado.id_estado)}
                      title="Eliminar"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contenido de Roles */}
        {activeTab === 'roles' && (
          <div className="tab-content">
            <div className="content-header">
              <h2>Roles de Usuario</h2>
              <button className="btn-nuevo" onClick={openNewRol}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Nuevo Rol
              </button>
            </div>

            <div className="items-grid">
              {roles.map(rol => (
                <div key={rol.id_rol} className="item-card">
                  <div className="item-color" style={{ backgroundColor: rol.color }}></div>
                  <div className="item-content">
                    <h3>{rol.nombre}</h3>
                    <p>{rol.descripcion}</p>
                  </div>
                  <div className="item-actions">
                    <button
                      className="btn-icon btn-edit"
                      onClick={() => handleEditRol(rol)}
                      title="Editar"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => handleDeleteRol(rol.id_rol)}
                      title="Eliminar"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal Categoría */}
      {showModalCategoria && (
        <div className="modal-overlay" onClick={() => setShowModalCategoria(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
              <button className="modal-close" onClick={() => setShowModalCategoria(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitCategoria} className="modal-form">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formCategoria.nombre}
                  onChange={handleCategoriaChange}
                  required
                  placeholder="Ej: Tecnología"
                />
              </div>

              <div className="form-group">
                <label>Descripción *</label>
                <textarea
                  name="descripcion"
                  value={formCategoria.descripcion}
                  onChange={handleCategoriaChange}
                  required
                  rows="3"
                  placeholder="Describe esta categoría..."
                />
              </div>

              <div className="form-group">
                <label>Color</label>
                <div className="color-picker-group">
                  <input
                    type="color"
                    name="color"
                    value={formCategoria.color}
                    onChange={handleCategoriaChange}
                  />
                  <span className="color-value">{formCategoria.color}</span>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancelar" onClick={() => setShowModalRol(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-guardar">
                  {editingRol ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default AdminCategorias;