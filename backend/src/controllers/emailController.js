import { sendSystemEmail, sendUserEmail } from "../utils/sendEmail.js";

//Confirmaciones automáticas
export const sendConfirmationEmail = async (req, res) => {
  const { to, subject, message } = req.body;
  const html = `<h2>${subject}</h2><p>${message}</p>`;
  try {
    await sendSystemEmail(to, subject, html);
    res.json({ success: true, message: "Correo automático enviado" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error al enviar correo automático",
        error: error.message,
      });
  }
};

// Respuestas manuales (usa credenciales del usuario autenticado)
export const sendManualResponse = async (req, res) => {
  const { to, subject, message, senderName } = req.body;
  const html = `<p>${message}</p>`;

  try {
    await sendUserEmail(to, subject, html, senderName);
    res.json({ success: true, message: "Correo manual enviado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error al enviar correo manual",
        error: error.message,
      });
  }
};
