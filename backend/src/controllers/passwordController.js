import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { connectDB } from '../config/db.js';
import sql from 'mssql';
import { sendSystemEmail } from '../utils/sendEmail.js';

const API_URL = process.env.CLIENT_URL || 'http://localhost:3000';

export const solicitarRecuperacion = async (req, res) => {
  const { correo } = req.body;
  
  try {
    const pool = await connectDB();
    
    // Verificar si el usuario existe
    const result = await pool.request()
      .input('correo', sql.VarChar, correo)
      .query('SELECT id_usuario, nombre FROM Usuario WHERE correo = @correo');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    const usuario = result.recordset[0];
    
    // Generar token
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000); // 1 hora
    
    // Guardar token en BD
    await pool.request()
      .input('correo', sql.VarChar, correo)
      .input('token', sql.NVarChar, token)
      .input('expiry', sql.DateTime, expiry)
      .query(`
        UPDATE Usuario 
        SET reset_token = @token, reset_token_expiry = @expiry
        WHERE correo = @correo
      `);
    
    // Enviar correo
    const resetUrl = `${API_URL}/reset-password/${token}`;
    
    const htmlEmail = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1d2d5a; color: white; padding: 20px; text-align: center;">
          <h2>Recuperación de Contraseña</h2>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <p>Hola <strong>${usuario.nombre}</strong>,</p>
          <p>Recibimos una solicitud para restablecer tu contraseña.</p>
          <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: #CEAC65; color: white; padding: 15px 30px; 
                      text-decoration: none; border-radius: 8px; display: inline-block;
                      font-weight: 600;">
              Restablecer Contraseña
            </a>
          </div>
          <p style="color: #666; font-size: 0.9rem;">
            O copia este enlace en tu navegador:<br>
            <a href="${resetUrl}">${resetUrl}</a>
          </p>
          <p style="color: #d97706; font-size: 0.9rem; margin-top: 20px;">
            ⚠️ Este enlace expirará en 1 hora.
          </p>
          <p style="color: #666; font-size: 0.85rem;">
            Si no solicitaste este cambio, ignora este correo.
          </p>
        </div>
        <div style="background: #1d2d5a; color: white; padding: 15px; text-align: center;">
          <p style="margin: 0;">IFAM - Instituto de Fomento y Asesoría Municipal</p>
        </div>
      </div>
    `;
    
    await sendSystemEmail(
      correo,
      'Recuperación de Contraseña - IFAM',
      htmlEmail
    );
    
    res.json({ mensaje: 'Correo de recuperación enviado' });
    
  } catch (error) {
    console.error('Error en recuperación:', error);
    res.status(500).json({ error: 'Error al procesar solicitud' });
  }
};

export const restablecerContrasena = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  
  try {
    const pool = await connectDB();
    
    // Verificar token
    const result = await pool.request()
      .input('token', sql.NVarChar, token)
      .query(`
        SELECT id_usuario, correo, nombre 
        FROM Usuario 
        WHERE reset_token = @token 
        AND reset_token_expiry > GETDATE()
      `);
    
    if (result.recordset.length === 0) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }
    
    const usuario = result.recordset[0];
    
    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Actualizar contraseña y limpiar token
    await pool.request()
      .input('id_usuario', sql.Int, usuario.id_usuario)
      .input('password', sql.NVarChar, hashedPassword)
      .query(`
        UPDATE Usuario 
        SET contrasena = @password,
            reset_token = NULL,
            reset_token_expiry = NULL
        WHERE id_usuario = @id_usuario
      `);
    
    res.json({ mensaje: 'Contraseña actualizada correctamente' });
    
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    res.status(500).json({ error: 'Error al restablecer contraseña' });
  }
};