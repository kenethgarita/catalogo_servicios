import './login.css';
import React, { useState } from 'react';
import NotificationSystem, { showNotification } from '../components/NotificationSystem';
import { useNavigate, useLocation } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const [isLogin, setIsLogin] = useState(true);
  
  // ✅ NUEVO: Estado para 2FA
  const [show2FA, setShow2FA] = useState(false);
  const [tempUserId, setTempUserId] = useState(null);
  const [codigo2FA, setCodigo2FA] = useState('');
  
  const [formData, setFormData] = useState({
    // Login
    email: '',
    password: '',
    // Registro
    nombre: '',
    apellido1: '',
    apellido2: '',
    cargo: '',
    municipalidad: '',
    num_tel: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // ✅ NUEVO: Manejador para el código 2FA
  const handleCodigo2FAChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Solo números
    if (value.length <= 6) {
      setCodigo2FA(value);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_URL}/Usuarios/Login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo: formData.email,
          contrasena: formData.password
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // ✅ NUEVO: Verificar si requiere 2FA
        if (data.requiere2FA) {
          setTempUserId(data.id_usuario);
          setShow2FA(true);
          showNotification({
            type: 'info',
            title: 'Verificación Requerida',
            message: 'Ingresa el código de autenticación de dos factores',
            duration: 3000
          });
          return;
        }

        // Login normal sin 2FA
        localStorage.setItem('token', data.token);
        
        showNotification({
          type: 'success',
          title: '¡Bienvenido!',
          message: 'Inicio de sesión exitoso',
          duration: 2000
        });

        setTimeout(() => {
          if (from !== '/' && from !== '/login') {
            navigate(from, { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        }, 1500);
        
      } else {
        showNotification({
          type: 'error',
          title: 'Error de acceso',
          message: 'Credenciales incorrectas. Intenta de nuevo.'
        });
      }
    } catch (error) {
      console.error('Error en login:', error);
      showNotification({
        type: 'error',
        title: 'Error de conexión',
        message: 'No se pudo conectar con el servidor'
      });
    }
  };

  // ✅ NUEVO: Verificar código 2FA
  const handleVerificar2FA = async (e) => {
    e.preventDefault();

    if (codigo2FA.length !== 6) {
      showNotification({
        type: 'warning',
        title: 'Código incompleto',
        message: 'El código debe tener 6 dígitos'
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/TwoFactor/verificar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: tempUserId,
          codigo: codigo2FA
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.verificado) {
          // Hacer login nuevamente para obtener el token
          const loginResponse = await fetch(`${API_URL}/Usuarios/Login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              correo: formData.email,
              contrasena: formData.password
            })
          });

          if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            
            // Esta vez no debería pedir 2FA porque ya fue verificado
            if (loginData.token) {
              localStorage.setItem('token', loginData.token);
              
              showNotification({
                type: 'success',
                title: '✓ Verificación Exitosa',
                message: data.tipo === 'backup' 
                  ? `Código de respaldo usado. Quedan ${data.codigosRestantes} códigos`
                  : 'Autenticación completada',
                duration: 3000
              });

              setTimeout(() => {
                if (from !== '/' && from !== '/login') {
                  navigate(from, { replace: true });
                } else {
                  navigate('/', { replace: true });
                }
              }, 1500);
            }
          }
        }
      } else {
        const errorData = await response.json();
        showNotification({
          type: 'error',
          title: 'Código Incorrecto',
          message: errorData.error || 'El código ingresado no es válido'
        });
        setCodigo2FA(''); // Limpiar el código
      }
    } catch (error) {
      console.error('Error al verificar 2FA:', error);
      showNotification({
        type: 'error',
        title: 'Error de verificación',
        message: 'No se pudo verificar el código. Intenta de nuevo.'
      });
    }
  };

  // ✅ NUEVO: Cancelar 2FA
  const handleCancelar2FA = () => {
    setShow2FA(false);
    setTempUserId(null);
    setCodigo2FA('');
    setFormData({ ...formData, password: '' });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      showNotification({
        type: 'warning',
        title: 'Contraseñas diferentes',
        message: 'Las contraseñas ingresadas no coinciden'
      });
      return;
    }

    if (formData.password.length < 8) {
      showNotification({
        type: 'warning',
        title: 'Contraseña débil',
        message: 'La contraseña debe tener al menos 8 caracteres'
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/Usuarios/CrearUsuario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido1: formData.apellido1,
          apellido2: formData.apellido2,
          cargo: formData.cargo,
          municipalidad: formData.municipalidad,
          correo: formData.email,
          contrasena: formData.password,
          num_tel: formData.num_tel
        })
      });
      
      if (response.ok) {
        showNotification({
          type: 'success',
          title: 'Registro completado',
          message: 'Tu cuenta ha sido creada. Por favor inicia sesión.',
          duration: 4000
        });
        
        setTimeout(() => {
          setIsLogin(true);
        }, 2000);
      } else {
        const data = await response.json();
        showNotification({
          type: 'error',
          title: 'Error en registro',
          message: data.message || 'No se pudo completar el registro'
        });
      }
    } catch (error) {
      console.error('Error en registro:', error);
      showNotification({
        type: 'error',
        title: 'Error de conexión',
        message: 'No se pudo conectar con el servidor'
      });
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setShow2FA(false);
    setTempUserId(null);
    setCodigo2FA('');
    setFormData({
      email: '',
      password: '',
      nombre: '',
      apellido1: '',
      apellido2: '',
      cargo: '',
      municipalidad: '',
      num_tel: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="login-page">
      <NotificationSystem />
      
      <div className="login-container">
        <div className="login-form-container">
          {/* ✅ NUEVO: Formulario de 2FA */}
          {show2FA ? (
            <div className="form-panel active" style={{ width: '100%', opacity: 1 }}>
              <div className="form-logo">
                <img 
                  src="https://reclutamiento.ifam.go.cr/UTH/Resources/Logo_4.png" 
                  alt="IFAM Logo" 
                />
              </div>
              
              <h2>Verificación de Dos Factores</h2>
              <p className="form-subtitle">Ingresa el código de 6 dígitos de tu aplicación de autenticación</p>

              <form onSubmit={handleVerificar2FA} className="auth-form">
                <div className="form-group">
                  <label htmlFor="codigo-2fa">Código de Verificación</label>
                  <div className="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    <input
                      type="text"
                      id="codigo-2fa"
                      value={codigo2FA}
                      onChange={handleCodigo2FAChange}
                      required
                      placeholder="000000"
                      maxLength="6"
                      style={{ 
                        fontSize: '1.5rem', 
                        letterSpacing: '0.5rem',
                        textAlign: 'center',
                        fontWeight: '600'
                      }}
                      autoComplete="off"
                      autoFocus
                    />
                  </div>
                  <small style={{
                    display: 'block',
                    marginTop: '8px',
                    color: '#666',
                    fontSize: '0.85rem',
                    textAlign: 'center'
                  }}>
                    También puedes usar un código de respaldo
                  </small>
                </div>

                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={codigo2FA.length !== 6}
                  style={{
                    opacity: codigo2FA.length === 6 ? 1 : 0.6,
                    cursor: codigo2FA.length === 6 ? 'pointer' : 'not-allowed'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Verificar Código
                </button>

                <button 
                  type="button" 
                  onClick={handleCancelar2FA}
                  className="btn-submit"
                  style={{
                    marginTop: '12px',
                    background: 'transparent',
                    color: '#666',
                    border: '2px solid #e0e0e0'
                  }}
                >
                  Cancelar
                </button>
              </form>

              <div className="form-footer">
                <p style={{ fontSize: '0.85rem', color: '#666', textAlign: 'center' }}>
                  💡 Tip: Los códigos de respaldo son de 8 caracteres
                </p>
              </div>
            </div>
          ) : (
            // Formularios originales de Login y Registro
            <div className={`form-wrapper ${!isLogin ? 'register-mode' : ''}`}>
              {/* Formulario de Login */}
              <div className={`form-panel login-panel ${isLogin ? 'active' : ''}`}>
                <div className="form-logo">
                  <img 
                    src="https://reclutamiento.ifam.go.cr/UTH/Resources/Logo_4.png" 
                    alt="IFAM Logo" 
                  />
                </div>
                
                <h2>Iniciar Sesión</h2>
                <p className="form-subtitle">Bienvenido de nuevo</p>

                <form onSubmit={handleLoginSubmit} className="auth-form">
                  <div className="form-group">
                    <label htmlFor="login-email">Correo Electrónico</label>
                    <div className="input-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                      <input
                        type="email"
                        id="login-email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="correo@ejemplo.go.cr"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="login-password">Contraseña</label>
                    <div className="input-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      <input
                        type="password"
                        id="login-password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-submit">
                    Iniciar Sesión
                  </button>
                </form>

                <div className="form-footer">
                  <p>¿No tienes una cuenta? 
                    <button onClick={toggleForm} className="toggle-btn">
                      Regístrate aquí
                    </button>
                  </p>
                </div>
              </div>

              {/* Formulario de Registro (sin cambios) */}
              <div className={`form-panel register-panel ${!isLogin ? 'active' : ''}`}>
                <div className="form-logo">
                  <img 
                    src="https://reclutamiento.ifam.go.cr/UTH/Resources/Logo_4.png" 
                    alt="IFAM Logo" 
                  />
                </div>

                <h2>Crear Cuenta</h2>
                <p className="form-subtitle">Únete a nosotros</p>

                <form onSubmit={handleRegisterSubmit} className="auth-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="register-nombre">Nombre *</label>
                      <div className="input-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                        <input
                          type="text"
                          id="register-nombre"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleInputChange}
                          required
                          placeholder="Juan"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="register-apellido1">Primer Apellido *</label>
                      <div className="input-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                        <input
                          type="text"
                          id="register-apellido1"
                          name="apellido1"
                          value={formData.apellido1}
                          onChange={handleInputChange}
                          required
                          placeholder="Pérez"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="register-apellido2">Segundo Apellido</label>
                      <div className="input-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                        <input
                          type="text"
                          id="register-apellido2"
                          name="apellido2"
                          value={formData.apellido2}
                          onChange={handleInputChange}
                          placeholder="García"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="register-telefono">Teléfono</label>
                      <div className="input-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                        <input
                          type="tel"
                          id="register-telefono"
                          name="num_tel"
                          value={formData.num_tel}
                          onChange={handleInputChange}
                          placeholder="2222-2222"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="register-cargo">Cargo *</label>
                      <div className="input-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                        </svg>
                        <input
                          type="text"
                          id="register-cargo"
                          name="cargo"
                          value={formData.cargo}
                          onChange={handleInputChange}
                          required
                          placeholder="Ej: Desarrollador"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="register-municipalidad">Municipalidad *</label>
                      <div className="input-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                          <polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                        <input
                          type="text"
                          id="register-municipalidad"
                          name="municipalidad"
                          value={formData.municipalidad}
                          onChange={handleInputChange}
                          required
                          placeholder="Ej: San José"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-email">Correo Electrónico *</label>
                    <div className="input-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                      <input
                        type="email"
                        id="register-email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="correo@ejemplo.go.cr"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="register-password">Contraseña *</label>
                      <div className="input-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                        <input
                          type="password"
                          id="register-password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          placeholder="Mínimo 8 caracteres"
                          minLength="8"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="register-confirm">Confirmar Contraseña *</label>
                      <div className="input-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                        <input
                          type="password"
                          id="register-confirm"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                          placeholder="Repite tu contraseña"
                        />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn-submit">
                    Crear Cuenta
                  </button>
                </form>

                <div className="form-footer">
                  <p>¿Ya tienes una cuenta? 
                    <button onClick={toggleForm} className="toggle-btn">
                      Inicia sesión aquí
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;