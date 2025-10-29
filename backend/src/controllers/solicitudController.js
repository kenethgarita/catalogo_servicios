import { connectDB } from "../config/db.js";
import {
  CrearSolicitud,
  ObtenerSolicitudes,
  ObtenerSolicitudPorId,
  ActualizarSolicitud,
  EliminarSolicitud,
} from "../models/solicitudModel.js";
import {
  CrearSolicitudServicio,
} from "../models/solicitudServicioModel.js";
import { sendSystemEmail } from "../utils/sendEmail.js";

/**
 * Crear nueva solicitud y registrar sus servicios asociados
 */
export const CreaSolicitud = async (req, res) => {
    const { detalles_solicitud, id_estado, servicios = [] } = req.body;
    const id_usuario = req.user.id_usuario;
    const userEmail = req.user.correo;

    if (!detalles_solicitud) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    try {
        // 1️⃣ Crear solicitud principal
        const solicitud = await CrearSolicitud({ id_usuario, detalles_solicitud, id_estado });
        const id_solicitud = solicitud.id_solicitud;

        // 2️⃣ Insertar relaciones con servicios
        const pool = await connectDB();

        // Validar y obtener nombres de servicios
        let nombresServicios = [];
        if (servicios.length > 0) {
            const result = await pool.request()
                .query(`SELECT nombre_servicio FROM Servicio WHERE id_servicio IN (${servicios.join(",")})`);
            nombresServicios = result.recordset.map(r => r.nombre_servicio);

            // Crear relaciones en tabla intermedia
            for (const id_servicio of servicios) {
                await CrearSolicitudServicio({ id_solicitud, id_servicio });
            }
        }

        // 3️⃣ Enviar correo si el usuario tiene correo registrado
        if (userEmail) {
            const serviciosHTML = nombresServicios.length > 0
                ? `<ul>${nombresServicios.map(s => `<li>${s}</li>`).join("")}</ul>`
                : "<p>No se seleccionaron servicios específicos.</p>";

            const html = `
                <h2>Confirmación de solicitud</h2>
                <p>Hola, hemos recibido tu solicitud correctamente.</p>
                <p><strong>Detalles:</strong> ${detalles_solicitud}</p>
                <p><strong>Servicios solicitados:</strong></p>
                ${serviciosHTML}
                <p>Gracias por usar el sistema del IFAM.</p>
            `;
            await sendSystemEmail(userEmail, "Confirmación de solicitud", html);
        } else {
            console.warn("El usuario no tiene correo definido, no se envió confirmación.");
        }

        res.status(201).json({
            mensaje: "Solicitud creada correctamente",
            id_solicitud,
            servicios_asociados: servicios.length,
        });
    } catch (error) {
        console.error("Error creando solicitud:", error);
        res.status(500).json({ error: "Error creando la solicitud" });
    }
};

/**
 * Listar todas las solicitudes
 */
export const ListaSolicitudes = async (req, res) => {
  try {
    const solicitudes = await ObtenerSolicitudes();
    res.status(200).json({ solicitudes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo las solicitudes" });
  }
};

/**
 * Obtener solicitud por ID
 */
export const ListaSolicitudPorId = async (req, res) => {
  const { id_solicitud } = req.params;
  try {
    const solicitud = await ObtenerSolicitudPorId(id_solicitud);
    if (!solicitud)
      return res.status(404).json({ error: "Solicitud no encontrada" });
    res.status(200).json(solicitud);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo la solicitud" });
  }
};

/**
 * Actualizar una solicitud existente
 */
export const EditarSolicitud = async (req, res) => {
  const { id_solicitud } = req.params;
  const { id_usuario, detalles_solicitud, id_estado } = req.body;

  try {
    const filasActualizadas = await ActualizarSolicitud(id_solicitud, {
      id_usuario,
      detalles_solicitud,
      id_estado,
    });
    if (filasActualizadas === 0)
      return res.status(404).json({ error: "Solicitud no encontrada" });
    res
      .status(200)
      .json({ mensaje: "Solicitud actualizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando la solicitud" });
  }
};

/**
 * Eliminar una solicitud
 */
export const BorrarSolicitud = async (req, res) => {
  const { id_solicitud } = req.params;
  try {
    const filasEliminadas = await EliminarSolicitud(id_solicitud);
    if (filasEliminadas === 0)
      return res.status(404).json({ error: "Solicitud no encontrada" });
    res.status(200).json({ mensaje: "Solicitud eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminando la solicitud" });
  }
};
