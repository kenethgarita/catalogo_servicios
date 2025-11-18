import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NotificationSystem, { showNotification } from '../components/NotificationSystem';
import './login.css';

const API_URL = process.env.REACT_APP_API_URL;

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showNotification({
        type: 'warning',
        title: 'Contraseñas no coinciden',
        message: 'Las contraseñas ingresadas no son iguales'
      });
      return;
    }

    if (password.length < 8) {
      showNotification({
        type: 'warning',
        title: 'Contraseña débil',
        message: 'La contraseña debe tener al menos 8 caracteres'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/Password/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        showNotification({
          type: 'success',
          title: 'Contraseña Restablecida',
          message: 'Tu contraseña ha sido actualizada correctamente',
          duration: 4000
        });
        
        setTimeout(() => navigate('/login'), 3000);
      } else {
        const data = await response.json();
        showNotification({
          type: 'error',
          title: 'Error',
          message: data.error || 'No se pudo restablecer la contraseña'
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
            
            <h2>Nueva Contraseña</h2>
            <p className="form-subtitle">Ingresa tu nueva contraseña</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Nueva Contraseña</label>
                <div className="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Mínimo 8 caracteres"
                    minLength="8"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Confirmar Contraseña</label>
                <div className="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Repite la contraseña"
                    disabled={loading}
                  />
                </div>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Restablecer Contraseña'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;