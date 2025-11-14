import './solicitarServicio.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NotificationSystem, { showNotification } from '../components/NotificationSystem';  // ⬅️ AGREGAR

const API_URL = process.env.REACT_APP_API_URL;
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
      const response = await fetch(`${API_URL}/Servicio/ListarServicios`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setServicios(data);

      // Pre-selecciona si viene desde un servicio específico
      if (id) setServiciosSeleccionados([parseInt(id)]);
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
    if (text.length <= maxCaracteres) setDetalles(text);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (serviciosSeleccionados.length === 0) {
    // REEMPLAZAR: alert('Por favor selecciona al menos un servicio');
    showNotification({
      type: 'warning',
      title: 'Selección requerida',
      message: 'Debes seleccionar al menos un servicio'
    });
    return;
  }

  if (!detalles.trim()) {
    // REEMPLAZAR: alert('Por favor agrega detalles de tu solicitud');
    showNotification({
      type: 'warning',
      title: 'Información incompleta',
      message: 'Debes agregar detalles de tu solicitud'
    });
    return;
  }

  try {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/Solicitudes/CrearSolicitud`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        detalles_solicitud: detalles,
        id_estado: 1,
        servicios: serviciosSeleccionados
      })
    });

    const data = await response.json();

    if (response.ok) {
      // REEMPLAZAR: alert('¡Solicitud enviada exitosamente!');
      showNotification({
        type: 'success',
        title: '¡Solicitud Enviada!',
        message: 'Tu solicitud ha sido registrada correctamente',
        duration: 3000
      });
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else {
      // REEMPLAZAR: alert(data.message || 'Error al enviar la solicitud');
      showNotification({
        type: 'error',
        title: 'Error al enviar',
        message: data.message || 'No se pudo procesar tu solicitud'
      });
    }

  } catch (error) {
    console.error('Error al enviar solicitud:', error);
    // REEMPLAZAR: alert('Error al enviar la solicitud. Por favor intenta de nuevo.');
    showNotification({
      type: 'error',
      title: 'Error de conexión',
      message: 'No se pudo conectar con el servidor. Intenta de nuevo.'
    });
  }
};

  return (
    <div className="solicitar-page">
      <NotificationSystem />
      <div className="solicitar-container">
        <div className="solicitar-form-container">
          <div className="form-logo">
            <img 
              src="https://reclutamiento.ifam.go.cr/UTH/Resources/Logo_4.png" 
              alt="IFAM Logo" 
            />
          </div>

          <h2>Solicitar Servicios</h2>
          <p className="form-subtitle">Selecciona uno o más servicios y describe tu necesidad</p>

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
                    key={servicio.id_servicio}
                    className={`servicio-checkbox ${serviciosSeleccionados.includes(servicio.id_servicio) ? 'selected' : ''}`}
                  >
                    <input
                      type="checkbox"
                      id={`servicio-${servicio.id_servicio}`}
                      checked={serviciosSeleccionados.includes(servicio.id_servicio)}
                      onChange={() => handleServicioToggle(servicio.id_servicio)}
                    />
                    <label htmlFor={`servicio-${servicio.id_servicio}`} className="servicio-label">
                      <div className="servicio-info">
                        <span className="servicio-nombre">{servicio.nombre_servicio}</span>
                        <span className="servicio-categoria">{servicio.nombre_categoria}</span>
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
