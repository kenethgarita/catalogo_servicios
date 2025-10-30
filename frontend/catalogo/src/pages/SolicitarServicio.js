import './solicitarServicio.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function SolicitarServicio() {
  const navigate = useNavigate();
  const { id } = useParams(); // Si viene desde un servicio específico
  const [servicios, setServicios] = useState([]);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const [detalles, setDetalles] = useState('');
  const maxCaracteres = 500;

  useEffect(() => {
    fetchServicios();
  }, []);

  const fetchServicios = async () => {
    try {
      // CONEXIÓN A BASE DE DATOS - Reemplaza con tu endpoint real
      /*
      const response = await fetch('/api/servicios/habilitados');
      const data = await response.json();
      setServicios(data);
      */

      // DATOS DE EJEMPLO (PLACEHOLDER)
      const serviciosPlaceholder = [
        {
          id: 1,
          nombre: 'Soporte Técnico',
          categoria: 'Tecnología',
          habilitado: true
        },
        {
          id: 2,
          nombre: 'Gestión de Recursos Humanos',
          categoria: 'Administrativo',
          habilitado: true
        },
        {
          id: 3,
          nombre: 'Asesoría Legal',
          categoria: 'Legal',
          habilitado: true
        },
        {
          id: 4,
          nombre: 'Capacitación Municipal',
          categoria: 'Educación',
          habilitado: true
        },
        {
          id: 5,
          nombre: 'Gestión Financiera',
          categoria: 'Administrativo',
          habilitado: true
        },
        {
          id: 6,
          nombre: 'Planificación Estratégica',
          categoria: 'Consultoría',
          habilitado: true
        }
      ];

      setServicios(serviciosPlaceholder);

      // Si viene desde un servicio específico, pre-seleccionarlo
      if (id) {
        setServiciosSeleccionados([parseInt(id)]);
      }
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    }
  };

  const handleServicioToggle = (servicioId) => {
    if (serviciosSeleccionados.includes(servicioId)) {
      setServiciosSeleccionados(serviciosSeleccionados.filter(id => id !== servicioId));
    } else {
      setServiciosSeleccionados([...serviciosSeleccionados, servicioId]);
    }
  };

  const handleDetallesChange = (e) => {
    const text = e.target.value;
    if (text.length <= maxCaracteres) {
      setDetalles(text);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (serviciosSeleccionados.length === 0) {
      alert('Por favor selecciona al menos un servicio');
      return;
    }

    if (!detalles.trim()) {
      alert('Por favor agrega detalles de tu solicitud');
      return;
    }

    try {
      /*
      const response = await fetch('/api/solicitudes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          servicios_ids: serviciosSeleccionados,
          detalles: detalles,
          fecha_solicitud: new Date().toISOString()
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Solicitud enviada exitosamente!');
        navigate('/');
      } else {
        alert(data.message || 'Error al enviar la solicitud');
      }
      */

      console.log('Solicitud enviada:', {
        servicios: serviciosSeleccionados,
        detalles: detalles,
        fecha: new Date().toISOString()
      });

      alert('¡Solicitud enviada exitosamente!');
      navigate('/');

    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      alert('Error al enviar la solicitud. Por favor intenta de nuevo.');
    }
  };

  return (
    <div className="solicitar-page">
      <div className="solicitar-container">
        <div className="solicitar-form-container">
          {/* Logo */}
          <div className="form-logo">
            <img 
              src="https://reclutamiento.ifam.go.cr/UTH/Resources/Logo_4.png" 
              alt="IFAM Logo" 
            />
          </div>

          {/* Título */}
          <h2>Solicitar Servicios</h2>
          <p className="form-subtitle">Selecciona uno o más servicios y describe tu necesidad</p>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="solicitud-form">
            {/* Selección de Servicios */}
            <div className="form-section">
              <label className="section-label">
                Servicios *
                <span className="selection-count">
                  ({serviciosSeleccionados.length} seleccionado{serviciosSeleccionados.length !== 1 ? 's' : ''})
                </span>
              </label>
              
<div className="servicios-grid">
  {servicios.map(servicio => (
    <div
      key={servicio.id}
      className={`servicio-checkbox ${serviciosSeleccionados.includes(servicio.id) ? 'selected' : ''}`}
    >
      <input
        type="checkbox"
        id={`servicio-${servicio.id}`}
        checked={serviciosSeleccionados.includes(servicio.id)}
        onChange={() => handleServicioToggle(servicio.id)}
      />
      <label 
        htmlFor={`servicio-${servicio.id}`}
        className="servicio-label"
      >
        <div className="servicio-info">
          <span className="servicio-nombre">{servicio.nombre}</span>
          <span className="servicio-categoria">{servicio.categoria}</span>
        </div>
        <div className="check-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
      </label>
    </div>
  ))}
</div>
            </div>

            {/* Detalles de la Solicitud */}
            <div className="form-section">
              <label htmlFor="detalles" className="section-label">
                Detalles de la Solicitud *
              </label>
              <textarea
                id="detalles"
                value={detalles}
                onChange={handleDetallesChange}
                placeholder="Describe tu solicitud, necesidades específicas, fechas importantes, etc."
                rows="6"
                required
              />
              <div className="character-count">
                <span className={detalles.length >= maxCaracteres ? 'limit-reached' : ''}>
                  {detalles.length} / {maxCaracteres} caracteres
                </span>
              </div>
            </div>

            {/* Botones */}
            <div className="form-actions">
              <button type="submit" className="btn-submit">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2z"/>
                </svg>
                Enviar Solicitud
              </button>
            </div>
          </form>

          {/* Volver al Inicio */}
          <div className="form-footer">
            <button onClick={() => navigate('/')} className="link-volver">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SolicitarServicio;