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
    <div style={{ width: '100%' }}>
      {/* Estado Actual */}
      <div style={{
        padding: '20px',
        backgroundColor: twoFAEnabled ? '#d1fae5' : '#fef3c7',
        borderRadius: '12px',
        marginBottom: '24px',
        border: `2px solid ${twoFAEnabled ? '#10b981' : '#f59e0b'}`
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={twoFAEnabled ? '#10b981' : '#f59e0b'} strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <h3 style={{ 
                margin: 0, 
                color: twoFAEnabled ? '#065f46' : '#92400e', 
                fontSize: '1.2rem',
                fontWeight: '700'
              }}>
                2FA {twoFAEnabled ? 'Activado' : 'Desactivado'}
              </h3>
            </div>
            <p style={{ margin: 0, color: twoFAEnabled ? '#065f46' : '#92400e', fontSize: '0.95rem' }}>
              {twoFAEnabled 
                ? `Tu cuenta está protegida. Códigos de respaldo: ${codigosRestantes}`
                : 'Activa 2FA para mayor seguridad'
              }
            </p>
          </div>

          {/* Botón principal en el estado */}
          {!showQR && !showBackupCodes && (
            !twoFAEnabled ? (
              <button
                onClick={handleGenerarQR}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  fontFamily: 'IBM Plex Sans, sans-serif'
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
                  padding: '12px 24px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  fontFamily: 'IBM Plex Sans, sans-serif'
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
            )
          )}
        </div>
      </div>

      {/* Configuración QR */}
      {showQR && (
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          border: '2px solid #e0e0e0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}>
          <h3 style={{ 
            marginTop: 0, 
            marginBottom: '24px',
            color: '#1d2d5a',
            fontSize: '1.3rem',
            fontWeight: '700',
            fontFamily: 'IBM Plex Sans, sans-serif'
          }}>
            Configurar Autenticación de Dos Factores
          </h3>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            marginBottom: '24px'
          }}>
            {/* Columna QR */}
            <div>
              <div style={{
                padding: '16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                border: '2px solid #e0e0e0',
                marginBottom: '16px'
              }}>
                <p style={{ 
                  margin: '0 0 16px 0',
                  color: '#1d2d5a',
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}>
                  <strong>Paso 1:</strong> Escanea con Google Authenticator
                </p>
                {qrCode && (
                  <div style={{ textAlign: 'center' }}>
                    <img 
                      src={qrCode} 
                      alt="QR Code" 
                      style={{ 
                        maxWidth: '100%',
                        width: '250px',
                        height: 'auto',
                        border: '4px solid white',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                  </div>
                )}
              </div>
              
              <details style={{ 
                padding: '12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                cursor: 'pointer'
              }}>
                <summary style={{ 
                  fontWeight: '600',
                  color: '#1d2d5a',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}>
                  ¿No puedes escanear el código?
                </summary>
                <p style={{ marginTop: '12px', fontSize: '0.85rem', color: '#666', marginBottom: '8px' }}>
                  Ingresa este código manualmente:
                </p>
                <div style={{
                  padding: '12px',
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  wordBreak: 'break-all',
                  color: '#1d2d5a',
                  fontWeight: '600'
                }}>
                  {secret}
                </div>
              </details>
            </div>

            {/* Columna Verificación */}
            <div>
              <form onSubmit={handleVerificarYHabilitar}>
                <div style={{
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px',
                  border: '2px solid #e0e0e0',
                  marginBottom: '16px'
                }}>
                  <label style={{ 
                    display: 'block',
                    marginBottom: '12px',
                    fontWeight: '600',
                    color: '#1d2d5a',
                    fontSize: '0.95rem'
                  }}>
                    <strong>Paso 2:</strong> Ingresa el código de 6 dígitos
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
                      padding: '16px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '10px',
                      fontSize: '1.8rem',
                      textAlign: 'center',
                      letterSpacing: '0.8rem',
                      fontWeight: '600',
                      fontFamily: 'monospace',
                      transition: 'all 0.3s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#CEAC65';
                      e.target.style.boxShadow = '0 0 0 3px rgba(206, 172, 101, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e0e0e0';
                      e.target.style.boxShadow = 'none';
                    }}
                    autoFocus
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    type="submit"
                    disabled={verificationCode.length !== 6}
                    style={{
                      flex: 1,
                      minWidth: '150px',
                      padding: '14px 24px',
                      backgroundColor: verificationCode.length === 6 ? '#10b981' : '#d0d0d0',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: verificationCode.length === 6 ? 'pointer' : 'not-allowed',
                      opacity: verificationCode.length === 6 ? 1 : 0.6,
                      transition: 'all 0.3s ease',
                      fontFamily: 'IBM Plex Sans, sans-serif',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    onMouseOver={e => {
                      if (verificationCode.length === 6) {
                        e.target.style.backgroundColor = '#059669';
                        e.target.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseOut={e => {
                      if (verificationCode.length === 6) {
                        e.target.style.backgroundColor = '#10b981';
                        e.target.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Verificar y Activar
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelar}
                    style={{
                      flex: 1,
                      minWidth: '150px',
                      padding: '14px 24px',
                      backgroundColor: '#e0e0e0',
                      color: '#333',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontFamily: 'IBM Plex Sans, sans-serif'
                    }}
                    onMouseOver={e => e.target.style.backgroundColor = '#d0d0d0'}
                    onMouseOut={e => e.target.style.backgroundColor = '#e0e0e0'}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Códigos de Respaldo */}
      {showBackupCodes && backupCodes.length > 0 && (
        <div style={{
          backgroundColor: '#fffbf5',
          padding: '30px',
          borderRadius: '12px',
          border: '2px solid #CEAC65',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <h3 style={{ 
              margin: 0,
              color: '#92400e',
              fontSize: '1.2rem',
              fontWeight: '700',
              fontFamily: 'IBM Plex Sans, sans-serif'
            }}>
              ¡Guarda estos códigos de respaldo!
            </h3>
          </div>

          <p style={{ 
            color: '#92400e',
            marginBottom: '20px',
            lineHeight: '1.6',
            fontSize: '0.95rem'
          }}>
            Usa estos códigos si pierdes acceso a tu dispositivo de autenticación. 
            <strong> Cada código solo puede usarse una vez.</strong>
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '12px',
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '12px',
            marginBottom: '20px',
            border: '1px solid #e0e0e0'
          }}>
            {backupCodes.map((code, index) => (
              <div key={index} style={{
                padding: '12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '1rem',
                fontWeight: '600',
                textAlign: 'center',
                border: '2px solid #e0e0e0',
                color: '#1d2d5a',
                letterSpacing: '2px'
              }}>
                {code}
              </div>
            ))}
          </div>

          <button
            onClick={handleCerrarBackupCodes}
            style={{
              width: '100%',
              padding: '14px 24px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: 'IBM Plex Sans, sans-serif'
            }}
            onMouseOver={e => {
              e.target.style.backgroundColor = '#059669';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={e => {
              e.target.style.backgroundColor = '#10b981';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            He guardado mis códigos
          </button>
        </div>
      )}

      {/* Información adicional */}
      {!showQR && !showBackupCodes && (
        <div style={{
          padding: '24px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          border: '1px solid #e0e0e0'
        }}>
          <h4 style={{ 
            marginTop: 0,
            marginBottom: '12px',
            color: '#1d2d5a',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '1.1rem',
            fontWeight: '600',
            fontFamily: 'IBM Plex Sans, sans-serif'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            Acerca de 2FA
          </h4>
          <ul style={{ 
            color: '#666',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            paddingLeft: '20px',
            margin: 0
          }}>
            <li style={{ marginBottom: '8px' }}>
              La autenticación de dos factores agrega una capa extra de seguridad
            </li>
            <li style={{ marginBottom: '8px' }}>
              Necesitarás tu contraseña y un código de 6 dígitos para iniciar sesión
            </li>
            <li style={{ marginBottom: '8px' }}>
              Usa Google Authenticator, Authy o cualquier app compatible con TOTP
            </li>
            <li>
              Guarda tus códigos de respaldo en un lugar seguro
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Config2FA;