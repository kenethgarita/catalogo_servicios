import './adminServicios.css';
import React, { useState, useEffect } from 'react';
import Accesibilidad from '../components/accesibilidad';
import Header from '../components/header';
import Footer from '../components/footer';

function AdminServicios() {
  const [servicios, setServicios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingServicio, setEditingServicio] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    proposito: '',
    areaResponsable: '',
    tiempoAtencion: '',
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
      // DATOS PLACEHOLDER - Simula datos de la base de datos
      const serviciosPlaceholder = [
        {
          id: 1,
          nombre: 'Consultoría Empresarial',
          descripcion: 'Servicio de asesoría especializada que brinda apoyo estratégico a empresas y organizaciones en diferentes áreas del conocimiento. Nuestro equipo de expertos analiza la situación actual de su empresa, identifica oportunidades de mejora y desarrolla planes de acción personalizados para alcanzar sus objetivos de negocio de manera efectiva y sostenible.',
          proposito: 'Proporcionar soluciones estratégicas personalizadas',
          areaResponsable: 'Departamento de Consultoría',
          tiempoAtencion: '5-7 días hábiles',
          categoria: 'Consultoría',
          imagen: 'https://via.placeholder.com/450x220/CEAC65/ffffff?text=Consultoria',
          documentacion: 'docs/consultoria-manual.pdf',
          habilitado: true
        },
        {
          id: 2,
          nombre: 'Soporte Técnico Especializado',
          descripcion: 'Servicio integral de asistencia técnica para resolver problemas relacionados con sistemas informáticos, software empresarial y equipos tecnológicos. Contamos con un equipo disponible para atender incidencias, realizar mantenimientos preventivos y correctivos, así como brindar capacitación a usuarios finales.',
          proposito: 'Resolver incidencias técnicas de forma rápida',
          areaResponsable: 'Departamento de TI',
          tiempoAtencion: '24-48 horas',
          categoria: 'Tecnología',
          imagen: 'https://via.placeholder.com/450x220/1d2d5a/ffffff?text=Soporte',
          documentacion: 'docs/soporte-tecnico.pdf',
          habilitado: true
        },
        {
          id: 3,
          nombre: 'Gestión de Proyectos',
          descripcion: 'Administración profesional de proyectos desde su concepción hasta su cierre, asegurando el cumplimiento de objetivos, plazos y presupuestos establecidos.',
          proposito: 'Ejecutar proyectos exitosamente',
          areaResponsable: 'PMO',
          tiempoAtencion: '10-15 días hábiles',
          categoria: 'Gestión',
          imagen: 'https://via.placeholder.com/450x220/4a90e2/ffffff?text=Proyectos',
          documentacion: '',
          habilitado: false
        },
        {
          id: 4,
          nombre: 'Capacitación Corporativa',
          descripcion: 'Programas de formación diseñados para fortalecer las competencias del personal de su organización en diferentes áreas profesionales.',
          proposito: 'Desarrollar talento humano',
          areaResponsable: 'Recursos Humanos',
          tiempoAtencion: '2-3 semanas',
          categoria: 'Educación',
          imagen: 'https://via.placeholder.com/450x220/50c878/ffffff?text=Capacitacion',
          documentacion: 'docs/capacitacion.pdf',
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
        // Simular actualización
        console.log('Actualizando servicio:', formData);
        const updatedServicios = servicios.map(s => 
          s.id === editingServicio.id 
            ? { ...s, ...formData } 
            : s
        );
        setServicios(updatedServicios);
      } else {
        // Simular creación
        console.log('Creando servicio:', formData);
        const newServicio = {
          id: Math.max(...servicios.map(s => s.id)) + 1,
          ...formData
        };
        setServicios([newServicio, ...servicios]);
      }
      
      setShowModal(false);
      setEditingServicio(null);
      resetForm();
    } catch (error) {
      console.error('Error al guardar servicio:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      proposito: '',
      areaResponsable: '',
      tiempoAtencion: '',
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
      areaResponsable: servicio.areaResponsable,
      tiempoAtencion: servicio.tiempoAtencion,
      categoria: servicio.categoria,
      imagen: servicio.imagen,
      documentacion: servicio.documentacion || '',
      habilitado: servicio.habilitado
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este servicio?')) {
      try {
        console.log('Eliminando servicio:', id);
        setServicios(servicios.filter(s => s.id !== id));
      } catch (error) {
        console.error('Error al eliminar servicio:', error);
      }
    }
  };

  const handleToggleHabilitado = async (id, habilitado) => {
    try {
      console.log('Cambiando estado de servicio:', id, !habilitado);
      const updatedServicios = servicios.map(s => 
        s.id === id ? { ...s, habilitado: !habilitado } : s
      );
      setServicios(updatedServicios);
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
          <div className="table-wrapper">
            <table className="servicios-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Propósito</th>
                  <th>Área Responsable</th>
                  <th>Tiempo de Atención</th>
                  <th>Categoría</th>
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
                      <div className="descripcion-content">
                        {servicio.descripcion.length > 60 
                          ? `${servicio.descripcion.substring(0, 60)}...` 
                          : servicio.descripcion}
                        {servicio.descripcion.length > 60 && (
                          <span className="tooltip-text">{servicio.descripcion}</span>
                        )}
                      </div>
                    </td>
                    <td data-label="Propósito">{servicio.proposito}</td>
                    <td data-label="Área Responsable">{servicio.areaResponsable}</td>
                    <td data-label="Tiempo de Atención">{servicio.tiempoAtencion}</td>
                    <td data-label="Categoría" className="td-categoria">{servicio.categoria}</td>
                    <td data-label="Estado">
                      <span className={`badge ${servicio.habilitado ? 'badge-activo' : 'badge-inactivo'}`}>
                        {servicio.habilitado ? 'Habilitado' : 'Deshabilitado'}
                      </span>
                    </td>
                    <td data-label="Acciones" className="td-acciones">
                      <div className="acciones-wrapper">
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
                      </div>
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
                <label>Nombre del Servicio *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: Consultoría Empresarial"
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
                  placeholder="Descripción detallada del servicio"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Propósito *</label>
                  <input
                    type="text"
                    name="proposito"
                    value={formData.proposito}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: Proporcionar soluciones"
                  />
                </div>

                <div className="form-group">
                  <label>Área Responsable *</label>
                  <input
                    type="text"
                    name="areaResponsable"
                    value={formData.areaResponsable}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: Departamento de TI"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tiempo de Atención *</label>
                  <input
                    type="text"
                    name="tiempoAtencion"
                    value={formData.tiempoAtencion}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: 3-5 días hábiles"
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
                <label>URL de la Imagen *</label>
                <input
                  type="url"
                  name="imagen"
                  value={formData.imagen}
                  onChange={handleInputChange}
                  required
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div className="form-group">
                <label>Documentación (URL o ruta)</label>
                <input
                  type="text"
                  name="documentacion"
                  value={formData.documentacion}
                  onChange={handleInputChange}
                  placeholder="docs/manual.pdf o https://ejemplo.com/doc.pdf"
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