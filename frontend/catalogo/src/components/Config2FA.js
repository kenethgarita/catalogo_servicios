import React, { useState, useEffect } from 'react';
import './Config2FA.css';
import { showNotification } from './NotificationSystem';

const API_URL = process.env.REACT_APP_API_URL;

function Config2FA() {
  const [estado2FA, setEstado2FA] = useState({
    habilitado: false,
    codigosRespaldo: 0
  });
  const [qrCode, setQrCode] = useState(null);
  const [codigoVerificacion, setCodigoVerificacion] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [mostrandoQR, setMostrandoQR] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEstado2FA();
  }, []);

  const fetchEstado2FA = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/TwoFactor/estado`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setEstado2FA({
          habilitado: data.habilitado,
          codigosRespaldo: data.codigosRespaldoRestantes
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar estado 2FA:', error);
      setLoading(false);
    }
  };

  const handleGenerarQR = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/TwoFactor/generar-qr`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setQrCode(data.qrCode);
        setMostrandoQR(true);
        
        showNotification({
          type: 'info',
          title: 'Código QR Generado',
          message: 'Escanea el código con Google Authenticator'
        });
      }
    } catch (error) {
      console.error('Error al generar QR:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'No se pudo generar el código QR'
      });
    }
  };

  const handleHabilitar2FA = async (e) => {
    e.preventDefault();

    if (!codigoVerificacion || codigoVerificacion.length !== 6) {
      showNotification({
        type: 'warning',
        title: 'Código incompleto',
        message: 'Ingresa el código de 6 dígitos'
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/TwoFactor/habilitar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ codigo: codigoVerificacion })
      });

      if (response.ok) {
        const data = await response.json();
        setBackupCodes(data.backupCodes);
        
        showNotification({
          type: 'success',
          title: '🔒 2FA Habilitado',
          message: 'Autenticación de dos factores activada correctamente',
          duration: 4000
        });

        setMostrandoQR(false);
        setCodigoVerificacion('');
        fetchEstado2FA();
      } else {
        showNotification({
          type: 'error',
          title: 'Código incorrecto',
          message: 'Verifica el código e intenta de nuevo'
        });
      }
    } catch (error) {
      console.error('Error al habilitar 2FA:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'No se pudo habilitar 2FA'
      });
    }
  };

  const handleDeshabilitar2FA = async () => {
    const codigo = prompt('Ingresa un código de verificación o código de respaldo para deshabilitar 2FA:');
    
    if (!codigo) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/TwoFactor/deshabilitar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ codigo })
      });

      if (response.ok) {
        showNotification({
          type: 'success',
          title: '2FA Deshabilitado',
          message: 'Autenticación de dos factores desactivada'
        });
        setBackupCodes([]);
        fetchEstado2FA();
      } else {
        showNotification({
          type: 'error',
          title: 'Código incorrecto',
          message: 'No se pudo deshabilitar 2FA'
        });
      }
    } catch (error) {
      console.error('Error al deshabilitar 2FA:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'No se pudo deshabilitar 2FA'
      });
    }
  };

  const handleCopiarCodigos = () => {
    const texto = backupCodes.join('\n');
    navigator.clipboard.writeText(texto);
    showNotification({
      type: 'success',
      title: 'Códigos Copiados',
      message: 'Los códigos de respaldo han sido copiados al portapapeles'
    });
  };

  if (loading) {
    return (
      <div className="config-2fa">
        <p>Cargando configuración 2FA...</p>
      </div>
    );
  }

  return (
    <div className="config-2fa">
      <h3>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        Autenticación de Dos Factores
      </h3>

      <p className="config-2fa-description">
        Protege tu cuenta con una capa adicional de seguridad. Necesitarás tu contraseña 
        y un código de verificación de Google Authenticator para iniciar sesión.
      </p>

      {!estado2FA.habilitado ? (
        <div className={`config-2fa-status disabled`}>
          <div className="status-info">
            <div className="status-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display: 'inline', marginRight: '8px'}}>
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              2FA Deshabilitado
            </div>
            <div className="status-subtitle">
              Tu cuenta no está protegida con autenticación de dos factores
            </div>
          </div>
        </div>
      ) : (
        <div className={`config-2fa-status enabled`}>
          <div className="status-info">
            <div className="status-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display: 'inline', marginRight: '8px'}}>
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              2FA Habilitado
            </div>
            <div className="status-subtitle">
              Tu cuenta está protegida • Códigos de respaldo: {estado2FA.codigosRespaldo}
            </div>
          </div>
        </div>
      )}

      {!estado2FA.habilitado ? (
        <>
          {!mostrandoQR ? (
            <div>
              <div className="instructions-list">
                <strong>Para habilitar 2FA necesitarás:</strong>
                <ol>
                  <li>
                    <strong>Google Authenticator</strong> instalado en tu dispositivo móvil
                    <br/>
                    <small style={{color: '#666'}}>
                      (disponible en 
                      <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" target="_blank" rel="noopener noreferrer" style={{color: '#3b82f6', marginLeft: '4px'}}>
                        Android
                      </a> y 
                      <a href="https://apps.apple.com/app/google-authenticator/id388497605" target="_blank" rel="noopener noreferrer" style={{color: '#3b82f6', marginLeft: '4px'}}>
                        iOS
                      </a>)
                    </small>
                  </li>
                  <li>Escanear el código QR que generaremos</li>
                  <li>Verificar el código de 6 dígitos generado por la app</li>
                </ol>
              </div>

              <button onClick={handleGenerarQR} className="btn-2fa btn-2fa-enable">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <rect x="7" y="7" width="3" height="3"/>
                  <rect x="14" y="7" width="3" height="3"/>
                  <rect x="7" y="14" width="3" height="3"/>
                  <rect x="14" y="14" width="3" height="3"/>
                </svg>
                Comenzar Configuración
              </button>
            </div>
          ) : (
            <div>
              <div className="qr-section">
                <h4>Paso 1: Escanea este código QR</h4>
                <img src={qrCode} alt="Código QR 2FA" className="qr-code-image" />
                <p style={{fontSize: '0.9rem', color: '#666', margin: '12px 0 0 0'}}>
                  Abre Google Authenticator y escanea este código QR
                </p>
              </div>

              <form onSubmit={handleHabilitar2FA} className="verification-form">
                <h4>Paso 2: Ingresa el código de verificación</h4>
                <input
                  type="text"
                  value={codigoVerificacion}
                  onChange={(e) => setCodigoVerificacion(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength="6"
                  className="code-input"
                  autoFocus
                />
                <button type="submit" className="btn-2fa btn-2fa-verify">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Verificar y Activar 2FA
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setMostrandoQR(false);
                    setCodigoVerificacion('');
                    setQrCode(null);
                  }}
                  className="btn-2fa btn-2fa-cancel"
                >
                  Cancelar
                </button>
              </form>
            </div>
          )}
        </>
      ) : (
        <div>
          <button onClick={handleDeshabilitar2FA} className="btn-2fa btn-2fa-disable">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
            </svg>
            Deshabilitar 2FA
          </button>
          
          <p style={{marginTop: '16px', fontSize: '0.9rem', color: '#666'}}>
            ⚠️ Al deshabilitar 2FA, tu cuenta volverá a estar protegida solo por contraseña.
          </p>
        </div>
      )}

      {backupCodes.length > 0 && (
        <div className="backup-codes-section">
          <h4>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            Códigos de Respaldo
          </h4>
          <p className="backup-codes-warning">
            <strong>¡MUY IMPORTANTE!</strong> Guarda estos códigos en un lugar seguro. 
            Cada código puede usarse <strong>una sola vez</strong> si pierdes acceso a Google Authenticator.
          </p>
          <div className="backup-codes-grid">
            {backupCodes.map((code, index) => (
              <div key={index} className="backup-code">
                {code}
              </div>
            ))}
          </div>
          <button 
            onClick={handleCopiarCodigos}
            className="btn-2fa btn-2fa-enable"
            style={{marginTop: '16px', width: '100%'}}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            Copiar Todos los Códigos
          </button>
        </div>
      )}
    </div>
  );
}

export default Config2FA;