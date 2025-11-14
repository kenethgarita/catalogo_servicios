import './adminCategorias.css';
import React, { useState, useEffect } from 'react';
import Accesibilidad from '../components/accesibilidad';
import Header from '../components/header';
import Footer from '../components/footer';
import NotificationSystem, { showNotification } from '../components/NotificationSystem';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
  const [activeTab, setActiveTab] = useState('categorias');

  const [formCategoria, setFormCategoria] = useState({
    nombre_categoria: ''
  });

  const [formEstado, setFormEstado] = useState({
    nombre_estado: ''
  });

  const [formRol, setFormRol] = useState({
    nombre_rol: ''
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCategorias();
    fetchEstados();
    fetchRoles();
  }, []);

  // ==================== FETCH ====================
  const fetchCategorias = async () => {
    try {
      const res = await fetch(`${API_URL}/Categorias/ObtenerCategorias`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const categoriasMap = Array.isArray(data.categorias) ? data.categorias.map(c => ({
        id_categoria: c.id_categoria,
        nombre: c.nombre_categoria
      })) : [];
      setCategorias(categoriasMap);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setCategorias([]);
    }
  };

  const fetchEstados = async () => {
    try {
      const res = await fetch(`${API_URL}/Estado/ObtenerEstados`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const estadosMap = data.map(e => ({
        id_estado: e.id_estado,
        nombre: e.nombre_estado
      }));
      setEstados(estadosMap);
    } catch (error) {
      console.error('Error al cargar estados:', error);
      setEstados([]);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch(`${API_URL}/Roles/ObtenerRoles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      
      // La respuesta viene con estructura { roles: [...] }
      const rolesArray = Array.isArray(data) ? data : (data.roles || []);
      
      const rolesMap = rolesArray.map(r => ({
        id_rol: r.id_rol,
        nombre: r.nombre_rol
      }));
      setRoles(rolesMap);
    } catch (error) {
      console.error('Error al cargar roles:', error);
      setRoles([]);
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
    const url = editingCategoria
      ? `${API_URL}/Categorias/EditarCategoria/${editingCategoria.id_categoria}`
      : `${API_URL}/Categorias/CrearCategoria`;
    const method = editingCategoria ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formCategoria)
    });

    if (!res.ok) throw new Error('Error al guardar categoría');

    // REEMPLAZAR: alert(editingCategoria ? 'Categoría actualizada' : 'Categoría creada');
    showNotification({
      type: 'success',
      title: editingCategoria ? 'Categoría Actualizada' : 'Categoría Creada',
      message: editingCategoria 
        ? 'La categoría ha sido actualizada correctamente'
        : 'Nueva categoría agregada al sistema'
    });
    
    setShowModalCategoria(false);
    setEditingCategoria(null);
    resetFormCategoria();
    fetchCategorias();
  } catch (error) {
    console.error('Error al guardar categoría:', error);
    showNotification({
      type: 'error',
      title: 'Error',
      message: 'No se pudo guardar la categoría'
    });
  }
};

const handleDeleteCategoria = async (id) => {
  if (window.confirm('¿Eliminar esta categoría? Los servicios asociados quedarán sin categoría.')) {
    try {
      const res = await fetch(`${API_URL}/Categorias/EliminarCategoria/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al eliminar categoría');
      
      // REEMPLAZAR: alert('Categoría eliminada');
      showNotification({
        type: 'success',
        title: 'Categoría Eliminada',
        message: 'La categoría ha sido removida del sistema'
      });
      
      fetchCategorias();
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'No se pudo eliminar la categoría'
      });
    }
  }
};

  // ==================== MANEJADORES DE ESTADOS ====================
  const handleEstadoChange = (e) => {
    const { name, value } = e.target;
    setFormEstado({ ...formEstado, [name]: value });
  };

const handleSubmitEstado = async (e) => {
  e.preventDefault();
  try {
    const url = editingEstado
      ? `${API_URL}/Estado/EditarEstado/${editingEstado.id_estado}`
      : `${API_URL}/Estado/CrearEstado`;
    const method = editingEstado ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formEstado)
    });

    if (!res.ok) throw new Error('Error al guardar estado');

    // REEMPLAZAR: alert(editingEstado ? 'Estado actualizado' : 'Estado creado');
    showNotification({
      type: 'success',
      title: editingEstado ? 'Estado Actualizado' : 'Estado Creado',
      message: 'Los cambios han sido guardados correctamente'
    });
    
    setShowModalEstado(false);
    setEditingEstado(null);
    resetFormEstado();
    fetchEstados();
  } catch (error) {
    console.error('Error al guardar estado:', error);
    showNotification({
      type: 'error',
      title: 'Error',
      message: 'No se pudo guardar el estado'
    });
  }
};

