// backend/src/controllers/twoFactorController.js
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
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

    const pool = await connectDB();
    const result = await pool
      .request()
      .input('id_usuario', sql.Int, id_usuario)
      .query('SELECT correo FROM Usuario WHERE id_usuario = @id_usuario');

    if (!result.recordset.length) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const correo = result.recordset[0].correo;

    const secret = speakeasy.generateSecret({
      name: `IFAM (${correo})`,
      issuer: 'IFAM - Catálogo de Servicios'
    });

    await pool
      .request()
      .input('id_usuario', sql.Int, id_usuario)
      .input('secret', sql.NVarChar, secret.base32)
      .query(`
        UPDATE Usuario 
        SET twofa_secret = @secret 
        WHERE id_usuario = @id_usuario
      `);

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    res.json({
      qrCode: qrCodeUrl,
      secret: secret.base32,
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

    console.log('🔐 Intentando habilitar 2FA para usuario:', id_usuario);
    console.log('📱 Código recibido:', codigo);

    const pool = await connectDB();
    const result = await pool
      .request()
      .input('id_usuario', sql.Int, id_usuario)
      .query('SELECT twofa_secret, twofa_enabled FROM Usuario WHERE id_usuario = @id_usuario');

    if (!result.recordset.length || !result.recordset[0].twofa_secret) {
      console.log('❌ No hay configuración 2FA pendiente');
      return res.status(400).json({ error: 'No hay configuración 2FA pendiente' });
    }

    const secret = result.recordset[0].twofa_secret;
    const yaHabilitado = result.recordset[0].twofa_enabled;

    if (yaHabilitado === 1 || yaHabilitado === true) {
      console.log('⚠️ 2FA ya está habilitado para este usuario');
      return res.status(400).json({ error: '2FA ya está habilitado' });
    }

    console.log('🔑 Secret encontrado, verificando código...');

    const verificado = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: codigo,
      window: 6
    });

    console.log('🔍 Resultado verificación:', verificado);

    if (!verificado) {
      console.log('❌ Código incorrecto');
      return res.status(401).json({ error: 'Código incorrecto. Verifica que la hora de tu dispositivo esté sincronizada.' });
    }

    console.log('✅ Código correcto, generando códigos de respaldo...');

    // Generar códigos de respaldo (8 caracteres hexadecimales)
    const backupCodes = Array.from({ length: 10 }, () => 
      crypto.randomBytes(4).toString('hex').toUpperCase()
    );

    console.log('🎫 Códigos de respaldo generados:', backupCodes.length);

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

    const verification = await pool
      .request()
      .input('id_usuario', sql.Int, id_usuario)
      .query('SELECT twofa_enabled FROM Usuario WHERE id_usuario = @id_usuario');

    console.log('✅ Estado final twofa_enabled en DB:', verification.recordset[0].twofa_enabled);

    res.json({
      mensaje: '2FA habilitado correctamente',
      backupCodes: backupCodes,
      advertencia: 'Guarda estos códigos de respaldo en un lugar seguro. Cada código solo puede usarse una vez.',
      habilitado: true
    });

  } catch (error) {
    console.error('❌ Error al habilitar 2FA:', error);
    res.status(500).json({ error: 'Error al habilitar 2FA' });
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

    console.log('📊 Consultando estado 2FA para usuario:', id_usuario);

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

    const twofa_enabled_db = result.recordset[0].twofa_enabled;
    console.log('📊 Valor de twofa_enabled desde DB:', twofa_enabled_db, 'tipo:', typeof twofa_enabled_db);

    const habilitado = twofa_enabled_db === 1 || twofa_enabled_db === true;
    console.log('📊 Valor convertido a boolean:', habilitado);

    res.json({
      habilitado: habilitado,
      codigosRespaldoRestantes: result.recordset[0].codigos_respaldo_restantes || 0
    });

  } catch (error) {
    console.error('❌ Error al obtener estado 2FA:', error);
    res.status(500).json({ error: 'Error al obtener estado' });
  }
};

/**
 * Verificar código 2FA durante login - CORREGIDO
 */
