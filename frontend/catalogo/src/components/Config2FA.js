import React, { useState, useEffect } from 'react';
import { showNotification } from './NotificationSystem';

const API_URL = process.env.REACT_APP_API_URL;

function Config2FA() {
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [codigosRestantes, setCodigosRestantes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verificarEstado2FA();
  }, []);

  const verificarEstado2FA = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/TwoFactor/estado`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📊 Estado 2FA:', data);
        setTwoFAEnabled(data.habilitado);
        setCodigosRestantes(data.codigosRespaldoRestantes || 0);
      }
    } catch (error) {
      console.error('Error al verificar estado 2FA:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerarQR = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/TwoFactor/generar-qr`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ QR generado');
        setQrCode(data.qrCode);
        setSecret(data.secret);
        setShowQR(true);
      } else {
        const error = await response.json();
        showNotification({
          type: 'error',
          title: 'Error',
          message: error.error || 'No se pudo generar el código QR'
        });
      }
    } catch (error) {
      console.error('Error al generar QR:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'No se pudo conectar con el servidor'
      });
    }
  };

const handleVerificarYHabilitar = async (e) => {
    e.preventDefault();

    if (!verificationCode || verificationCode.length !== 6) {
      showNotification({
        type: 'warning',
        title: 'Código incompleto',
        message: 'Debes ingresar el código de 6 dígitos'
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/TwoFactor/habilitar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ codigo: verificationCode })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ 2FA habilitado - respuesta completa:', data);
        
        // ✅ ACTUALIZAR ESTADO INMEDIATAMENTE con la respuesta del backend
        if (data.habilitado === true || data.habilitado === 1) {
          setTwoFAEnabled(true);
          console.log('✅ Estado 2FA actualizado a: true');
        }
        
        setBackupCodes(data.backupCodes || []);
        setShowBackupCodes(true);
        setShowQR(false);
        setVerificationCode('');
        setCodigosRestantes(data.backupCodes?.length || 0);
        
        showNotification({
          type: 'success',
          title: '🔐 2FA Habilitado',
          message: 'Guarda tus códigos de respaldo en un lugar seguro',
          duration: 5000
        });

        // Verificar estado como respaldo (después de 500ms)
        setTimeout(() => {
          verificarEstado2FA();
        }, 500);

      } else {
        const error = await response.json();
        showNotification({
          type: 'error',
          title: 'Código Incorrecto',
          message: error.error || 'El código ingresado no es válido. Asegúrate que la hora de tu dispositivo esté sincronizada.'
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

  const handleDeshabilitar = async () => {
    const codigo = prompt('Ingresa tu código 2FA actual o un código de respaldo para confirmar:');
    
    if (!codigo) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/TwoFactor/deshabilitar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ codigo })
      });

      if (response.ok) {
        setTwoFAEnabled(false);
        setBackupCodes([]);
        setShowBackupCodes(false);
        
        showNotification({
          type: 'success',
          title: '2FA Deshabilitado',
          message: 'La autenticación de dos factores ha sido desactivada'
        });

        verificarEstado2FA();
      } else {
        const error = await response.json();
        showNotification({
          type: 'error',
          title: 'Error',
          message: error.error || 'Código incorrecto'
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

  const handleCerrarBackupCodes = () => {
    setShowBackupCodes(false);
    setBackupCodes([]);
  };

  const handleCancelar = () => {
    setShowQR(false);
    setVerificationCode('');
    setQrCode('');
    setSecret('');
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f0f0f0',
          borderTop: '4px solid #1d2d5a',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Estado Actual */}
      <div style={{
        padding: '20px',
        backgroundColor: twoFAEnabled ? '#d1fae5' : '#fef3c7',
        borderRadius: '12px',
        marginBottom: '24px',
        border: `2px solid ${twoFAEnabled ? '#10b981' : '#f59e0b'}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={twoFAEnabled ? '#10b981' : '#f59e0b'} strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <h3 style={{ margin: 0, color: twoFAEnabled ? '#065f46' : '#92400e', fontSize: '1.2rem' }}>
            2FA {twoFAEnabled ? 'Activado' : 'Desactivado'}
          </h3>
        </div>
        <p style={{ margin: 0, color: twoFAEnabled ? '#065f46' : '#92400e', fontSize: '0.95rem' }}>
          {twoFAEnabled 
            ? `Tu cuenta está protegida con autenticación de dos factores. Códigos de respaldo restantes: ${codigosRestantes}`
            : 'Activa 2FA para agregar una capa adicional de seguridad a tu cuenta'
          }
        </p>
      </div>

      {/* Botones principales */}
      {!showQR && !showBackupCodes && (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {!twoFAEnabled ? (
            <button
              onClick={handleGenerarQR}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '14px 24px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={e => e.target.style.backgroundColor = '#059669'}
              onMouseOut={e => e.target.style.backgroundColor = '#10b981'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Activar 2FA
            </button>
          ) : (
            <button
              onClick={handleDeshabilitar}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '14px 24px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={e => e.target.style.backgroundColor = '#dc2626'}
              onMouseOut={e => e.target.style.backgroundColor = '#ef4444'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              Desactivar 2FA
            </button>
          )}
        </div>
      )}

      {/* Modal QR */}
      {showQR && (
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          border: '2px solid #e0e0e0'
        }}>
          <h3 style={{ marginTop: 0, color: '#1d2d5a' }}>Configurar Autenticación de Dos Factores</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <p style={{ marginBottom: '16px', color: '#666' }}>
              <strong>Paso 1:</strong> Escanea este código QR con Google Authenticator
            </p>
            {qrCode && (
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <img src={qrCode} alt="QR Code" style={{ maxWidth: '250px', border: '2px solid #e0e0e0', borderRadius: '8px' }} />
              </div>
            )}
            
            <details style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: '600', color: '#1d2d5a' }}>
                ¿No puedes escanear el código?
              </summary>
              <p style={{ marginTop: '12px', fontSize: '0.9rem', color: '#666' }}>
                Ingresa este código manualmente en tu app:
              </p>
              <code style={{
                display: 'block',
                padding: '12px',
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                wordBreak: 'break-all',
                marginTop: '8px'
              }}>
                {secret}
              </code>
            </details>
          </div>

          <form onSubmit={handleVerificarYHabilitar}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                <strong>Paso 2:</strong> Ingresa el código de 6 dígitos de tu app
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  if (value.length <= 6) setVerificationCode(value);
                }}
                placeholder="000000"
                maxLength="6"
                style={{
                  width: '100%',
                  padding: '14px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1.5rem',
                  textAlign: 'center',
                  letterSpacing: '0.5rem',
                  fontWeight: '600',
                  fontFamily: 'monospace'
                }}
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={handleCancelar}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  backgroundColor: '#e0e0e0',
                  color: '#333',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={verificationCode.length !== 6}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  backgroundColor: verificationCode.length === 6 ? '#10b981' : '#d0d0d0',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: verificationCode.length === 6 ? 'pointer' : 'not-allowed',
                  opacity: verificationCode.length === 6 ? 1 : 0.6
                }}
              >
                Verificar y Activar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Códigos de Respaldo */}
      {showBackupCodes && backupCodes.length > 0 && (
        <div style={{
          backgroundColor: '#fffbf5',
          padding: '24px',
          borderRadius: '12px',
          border: '2px solid #CEAC65'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <h3 style={{ margin: 0, color: '#92400e' }}>¡Guarda estos códigos de respaldo!</h3>
          </div>

          <p style={{ color: '#92400e', marginBottom: '16px' }}>
            Usa estos códigos si pierdes acceso a tu dispositivo de autenticación. 
            <strong> Cada código solo puede usarse una vez.</strong>
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '12px',
            padding: '16px',
            backgroundColor: 'white',
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            {backupCodes.map((code, index) => (
              <div key={index} style={{
                padding: '12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '1rem',
                fontWeight: '600',
                textAlign: 'center',
                border: '1px solid #e0e0e0'
              }}>
                {code}
              </div>
            ))}
          </div>

          <button
            onClick={handleCerrarBackupCodes}
            style={{
              width: '100%',
              padding: '12px 24px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            He guardado mis códigos
          </button>
        </div>
      )}

      {/* Información adicional */}
      {!showQR && !showBackupCodes && (
        <div style={{
          marginTop: '24px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          border: '1px solid #e0e0e0'
        }}>
          <h4 style={{ marginTop: 0, color: '#1d2d5a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            Acerca de 2FA
          </h4>
          <ul style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6' }}>
            <li>La autenticación de dos factores agrega una capa extra de seguridad</li>
            <li>Necesitarás tu contraseña y un código de 6 dígitos para iniciar sesión</li>
            <li>Usa Google Authenticator, Authy o cualquier app compatible con TOTP</li>
            <li>Guarda tus códigos de respaldo en un lugar seguro</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Config2FA;