const handleDeleteEstado = async (id) => {
  if (window.confirm('¿Eliminar este estado? Las solicitudes con este estado quedarán sin estado.')) {
    try {
      const res = await fetch(`${API_URL}/Estado/EliminarEstado/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al eliminar estado');
      
      // REEMPLAZAR: alert('Estado eliminado');
      showNotification({
        type: 'success',
        title: 'Estado Eliminado',
        message: 'El estado ha sido removido del sistema'
      });
      
      fetchEstados();
    } catch (error) {
      console.error('Error al eliminar estado:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'No se pudo eliminar el estado'
      });
    }
  }
};

  // ==================== MANEJADORES DE ROLES ====================
  const handleRolChange = (e) => {
    const { name, value } = e.target;
    setFormRol({ ...formRol, [name]: value });
  };

const handleSubmitRol = async (e) => {
  e.preventDefault();
  try {
    const url = editingRol
      ? `${API_URL}/Roles/EditarRoles/${editingRol.id_rol}`
      : `${API_URL}/Roles/CrearRol`;
    const method = editingRol ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formRol)
    });

    if (!res.ok) throw new Error('Error al guardar rol');

    // REEMPLAZAR: alert(editingRol ? 'Rol actualizado' : 'Rol creado');
    showNotification({
      type: 'success',
      title: editingRol ? 'Rol Actualizado' : 'Rol Creado',
      message: 'Los cambios han sido guardados correctamente'
    });
    
    setShowModalRol(false);
    setEditingRol(null);
    resetFormRol();
    fetchRoles();
  } catch (error) {
    console.error('Error al guardar rol:', error);
    showNotification({
      type: 'error',
      title: 'Error',
      message: 'No se pudo guardar el rol'
    });
  }
};

const handleDeleteRol = async (id) => {
  if (window.confirm('¿Eliminar este rol? Los usuarios con este rol quedarán sin rol asignado.')) {
    try {
      const res = await fetch(`${API_URL}/Roles/EliminarRol/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al eliminar rol');
      
      // REEMPLAZAR: alert('Rol eliminado');
      showNotification({
        type: 'success',
        title: 'Rol Eliminado',
        message: 'El rol ha sido removido del sistema'
      });
      
      fetchRoles();
    } catch (error) {
      console.error('Error al eliminar rol:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'No se pudo eliminar el rol'
      });
    }
  }
};

  // ==================== RESTO DE FUNCIONES ====================
  const handleEditCategoria = (categoria) => {
    setEditingCategoria(categoria);
    setFormCategoria({
      nombre_categoria: categoria.nombre
    });
    setShowModalCategoria(true);
  };
  const resetFormCategoria = () => setFormCategoria({ nombre_categoria: '' });
  const openNewCategoria = () => { setEditingCategoria(null); resetFormCategoria(); setShowModalCategoria(true); };

  const handleEditEstado = (estado) => {
    setEditingEstado(estado);
    setFormEstado({
      nombre_estado: estado.nombre
    });
    setShowModalEstado(true);
  };
  const resetFormEstado = () => setFormEstado({ nombre_estado: '' });
  const openNewEstado = () => { setEditingEstado(null); resetFormEstado(); setShowModalEstado(true); };

  const handleEditRol = (rol) => {
    setEditingRol(rol);
    setFormRol({
      nombre_rol: rol.nombre
    });
    setShowModalRol(true);
  };
  const resetFormRol = () => setFormRol({ nombre_rol: '' });
  const openNewRol = () => { setEditingRol(null); resetFormRol(); setShowModalRol(true); };

  return (
    <div className="adminCategorias-page">
      <Accesibilidad />
      <Header />
      <NotificationSystem />

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
                  <div className="item-content">
                    <h3>{categoria.nombre}</h3>
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
                  <div className="item-content">
                    <h3>{estado.nombre}</h3>
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
                  <div className="item-content">
                    <h3>{rol.nombre}</h3>
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
                  name="nombre_categoria"
                  value={formCategoria.nombre_categoria}
                  onChange={handleCategoriaChange}
                  required
                  placeholder="Ej: Tecnología"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancelar" onClick={() => setShowModalCategoria(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-guardar">
                  {editingCategoria ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Estado */}
      {showModalEstado && (
        <div className="modal-overlay" onClick={() => setShowModalEstado(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingEstado ? 'Editar Estado' : 'Nuevo Estado'}</h2>
              <button className="modal-close" onClick={() => setShowModalEstado(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitEstado} className="modal-form">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  name="nombre_estado"
                  value={formEstado.nombre_estado}
                  onChange={handleEstadoChange}
                  required
                  placeholder="Ej: Pendiente"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancelar" onClick={() => setShowModalEstado(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-guardar">
                  {editingEstado ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Rol */}
      {showModalRol && (
        <div className="modal-overlay" onClick={() => setShowModalRol(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingRol ? 'Editar Rol' : 'Nuevo Rol'}</h2>
              <button className="modal-close" onClick={() => setShowModalRol(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitRol} className="modal-form">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  name="nombre_rol"
                  value={formRol.nombre_rol}
                  onChange={handleRolChange}
                  required
                  placeholder="Ej: Administrador"
                />
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