export const verificar2FA = async (req, res) => {
  try {
    const { id_usuario, codigo } = req.body;

    console.log('🔐 Verificando 2FA para usuario:', id_usuario);
    console.log('📱 Código recibido:', codigo, 'longitud:', codigo?.length);

    const pool = await connectDB();
    const result = await pool
      .request()
      .input('id_usuario', sql.Int, id_usuario)
      .query(`
        SELECT u.twofa_secret, u.twofa_backup_codes, u.correo, u.nombre, u.apellido1, u.id_rol,
               r.nombre_rol,
               CASE 
                 WHEN EXISTS (
                   SELECT 1 
                   FROM Responsable resp 
                   WHERE resp.id_usuario = u.id_usuario
                 ) THEN 1 
                 ELSE 0 
               END AS es_responsable
        FROM Usuario u
        JOIN Rol r ON u.id_rol = r.id_rol
        WHERE u.id_usuario = @id_usuario AND u.twofa_enabled = 1
      `);

    if (!result.recordset.length) {
      console.log('❌ Usuario no tiene 2FA habilitado');
      return res.status(400).json({ error: 'Usuario no tiene 2FA habilitado' });
    }

    const userData = result.recordset[0];
    const { twofa_secret, twofa_backup_codes, correo, nombre, apellido1, nombre_rol, es_responsable } = userData;
    
    // Parsear códigos de respaldo
    let backupCodes = [];
    try {
      backupCodes = twofa_backup_codes ? JSON.parse(twofa_backup_codes) : [];
      console.log('🎫 Códigos de respaldo parseados:', backupCodes);
    } catch (parseError) {
      console.error('❌ Error parseando códigos de respaldo:', parseError);
      backupCodes = [];
    }

    console.log('🔑 Secret disponible:', !!twofa_secret);
    console.log('🎫 Total códigos de respaldo:', backupCodes.length);

    let verificado = false;
    let tipoVerificacion = null;

    // Normalizar el código ingresado
    const codigoNormalizado = codigo.trim().toUpperCase();
    console.log('🔍 Código normalizado:', codigoNormalizado);
    console.log('🔍 Longitud del código:', codigoNormalizado.length);
    console.log('🔍 Es hexadecimal?:', /^[0-9A-F]+$/.test(codigoNormalizado));

    // PRIMERO: Intentar verificar como código de respaldo
    // Los códigos de respaldo son de 8 caracteres hexadecimales
    if (codigoNormalizado.length === 8) {
      console.log('🎫 Longitud 8 detectada - Intentando verificar como código de respaldo...');
      console.log('🎫 Buscando en:', backupCodes);
      
      // Normalizar todos los códigos a mayúsculas para comparar
      const codigosNormalizados = backupCodes.map(c => c.toUpperCase());
      console.log('🎫 Códigos normalizados:', codigosNormalizados);
      
      const indiceEncontrado = codigosNormalizados.indexOf(codigoNormalizado);
      console.log('🎫 Índice encontrado:', indiceEncontrado);

      if (indiceEncontrado !== -1) {
        console.log('✅ ¡Código de respaldo válido encontrado!');
        verificado = true;
        tipoVerificacion = 'backup';
        
        // Remover el código usado usando el índice
        const nuevosBackupCodes = backupCodes.filter((_, index) => index !== indiceEncontrado);
        
        console.log('📝 Actualizando códigos de respaldo...');
        console.log('🎫 Códigos antes:', backupCodes.length);
        console.log('🎫 Códigos después:', nuevosBackupCodes.length);

        await pool
          .request()
          .input('id_usuario', sql.Int, id_usuario)
          .input('backup_codes', sql.NVarChar, JSON.stringify(nuevosBackupCodes))
          .query(`
            UPDATE Usuario 
            SET twofa_backup_codes = @backup_codes
            WHERE id_usuario = @id_usuario
          `);

        console.log('✅ Códigos de respaldo actualizados correctamente');
      } else {
        console.log('❌ Código de respaldo NO encontrado en la lista');
      }
    } 
    // SEGUNDO: Verificar código TOTP normal (6 dígitos)
    else if (codigoNormalizado.length === 6 && /^\d{6}$/.test(codigoNormalizado)) {
      console.log('🔢 Intentando verificar como código TOTP...');
      
      verificado = speakeasy.totp.verify({
        secret: twofa_secret,
        encoding: 'base32',
        token: codigoNormalizado,
        window: 2
      });

      if (verificado) {
        tipoVerificacion = 'totp';
        console.log('✅ Código TOTP verificado correctamente');
      } else {
        console.log('❌ Código TOTP incorrecto');
      }
    } else {
      console.log('❌ Formato de código no válido');
      console.log('   - Longitud:', codigoNormalizado.length);
      console.log('   - Esperado: 6 dígitos (TOTP) o 8 caracteres (código de respaldo)');
    }

    if (!verificado) {
      console.log('❌ Verificación fallida');
      return res.status(401).json({ 
        error: 'Código incorrecto',
        detalle: 'El código debe ser de 6 dígitos (app) o 8 caracteres hexadecimales (código de respaldo)'
      });
    }

    // ✅ CÓDIGO VERIFICADO - Generar token JWT
    const payload = {
      id_usuario: id_usuario,
      rol: nombre_rol,
      es_responsable: es_responsable === 1,
      correo: correo,
      nombre: nombre
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });

    console.log('✅ Token JWT generado exitosamente');
    console.log('✅ Tipo de verificación:', tipoVerificacion);

    return res.json({ 
      verificado: true,
      tipo: tipoVerificacion,
      codigosRestantes: tipoVerificacion === 'backup' ? backupCodes.length - 1 : backupCodes.length,
      token: token,
      usuario: {
        id_usuario: id_usuario,
        nombre: nombre,
        apellido1: apellido1,
        rol: nombre_rol,
        es_responsable: es_responsable === 1,
        correo: correo
      }
    });

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

    // Normalizar código
    const codigoNormalizado = codigo.trim().toUpperCase();

    // Verificar código (TOTP o backup)
    let verificado = speakeasy.totp.verify({
      secret: twofa_secret,
      encoding: 'base32',
      token: codigoNormalizado,
      window: 2
    });

    if (!verificado && backupCodes.some(c => c.toUpperCase() === codigoNormalizado)) {
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