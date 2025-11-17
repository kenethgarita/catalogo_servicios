import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import crypto from 'crypto';
import { connectDB } from '../config/db.js';
import sql from 'mssql';

/**
 * Generar código QR para configurar 2FA
 */
export const generarQR2FA = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const id_usuario = payload.id_usuario;

    // Obtener información del usuario
    const pool = await connectDB();
    const result = await pool
      .request()
      .input('id_usuario', sql.Int, id_usuario)
      .query('SELECT correo FROM Usuario WHERE id_usuario = @id_usuario');

    if (!result.recordset.length) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const correo = result.recordset[0].correo;

    // Generar secret
    const secret = speakeasy.generateSecret({
      name: `IFAM (${correo})`,
      issuer: 'IFAM - Catálogo de Servicios'
    });

    // Guardar secret temporal (aún no habilitado)
    await pool
      .request()
      .input('id_usuario', sql.Int, id_usuario)
      .input('secret', sql.NVarChar, secret.base32)
      .query(`
        UPDATE Usuario 
        SET twofa_secret = @secret 
        WHERE id_usuario = @id_usuario
      `);

    // Generar código QR
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    res.json({
      qrCode: qrCodeUrl,
      secret: secret.base32, // Para ingreso manual
      mensaje: 'Escanea el código QR con Google Authenticator'
    });

  } catch (error) {
    console.error('Error al generar QR 2FA:', error);
    res.status(500).json({ error: 'Error al generar código QR' });
  }
};

/**
 * Verificar código y habilitar 2FA
 */
export const habilitarYVerificar2FA = async (req, res) => {
  try {
    const { codigo } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const id_usuario = payload.id_usuario;

    const pool = await connectDB();
    const result = await pool
      .request()
      .input('id_usuario', sql.Int, id_usuario)
      .query('SELECT twofa_secret FROM Usuario WHERE id_usuario = @id_usuario');

    if (!result.recordset.length || !result.recordset[0].twofa_secret) {
      return res.status(400).json({ error: 'No hay configuración 2FA pendiente' });
    }

    const secret = result.recordset[0].twofa_secret;

    // Verificar código
    const verificado = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: codigo,
      window: 2 // Permite 2 códigos antes y después (60 segundos de margen)
    });

    if (!verificado) {
      return res.status(401).json({ error: 'Código incorrecto' });
    }

    // Generar códigos de respaldo
    const backupCodes = Array.from({ length: 10 }, () => 
      crypto.randomBytes(4).toString('hex').toUpperCase()
    );

    // Habilitar 2FA
    await pool
      .request()
      .input('id_usuario', sql.Int, id_usuario)
      .input('backup_codes', sql.NVarChar, JSON.stringify(backupCodes))
      .query(`
        UPDATE Usuario 
        SET twofa_enabled = 1,
            twofa_backup_codes = @backup_codes
        WHERE id_usuario = @id_usuario
      `);

    res.json({
      mensaje: '2FA habilitado correctamente',
      backupCodes: backupCodes,
      advertencia: 'Guarda estos códigos de respaldo en un lugar seguro'
    });

  } catch (error) {
    console.error('Error al habilitar 2FA:', error);
    res.status(500).json({ error: 'Error al habilitar 2FA' });
  }
};

/**
 * Verificar código 2FA durante login
 */
