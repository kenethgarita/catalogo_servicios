// src/utils/sendEmail.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Crea un transportador SMTP con las credenciales del sistema
 */
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

/**
 * Envía un correo usando la cuenta del sistema (modo automático)
 * Ideal para confirmaciones, notificaciones y alertas
 */
export async function sendSystemEmail(to, subject, html) {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Correo automático enviado a ${to}`);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar correo automático:', error);
    return false;
  }
}

/**
 * Envía un correo "manual" (por ejemplo, una respuesta de un responsable)
 * Pero usa las mismas credenciales del sistema (sin pedir user/pass)
 */
export async function sendUserEmail(to, subject, html, senderName = 'IFAM - Catálogo de Servicios') {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${senderName}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📨 Correo manual enviado a ${to} (remitente: ${senderName})`);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar correo manual:', error);
    return false;
  }
}
