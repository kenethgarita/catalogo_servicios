import './login.css';
import React, { useState } from 'react';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    // Login
    email: '',
    password: '',
    // Registro
    nombre: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    try {
      /*
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
      const data = await response.json();
      // Guardar token y redirigir
      */
      console.log('Login:', { email: formData.email, password: formData.password });
      alert('Login exitoso!');
    } catch (error) {
      console.error('Error en login:', error);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      /*
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          password: formData.password
        })
      });
      const data = await response.json();
      */
      console.log('Registro:', { 
        nombre: formData.nombre, 
        email: formData.email, 
        password: formData.password 
      });
      alert('Registro exitoso!');
      setIsLogin(true); // Cambiar a login después de registrarse
    } catch (error) {
      console.error('Error en registro:', error);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    // Limpiar formulario al cambiar
    setFormData({
      email: '',
      password: '',
      nombre: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-image">
          {/* IMAGEN DE FONDO - Reemplaza con tu imagen */}
          <div 
            className="login-bg" 
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200')` }}
          >
            <div className="login-overlay"></div>
            <div className="login-brand">
              <img 
                src="https://www.ifam.go.cr/FrontEnd/assets/img/header.png" 
                alt="IFAM Logo" 
                className="brand-logo"
              />
              <h1>Sistema de Gestión IFAM</h1>
              <p>Instituto de Fomento y Asesoría Municipal</p>
            </div>
          </div>
        </div>

        <div className="login-form-container">
          <div className={`form-wrapper ${!isLogin ? 'register-mode' : ''}`}>
            {/* Formulario de Login */}
            <div className={`form-panel login-panel ${isLogin ? 'active' : ''}`}>
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
                      placeholder="correo@ejemplo.com"
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

                <div className="form-options">
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span>Recordarme</span>
                  </label>
                  <a href="#" className="forgot-link">¿Olvidaste tu contraseña?</a>
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

            {/* Formulario de Registro */}
            <div className={`form-panel register-panel ${!isLogin ? 'active' : ''}`}>
              <h2>Crear Cuenta</h2>
              <p className="form-subtitle">Únete a nosotros</p>

              <form onSubmit={handleRegisterSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="register-nombre">Nombre Completo</label>
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
                      placeholder="Juan Pérez"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="register-email">Correo Electrónico</label>
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
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="register-password">Contraseña</label>
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
                  <label htmlFor="register-confirm">Confirmar Contraseña</label>
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
        </div>
      </div>
    </div>
  );
}

export default Login;