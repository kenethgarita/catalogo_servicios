import './adminServicios.css';
import React, { useState, useEffect } from 'react';
import Accesibilidad from '../components/accesibilidad';
import Header from '../components/header';
import Footer from '../components/footer';

function AdminServicios() {
  const [servicios, setServicios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedServicio, setSelectedServicio] = useState(null);
  const [editingServicio, setEditingServicio] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    proposito: '',
    area_responsable: '',
    tiempo_atencion: '',
    categoria: '',
    imagen: '',
    documentacion: '',
    habilitado: true
  });

  useEffect(() => {
    fetchServicios();
  }, []);

  const fetchServicios = async () => {
    try {
      // CONEXIÓN A BASE DE DATOS - Reemplaza con tu endpoint real
      /*
      const response = await fetch('/api/servicios');
      const data = await response.json();
      setServicios(data);
      */

      // DATOS DE EJEMPLO (PLACEHOLDER)
      const serviciosPlaceholder = [
        {
          id: 1,
          nombre: 'Soporte Técnico',
          descripcion: 'Servicio de soporte técnico para resolver problemas relacionados con hardware, software y conectividad. Incluye diagnóstico, reparación y mantenimiento preventivo de equipos. También ofrece asesoría en la implementación de nuevas tecnologías y capacitación al personal en el uso de herramientas digitales.',
          proposito: 'Garantizar el correcto funcionamiento de los equipos tecnológicos y maximizar la productividad del personal mediante soluciones técnicas eficientes',
          area_responsable: 'Departamento de TI',
          tiempo_atencion: '24-48 horas',
          categoria: 'Tecnología',
          imagen: 'https://via.placeholder.com/300x200/4a90e2/ffffff?text=Soporte+Tecnico',
          documentacion: 'https://ejemplo.com/docs/soporte-tecnico.pdf',
          habilitado: true
        },
        {
          id: 2,
          nombre: 'Gestión de Recursos Humanos',
          descripcion: 'Administración integral de recursos humanos incluyendo contratación, capacitación, evaluación de desempeño y gestión de nómina. El servicio abarca desde el reclutamiento y selección de personal hasta el desarrollo profesional continuo de los colaboradores.',
          proposito: 'Optimizar la gestión del talento humano en la organización y fomentar un ambiente laboral positivo',
          area_responsable: 'Recursos Humanos',
          tiempo_atencion: '5-7 días',
          categoria: 'Administrativo',
          imagen: 'https://via.placeholder.com/300x200/2ecc71/ffffff?text=RRHH',
          documentacion: 'https://ejemplo.com/docs/rrhh.pdf',
          habilitado: true
        },
        {
          id: 3,
          nombre: 'Asesoría Legal',
          descripcion: 'Servicio de consultoría y asesoramiento legal en temas corporativos, contratos, cumplimiento normativo y resolución de conflictos. Incluye revisión de documentos legales, representación en procedimientos administrativos y orientación en temas de compliance.',
          proposito: 'Proveer orientación legal especializada para garantizar el cumplimiento normativo y minimizar riesgos legales',
          area_responsable: 'Departamento Legal',
          tiempo_atencion: '3-5 días',
          categoria: 'Legal',
          imagen: 'https://via.placeholder.com/300x200/e74c3c/ffffff?text=Asesoria+Legal',
          documentacion: 'https://ejemplo.com/docs/legal.pdf',
          habilitado: false
        }
      ];
      setServicios(serviciosPlaceholder);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    }
  };

  // Función para truncar texto
  const truncateText = (text, maxLength = 80) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
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
        /*
        await fetch(`/api/servicios/${editingServicio.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        */
        console.log('Actualizando servicio:', formData);
      } else {
        /*
        await fetch('/api/servicios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        */
        console.log('Creando servicio:', formData);
      }
      
      setShowModal(false);
      setEditingServicio(null);
      resetForm();
      fetchServicios();
    } catch (error) {
      console.error('Error al guardar servicio:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      proposito: '',
      area_responsable: '',
      tiempo_atencion: '',
      categoria: '',
      imagen: '',
      documentacion: '',
      habilitado: true
    });
  };

  const handleEdit = (servicio) => {
    setEditingServicio(servicio);
    setFormData({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      proposito: servicio.proposito,
      area_responsable: servicio.area_responsable,
      tiempo_atencion: servicio.tiempo_atencion,
      categoria: servicio.categoria,
      imagen: servicio.imagen,
      documentacion: servicio.documentacion || '',
      habilitado: servicio.habilitado
    });
    setShowModal(true);
  };

  const handleViewDetail = (servicio) => {
    setSelectedServicio(servicio);
    setShowDetailModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este servicio?')) {
      try {
        /*
        await fetch(`/api/servicios/${id}`, {
          method: 'DELETE'
        });
        */
        console.log('Eliminando servicio:', id);
        fetchServicios();
      } catch (error) {
        console.error('Error al eliminar servicio:', error);
      }
    }
  };

  const handleToggleHabilitado = async (id, habilitado) => {
    try {
      /*
      await fetch(`/api/servicios/${id}/habilitar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habilitado: !habilitado })
      });
      */
      console.log('Cambiando estado de servicio:', id, !habilitado);
      fetchServicios();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const openNewModal = () => {
    setEditingServicio(null);
    resetForm();
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
          <div className="table-responsive">
            <table className="servicios-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Propósito</th>
                  <th>Categoría</th>
                  <th>Área Responsable</th>
                  <th>Tiempo</th>
                  <th>Imagen</th>
                  <th>Docs</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {servicios.map(servicio => (
                  <tr key={servicio.id}>
                    <td data-label="ID">{servicio.id}</td>
                    <td data-label="Nombre" className="td-nombre">{servicio.nombre}</td>
                    <td data-label="Descripción" className="td-descripcion">
                      <span 
                        className="descripcion-truncada"
                        title={servicio.descripcion}
                        onClick={() => handleViewDetail(servicio)}
                      >
                        {truncateText(servicio.descripcion, 80)}
                      </span>
                    </td>
                    <td data-label="Propósito" className="td-proposito">
                      <span title={servicio.proposito}>
                        {truncateText(servicio.proposito, 60)}
                      </span>
                    </td>
                    <td data-label="Categoría">{servicio.categoria}</td>
                    <td data-label="Área Responsable">{servicio.area_responsable}</td>
                    <td data-label="Tiempo">{servicio.tiempo_atencion}</td>
                    <td data-label="Imagen">
                      {servicio.imagen && (
                        <a href={servicio.imagen} target="_blank" rel="noopener noreferrer" className="link-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                        </a>
                      )}
                    </td>
                    <td data-label="Documentación">
                      {servicio.documentacion && (
                        <a href={servicio.documentacion} target="_blank" rel="noopener noreferrer" className="link-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10 9 9 9 8 9"/>
                          </svg>
                        </a>
                      )}
                    </td>
                    <td data-label="Estado">
                      <span className={`badge ${servicio.habilitado ? 'badge-activo' : 'badge-inactivo'}`}>
                        {servicio.habilitado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td data-label="Acciones" className="td-acciones">
                      <button 
                        className="btn-accion btn-ver" 
                        onClick={() => handleViewDetail(servicio)}
                        title="Ver detalles"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>
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
          </div>

          {servicios.length === 0 && (
            <div className="no-data">
              <p>No hay servicios registrados</p>
            </div>
          )}
        </div>
      </main>

      {/* Modal de Detalle */}
      {showDetailModal && selectedServicio && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content modal-detail" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalles del Servicio</h2>
              <button className="modal-close" onClick={() => setShowDetailModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="detail-content">
              {selectedServicio.imagen && (
                <div className="detail-imagen">
                  <img src={selectedServicio.imagen} alt={selectedServicio.nombre} />
                </div>
              )}

              <div className="detail-info">
                <div className="detail-field">
                  <label>ID:</label>
                  <span>{selectedServicio.id}</span>
                </div>

                <div className="detail-field">
                  <label>Nombre:</label>
                  <span>{selectedServicio.nombre}</span>
                </div>

                <div className="detail-field">
                  <label>Categoría:</label>
                  <span>{selectedServicio.categoria}</span>
                </div>

                <div className="detail-field">
                  <label>Área Responsable:</label>
                  <span>{selectedServicio.area_responsable}</span>
                </div>

                <div className="detail-field">
                  <label>Tiempo de Atención:</label>
                  <span>{selectedServicio.tiempo_atencion}</span>
                </div>

                <div className="detail-field full-width">
                  <label>Descripción:</label>
                  <p>{selectedServicio.descripcion}</p>
                </div>

                <div className="detail-field full-width">
                  <label>Propósito:</label>
                  <p>{selectedServicio.proposito}</p>
                </div>

                {selectedServicio.documentacion && (
                  <div className="detail-field">
                    <label>Documentación:</label>
                    <a href={selectedServicio.documentacion} target="_blank" rel="noopener noreferrer" className="detail-link">
                      Ver documento
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15 3 21 3 21 9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                    </a>
                  </div>
                )}

                <div className="detail-field">
                  <label>Estado:</label>
                  <span className={`badge ${selectedServicio.habilitado ? 'badge-activo' : 'badge-inactivo'}`}>
                    {selectedServicio.habilitado ? 'Habilitado' : 'Deshabilitado'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Crear/Editar */}
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
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre del Servicio *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: Soporte Técnico"
                  />
                </div>

                <div className="form-group">
                  <label>Categoría *</label>
                  <input
                    type="text"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: Tecnología"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Descripción *</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  placeholder="Descripción detallada del servicio..."
                />
              </div>

              <div className="form-group">
                <label>Propósito *</label>
                <textarea
                  name="proposito"
                  value={formData.proposito}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  placeholder="Objetivo principal del servicio..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Área Responsable *</label>
                  <input
                    type="text"
                    name="area_responsable"
                    value={formData.area_responsable}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: Departamento de TI"
                  />
                </div>

                <div className="form-group">
                  <label>Tiempo de Atención *</label>
                  <input
                    type="text"
                    name="tiempo_atencion"
                    value={formData.tiempo_atencion}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: 24-48 horas"
                  />
                </div>
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
                <label>URL de Documentación (opcional)</label>
                <input
                  type="text"
                  name="documentacion"
                  value={formData.documentacion}
                  onChange={handleInputChange}
                  placeholder="https://ejemplo.com/documentacion.pdf"
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

export default AdminServicios;