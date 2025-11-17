import './perfil.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Accesibilidad from '../components/accesibilidad';
import Header from '../components/header';
import Footer from '../components/footer';
import NotificationSystem, { showNotification } from '../components/NotificationSystem';
import Config2FA from '../components/Config2FA';

const API_URL = process.env.REACT_APP_API_URL;

function Perfil() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [usuarioData, setUsuarioData] = useState(null);
  const [rolNombre, setRolNombre] = useState('Usuario');
  const [formData, setFormData] = useState({
    nombre: '',
    apellido1: '',
    apellido2: '',
    cargo: '',
    municipalidad: '',
    correo: '',
    num_tel: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    passwordActual: '',
    passwordNueva: '',
    passwordConfirm: ''
  });
  const [estadisticas, setEstadisticas] = useState({
    solicitudesCreadas: 0,
    solicitudesPendientes: 0,
    solicitudesCompletadas: 0
  });

  useEffect(() => {
    fetchUsuarioData();
  }, []);

  const fetchUsuarioData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const payload = JSON.parse(atob(token.split('.')[1]));
      const id_usuario = payload.id_usuario;

      // Obtener datos del usuario
      const response = await fetch(`${API_URL}/Usuarios/ObtenerUsuario/${id_usuario}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsuarioData(data);
        setFormData({
          nombre: data.nombre || '',
          apellido1: data.apellido1 || '',
          apellido2: data.apellido2 || '',
          cargo: data.cargo || '',
          municipalidad: data.municipalidad || '',
          correo: data.correo || '',
          num_tel: data.num_tel || ''
        });

        // Obtener nombre del rol desde el backend
        await fetchRolNombre(data.id_rol, token);

        // Obtener estadísticas de solicitudes
        await fetchEstadisticas(id_usuario, token);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'No se pudieron cargar los datos del usuario'
      });
      setLoading(false);
    }
  };

  const fetchRolNombre = async (id_rol, token) => {
    try {
      const response = await fetch(`${API_URL}/Roles/ObtenerRoles/${id_rol}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRolNombre(data.nombre_rol || 'Usuario');
      }
    } catch (error) {
      console.error('Error al cargar nombre del rol:', error);
      setRolNombre('Usuario');
    }
  };

  const fetchEstadisticas = async (id_usuario, token) => {
    try {
      const response = await fetch(`${API_URL}/Solicitudes/ObtenerSolicitudesPorUsuario/${id_usuario}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const solicitudes = Array.isArray(data) ? data : [];
        
        setEstadisticas({
          solicitudesCreadas: solicitudes.length,
          solicitudesPendientes: solicitudes.filter(s => 
            s.nombre_estado?.toLowerCase().includes('pendiente')
          ).length,
          solicitudesCompletadas: solicitudes.filter(s => 
            s.nombre_estado?.toLowerCase().includes('completad') ||
            s.nombre_estado?.toLowerCase().includes('aprobad')
          ).length
        });
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditar = () => {
    setIsEditing(true);
  };

  const handleCancelar = () => {
    setIsEditing(false);
    setFormData({
      nombre: usuarioData.nombre || '',
      apellido1: usuarioData.apellido1 || '',
      apellido2: usuarioData.apellido2 || '',
      cargo: usuarioData.cargo || '',
      municipalidad: usuarioData.municipalidad || '',
      correo: usuarioData.correo || '',
      num_tel: usuarioData.num_tel || ''
    });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/Usuarios/EditarUsuario/${usuarioData.id_usuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido1: formData.apellido1,
          apellido2: formData.apellido2,
          cargo: formData.cargo,
          municipalidad: formData.municipalidad,
          correo: formData.correo,
          num_tel: formData.num_tel,
          id_rol: usuarioData.id_rol
        })
      });

      if (response.ok) {
        showNotification({
          type: 'success',
          title: 'Perfil Actualizado',
          message: 'Tus datos han sido actualizados correctamente'
        });
        
        setIsEditing(false);
        await fetchUsuarioData();
      } else {
        throw new Error('Error al actualizar perfil');
      }
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'No se pudieron guardar los cambios'
      });
    }
  };

  const handleCambiarPassword = async (e) => {
    e.preventDefault();
    
    if (passwordForm.passwordNueva !== passwordForm.passwordConfirm) {
      showNotification({
        type: 'warning',
        title: 'Contraseñas no coinciden',
        message: 'Las contraseñas nuevas no coinciden'
      });
      return;
    }

    if (passwordForm.passwordNueva.length < 8) {
      showNotification({
        type: 'warning',
        title: 'Contraseña débil',
        message: 'La contraseña debe tener al menos 8 caracteres'
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      // Primero verificar la contraseña actual haciendo login
      const loginResponse = await fetch(`${API_URL}/Usuarios/Login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          correo: usuarioData.correo,
          contrasena: passwordForm.passwordActual
        })
      });

      if (!loginResponse.ok) {
        showNotification({
          type: 'error',
          title: 'Contraseña incorrecta',
          message: 'La contraseña actual no es correcta'
        });
        return;
      }

      // Actualizar con la nueva contraseña
      const response = await fetch(`${API_URL}/Usuarios/EditarUsuario/${usuarioData.id_usuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: usuarioData.nombre,
          apellido1: usuarioData.apellido1,
          apellido2: usuarioData.apellido2,
          cargo: usuarioData.cargo,
          municipalidad: usuarioData.municipalidad,
          correo: usuarioData.correo,
          contrasena: passwordForm.passwordNueva,
          num_tel: usuarioData.num_tel,
          id_rol: usuarioData.id_rol
        })
      });

      if (response.ok) {
        showNotification({
          type: 'success',
          title: 'Contraseña Cambiada',
          message: 'Tu contraseña ha sido actualizada correctamente'
        });
        
        setShowPasswordModal(false);
        setPasswordForm({
          passwordActual: '',
          passwordNueva: '',
          passwordConfirm: ''
        });
      } else {
        throw new Error('Error al cambiar contraseña');
      }
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'No se pudo cambiar la contraseña'
      });
    }
  };

  const getInitials = () => {
    if (!usuarioData) return '?';
    const inicial1 = usuarioData.nombre?.charAt(0) || '';
    const inicial2 = usuarioData.apellido1?.charAt(0) || '';
    return `${inicial1}${inicial2}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="perfil-page">
        <Accesibilidad />
        <Header />
        <NotificationSystem />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando perfil...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!usuarioData) {
    return (
      <div className="perfil-page">
        <Accesibilidad />
        <Header />
        <NotificationSystem />
        <div className="loading-container">
          <p>No se pudo cargar la información del perfil</p>
          <button onClick={() => navigate('/')} className="btn-editar">
            Volver al inicio
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="perfil-page">
      <Accesibilidad />
      <Header />
      <NotificationSystem />

      <main className="perfil-container">
        {/* Header del Perfil */}
        <div className="perfil-header">
          <div className="perfil-avatar">
            {getInitials()}
          </div>
          
          <div className="perfil-header-info">
            <h1>{usuarioData.nombre} {usuarioData.apellido1} {usuarioData.apellido2}</h1>
            <p>{usuarioData.cargo} - {usuarioData.municipalidad}</p>
            
            <div className="perfil-badges">
              <div className="badge-rol">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                {rolNombre}
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="perfil-card full-width">
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 20V10"/>
              <path d="M12 20V4"/>
              <path d="M6 20v-6"/>
            </svg>
            Estadísticas de Actividad
          </h2>
          
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{estadisticas.solicitudesCreadas}</span>
              <span className="stat-label">Solicitudes Creadas</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{estadisticas.solicitudesPendientes}</span>
              <span className="stat-label">Pendientes</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{estadisticas.solicitudesCompletadas}</span>
              <span className="stat-label">Completadas</span>
            </div>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="perfil-content">
          {/* Información Personal */}
          <div className="perfil-card">
            <h2>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Información Personal
            </h2>

            {!isEditing ? (
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">Nombre</div>
                  <div className="info-value">{usuarioData.nombre}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Primer Apellido</div>
                  <div className="info-value">{usuarioData.apellido1}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Segundo Apellido</div>
                  <div className="info-value">{usuarioData.apellido2}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Teléfono</div>
                  <div className="info-value">{usuarioData.num_tel}</div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleGuardar} className="edit-form">
                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Primer Apellido *</label>
                  <input
                    type="text"
                    name="apellido1"
                    value={formData.apellido1}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Segundo Apellido</label>
                  <input
                    type="text"
                    name="apellido2"
                    value={formData.apellido2}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    name="num_tel"
                    value={formData.num_tel}
                    onChange={handleInputChange}
                  />
                </div>
              </form>
            )}

            <div className="form-actions">
              {!isEditing ? (
                <button className="btn-editar" onClick={handleEditar}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Editar Perfil
                </button>
              ) : (
                <>
                  <button className="btn-guardar" onClick={handleGuardar}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Guardar Cambios
                  </button>
                  <button className="btn-cancelar" onClick={handleCancelar}>
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Información Laboral */}
          <div className="perfil-card">
            <h2>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              Información Laboral
            </h2>

            {!isEditing ? (
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">Cargo</div>
                  <div className="info-value">{usuarioData.cargo}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Municipalidad</div>
                  <div className="info-value">{usuarioData.municipalidad}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Correo</div>
                  <div className="info-value">{usuarioData.correo}</div>
                </div>
              </div>
            ) : (
              <form className="edit-form">
                <div className="form-group">
                  <label>Cargo *</label>
                  <input
                    type="text"
                    name="cargo"
                    value={formData.cargo}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Municipalidad *</label>
                  <input
                    type="text"
                    name="municipalidad"
                    value={formData.municipalidad}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Correo Electrónico</label>
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleInputChange}
                    disabled
                  />
                  <small style={{color: '#666', fontSize: '0.85rem'}}>
                    El correo no se puede modificar
                  </small>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Seguridad */}
        <div className="perfil-card full-width">
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Seguridad
          </h2>

          <div className="security-section">
            <h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Contraseña
            </h3>
            <p>Mantén tu cuenta segura actualizando tu contraseña regularmente.</p>
            <button className="btn-cambiar-password" onClick={() => setShowPasswordModal(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Cambiar Contraseña
            </button>
          </div>
        </div>
      </main>

            <div className="perfil-card full-width">
  <h2>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
    Autenticación de Dos Factores
  </h2>
  
  <Config2FA />
</div>

      {/* Modal de Cambio de Contraseña */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Cambiar Contraseña</h2>
              <button className="modal-close" onClick={() => setShowPasswordModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleCambiarPassword} className="password-form">
                <div className="form-group">
                  <label>Contraseña Actual *</label>
                  <input
                    type="password"
                    name="passwordActual"
                    value={passwordForm.passwordActual}
                    onChange={handlePasswordChange}
                    required
                    placeholder="Ingresa tu contraseña actual"
                  />
                </div>

                <div className="form-group">
                  <label>Nueva Contraseña *</label>
                  <input
                    type="password"
                    name="passwordNueva"
                    value={passwordForm.passwordNueva}
                    onChange={handlePasswordChange}
                    required
                    placeholder="Mínimo 8 caracteres"
                    minLength="8"
                  />
                </div>

                <div className="form-group">
                  <label>Confirmar Nueva Contraseña *</label>
                  <input
                    type="password"
                    name="passwordConfirm"
                    value={passwordForm.passwordConfirm}
                    onChange={handlePasswordChange}
                    required
                    placeholder="Repite la nueva contraseña"
                  />
                </div>

                <div className="password-requirements">
                  <strong>Requisitos de la contraseña:</strong>
                  <ul>
                    <li className={passwordForm.passwordNueva.length >= 8 ? 'valid' : ''}>
                      Mínimo 8 caracteres
                    </li>
                    <li className={passwordForm.passwordNueva === passwordForm.passwordConfirm && passwordForm.passwordNueva ? 'valid' : ''}>
                      Las contraseñas deben coincidir
                    </li>
                  </ul>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-cancelar" onClick={() => setShowPasswordModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-guardar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Cambiar Contraseña
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

export default Perfil;