export const verificar2FA = async (req, res) => {
  try {
    const { id_usuario, codigo } = req.body;

    console.log('🔐 Verificando 2FA para usuario:', id_usuario);
    console.log('📱 Código recibido:', codigo);

    const pool = await connectDB();
    const result = await pool
      .request()
      .input('id_usuario', sql.Int, id_usuario)
      .query(`
        SELECT twofa_secret, twofa_backup_codes 
        FROM Usuario 
        WHERE id_usuario = @id_usuario AND twofa_enabled = 1
      `);

    if (!result.recordset.length) {
      console.log('❌ Usuario no tiene 2FA habilitado');
      return res.status(400).json({ error: 'Usuario no tiene 2FA habilitado' });
    }

    const { twofa_secret, twofa_backup_codes } = result.recordset[0];
    const backupCodes = twofa_backup_codes ? JSON.parse(twofa_backup_codes) : [];

    console.log('🔑 Secret disponible:', !!twofa_secret);
    console.log('🎫 Códigos de respaldo disponibles:', backupCodes.length);

    // ✅ PRIMERO: Verificar si es un código de respaldo
    if (backupCodes.includes(codigo.toUpperCase())) {
      console.log('✅ Código de respaldo válido');
      
      // Remover código usado
      const nuevosBackupCodes = backupCodes.filter(c => c !== codigo.toUpperCase());
      
      await pool
        .request()
        .input('id_usuario', sql.Int, id_usuario)
        .input('backup_codes', sql.NVarChar, JSON.stringify(nuevosBackupCodes))
        .query(`
          UPDATE Usuario 
          SET twofa_backup_codes = @backup_codes
          WHERE id_usuario = @id_usuario
        `);

      return res.json({ 
        verificado: true,
        tipo: 'backup',
        codigosRestantes: nuevosBackupCodes.length
      });
    }

    // ✅ SEGUNDO: Verificar código TOTP normal (solo si tiene 6 dígitos)
    if (codigo.length === 6 && /^\d{6}$/.test(codigo)) {
      console.log('🔢 Intentando verificar código TOTP');
      
      const verificado = speakeasy.totp.verify({
        secret: twofa_secret,
        encoding: 'base32',
        token: codigo,
        window: 2 // Permite 2 códigos antes y después (60 segundos de margen)
      });

      console.log('🔍 Resultado verificación TOTP:', verificado);

      if (!verificado) {
        return res.status(401).json({ error: 'Código incorrecto' });
      }

      return res.json({ 
        verificado: true,
        tipo: 'totp'
      });
    }

    // Si llegamos aquí, el código no es válido
    console.log('❌ Código no válido - no es TOTP ni backup');
    return res.status(401).json({ error: 'Código incorrecto' });

  } catch (error) {
    console.error('❌ Error al verificar 2FA:', error);
    res.status(500).json({ error: 'Error al verificar código' });
  }
};

/**
 * Deshabilitar 2FA
 */
export const deshabilitar2FA = async (req, res) => {
  try {
    const { codigo } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const id_usuario = payload.id_usuario;

    const pool = await connectDB();
    const result = await pool
      .request()
      .input('id_usuario', sql.Int, id_usuario)
      .query(`
        SELECT twofa_secret, twofa_backup_codes 
        FROM Usuario 
        WHERE id_usuario = @id_usuario AND twofa_enabled = 1
      `);

    if (!result.recordset.length) {
      return res.status(400).json({ error: '2FA no está habilitado' });
    }

    const { twofa_secret, twofa_backup_codes } = result.recordset[0];
    const backupCodes = twofa_backup_codes ? JSON.parse(twofa_backup_codes) : [];

    // Verificar código (TOTP o backup)
    let verificado = speakeasy.totp.verify({
      secret: twofa_secret,
      encoding: 'base32',
      token: codigo,
      window: 2
    });

    if (!verificado && backupCodes.includes(codigo)) {
      verificado = true;
    }

    if (!verificado) {
      return res.status(401).json({ error: 'Código incorrecto' });
    }

    // Deshabilitar 2FA
    await pool
      .request()
      .input('id_usuario', sql.Int, id_usuario)
      .query(`
        UPDATE Usuario 
        SET twofa_enabled = 0,
            twofa_secret = NULL,
            twofa_backup_codes = NULL
        WHERE id_usuario = @id_usuario
      `);

    res.json({ mensaje: '2FA deshabilitado correctamente' });

  } catch (error) {
    console.error('Error al deshabilitar 2FA:', error);
    res.status(500).json({ error: 'Error al deshabilitar 2FA' });
  }
};

/**
 * Obtener estado de 2FA del usuario
 */
export const obtenerEstado2FA = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const id_usuario = payload.id_usuario;

    const pool = await connectDB();
    const result = await pool
      .request()
      .input('id_usuario', sql.Int, id_usuario)
      .query(`
        SELECT 
          twofa_enabled,
          CASE WHEN twofa_backup_codes IS NOT NULL 
               THEN (SELECT COUNT(*) FROM OPENJSON(twofa_backup_codes))
               ELSE 0 
          END as codigos_respaldo_restantes
        FROM Usuario 
        WHERE id_usuario = @id_usuario
      `);

    if (!result.recordset.length) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      habilitado: result.recordset[0].twofa_enabled === 1,
      codigosRespaldoRestantes: result.recordset[0].codigos_respaldo_restantes || 0
    });

  } catch (error) {
    console.error('Error al obtener estado 2FA:', error);
    res.status(500).json({ error: 'Error al obtener estado' });
  }
};