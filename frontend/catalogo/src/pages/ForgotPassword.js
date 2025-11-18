import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationSystem, { showNotification } from '../components/NotificationSystem';
import './login.css'; 

const API_URL = process.env.REACT_APP_API_URL;

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/Password/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email })
      });

      if (response.ok) {
        showNotification({
          type: 'success',
          title: 'Correo Enviado',
          message: 'Revisa tu correo para restablecer tu contraseña',
          duration: 5000
        });
        
        setTimeout(() => navigate('/login'), 3000);
      } else {
        const data = await response.json();
        showNotification({
          type: 'error',
          title: 'Error',
          message: data.error || 'No se pudo enviar el correo'
        });
      }
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Error de conexión',
        message: 'No se pudo conectar con el servidor'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <NotificationSystem />
      
      <div className="login-container">
        <div className="login-form-container">
          <div className="form-panel active" style={{ width: '100%', opacity: 1 }}>
            <div className="form-logo">
              <img src="https://reclutamiento.ifam.go.cr/UTH/Resources/Logo_4.png" alt="IFAM Logo" />
            </div>
            
            <h2>Recuperar Contraseña</h2>
            <p className="form-subtitle">
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
            </p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Correo Electrónico</label>
                <div className="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="correo@ejemplo.go.cr"
                    disabled={loading}
                  />
                </div>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
              </button>
            </form>

            <div className="form-footer">
              <button onClick={() => navigate('/login')} className="toggle-btn">
                ← Volver al inicio de sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;