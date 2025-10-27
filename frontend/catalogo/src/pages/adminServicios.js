import './adminServicios.css';
import React, { useState, useEffect } from 'react';
import Accesibilidad from '../components/accesibilidad';
import Header from '../components/header';
import Footer from '../components/footer';

function AdminServicios() {  // Cambié de adminServicios a AdminServicios (mayúscula)
  const [servicios, setServicios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingServicio, setEditingServicio] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    imagen: '',
    icono: '',
    descripcion: '',
    habilitado: true
  });

  useEffect(() => {
    fetchServicios();
  }, []);

  const fetchServicios = async () => {
    try {
      // DATOS DE EJEMPLO (PLACEHOLDER)
      const serviciosPlaceholder = [
        {
          id: 1,
          titulo: 'Servicio 1',
          imagen: 'https://via.placeholder.com/450x220/d3d3d3/666666?text=Servicio+1',
          icono: null,
          descripcion: 'Descripción del servicio 1.',
          habilitado: true
        },
        {
          id: 2,
          titulo: 'Servicio 2',
          imagen: 'https://via.placeholder.com/450x220/d3d3d3/666666?text=Servicio+2',
          icono: null,
          descripcion: 'Descripción del servicio 2.',
          habilitado: false
        },
        {
          id: 3,
          titulo: 'Servicio 3',
          imagen: 'https://via.placeholder.com/450x220/d3d3d3/666666?text=Servicio+3',
          icono: null,
          descripcion: 'Descripción del servicio 3.',
          habilitado: true
        }
      ];
      setServicios(serviciosPlaceholder);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingServicio) {
        console.log('Actualizando servicio:', formData);
      } else {
        console.log('Creando servicio:', formData);
      }
      
      setShowModal(false);
      setEditingServicio(null);
      setFormData({ titulo: '', imagen: '', icono: '', descripcion: '', habilitado: true });
      fetchServicios();
    } catch (error) {
      console.error('Error al guardar servicio:', error);
    }
  };

  const handleEdit = (servicio) => {
    setEditingServicio(servicio);
    setFormData({
      titulo: servicio.titulo,
      imagen: servicio.imagen,
      icono: servicio.icono || '',
      descripcion: servicio.descripcion,
      habilitado: servicio.habilitado
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este servicio?')) {
      try {
        console.log('Eliminando servicio:', id);
        fetchServicios();
      } catch (error) {
        console.error('Error al eliminar servicio:', error);
      }
    }
  };

  const handleToggleHabilitado = async (id, habilitado) => {
    try {
      console.log('Cambiando estado de servicio:', id, !habilitado);
      fetchServicios();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const openNewModal = () => {
    setEditingServicio(null);
    setFormData({ titulo: '', imagen: '', icono: '', descripcion: '', habilitado: true });
    setShowModal(true);
  };

  return (
    <div className="adminServicios-page">
      <Accesibilidad />
      <Header />

      <main className="adminServicios">
        <div className="admin-header">
          <h1>Administración de Servicios</h1>
          <button className="btn-nuevo" onClick={openNewModal}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nuevo Servicio
          </button>
        </div>

        <div className="servicios-table-container">
          <table className="servicios-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {servicios.map(servicio => (
                <tr key={servicio.id}>
                  <td>{servicio.id}</td>
                  <td className="td-titulo">{servicio.titulo}</td>
                  <td className="td-descripcion">{servicio.descripcion}</td>
                  <td>
                    <span className={`badge ${servicio.habilitado ? 'badge-activo' : 'badge-inactivo'}`}>
                      {servicio.habilitado ? 'Habilitado' : 'Deshabilitado'}
                    </span>
                  </td>
                  <td className="td-acciones">
                    <button 
                      className="btn-accion btn-editar" 
                      onClick={() => handleEdit(servicio)}
                      title="Editar"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button 
                      className="btn-accion btn-toggle" 
                      onClick={() => handleToggleHabilitado(servicio.id, servicio.habilitado)}
                      title={servicio.habilitado ? 'Deshabilitar' : 'Habilitar'}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {servicio.habilitado ? (
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                        ) : (
                          <>
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                            <line x1="1" y1="1" x2="23" y2="23"/>
                          </>
                        )}
                      </svg>
                    </button>
                    <button 
                      className="btn-accion btn-eliminar" 
                      onClick={() => handleDelete(servicio.id)}
                      title="Eliminar"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {servicios.length === 0 && (
            <div className="no-data">
              <p>No hay servicios registrados</p>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingServicio ? 'Editar Servicio' : 'Nuevo Servicio'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Título *</label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  required
                  placeholder="Nombre del servicio"
                />
              </div>

              <div className="form-group">
                <label>URL de la Imagen *</label>
                <input
                  type="text"
                  name="imagen"
                  value={formData.imagen}
                  onChange={handleInputChange}
                  required
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div className="form-group">
                <label>URL del Ícono (opcional)</label>
                <input
                  type="text"
                  name="icono"
                  value={formData.icono}
                  onChange={handleInputChange}
                  placeholder="https://ejemplo.com/icono.svg"
                />
              </div>

              <div className="form-group">
                <label>Descripción *</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  placeholder="Descripción del servicio"
                />
              </div>

              <div className="form-group-checkbox">
                <input
                  type="checkbox"
                  id="habilitado"
                  name="habilitado"
                  checked={formData.habilitado}
                  onChange={handleInputChange}
                />
                <label htmlFor="habilitado">Servicio habilitado</label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancelar" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-guardar">
                  {editingServicio ? 'Actualizar' : 'Crear'}
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

export default AdminServicios;  // Cambié aquí también