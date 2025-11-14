import { connectDB } from "../config/db.js";
import {
  CrearSolicitud,
  ObtenerSolicitudes,
  ObtenerSolicitudPorId,
  ActualizarSolicitud,
  EliminarSolicitud,
  ObtenerResponsablesPorServicios,
  ObtenerInfoCompletaSolicitud,
  AceptarSolicitud,
  ObtenerSolicitudesPorUsuarioDB, 
} from "../models/solicitudModel.js";
import { CrearSolicitudServicio } from "../models/solicitudServicioModel.js";
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
    // Crear solicitud principal
    const solicitud = await CrearSolicitud({
      id_usuario,
      detalles_solicitud,
      id_estado,
    });
    const id_solicitud = solicitud.id_solicitud;

    // Insertar relaciones con servicios
    const pool = await connectDB();
    let nombresServicios = [];

    if (servicios.length > 0) {
      const result = await pool
        .request()
        .query(
          `SELECT nombre_servicio FROM Servicio WHERE id_servicio IN (${servicios.join(
            ","
          )})`
        );
      nombresServicios = result.recordset.map((r) => r.nombre_servicio);

      // Crear relaciones en tabla intermedia
      for (const id_servicio of servicios) {
        await CrearSolicitudServicio({ id_solicitud, id_servicio });
      }
    }

    //Enviar correo de confirmación al solicitante
    if (userEmail) {
      const serviciosHTML =
        nombresServicios.length > 0
          ? `<ul style="list-style: none; padding: 0;">${nombresServicios
              .map(
                (s) =>
                  `<li style="padding: 8px; background: #f0f7ff; margin: 5px 0; border-radius: 4px;">✓ ${s}</li>`
              )
              .join("")}</ul>`
          : "<p>No se seleccionaron servicios específicos.</p>";

      const htmlSolicitante = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: #003366; color: white; padding: 20px; text-align: center;">
                        <h2 style="margin: 0;">Confirmación de Solicitud</h2>
                    </div>
                    <div style="padding: 20px; background: #f9f9f9;">
                        <p>Hola, hemos recibido tu solicitud correctamente.</p>
                        <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
                            <h3 style="color: #003366; margin-top: 0;">📋 Detalles de tu solicitud:</h3>
                            <p><strong>Número de solicitud:</strong> #${id_solicitud}</p>
                            <p><strong>Detalles:</strong> ${detalles_solicitud}</p>
                            <p><strong>Fecha:</strong> ${new Date().toLocaleDateString(
                              "es-ES"
                            )}</p>
                            <p><strong>Estado:</strong> <span style="color: #f59e0b;">Sin Aceptar</span></p>
                        </div>
                        <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
                            <h3 style="color: #003366; margin-top: 0;">Servicios solicitados:</h3>
                            ${serviciosHTML}
                        </div>
                        <p style="color: #666; font-size: 14px;">
                            Recibirás actualizaciones sobre el estado de tu solicitud.
                        </p>
                    </div>
                    <div style="background: #003366; color: white; padding: 15px; text-align: center; font-size: 12px;">
                        <p style="margin: 0;">Instituto de Fomento y Asesoría Municipal (IFAM)</p>
                    </div>
                </div>
            `;
      await sendSystemEmail(
        userEmail,
        "Confirmación de solicitud - IFAM",
        htmlSolicitante
      );
    }

    // Notificar a los responsables de los servicios solicitados
    if (servicios.length > 0) {
      const responsables = await ObtenerResponsablesPorServicios(servicios);
      const infoSolicitud = await ObtenerInfoCompletaSolicitud(id_solicitud);

      for (const responsable of responsables) {
        const htmlResponsable = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: #d32f2f; color: white; padding: 20px; text-align: center;">
                            <h2 style="margin: 0;">Nueva Solicitud de Servicio</h2>
                        </div>
                        <div style="padding: 20px; background: #f9f9f9;">
                            <p>Hola <strong>${responsable.nombre} ${
          responsable.apellido1
        }</strong>,</p>
                            <p>Se ha recibido una nueva solicitud de servicio que requiere tu atención.</p>
                            
                            <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #d32f2f;">
                                <h3 style="color: #d32f2f; margin-top: 0;">Información de la Solicitud</h3>
                                <p><strong>Número de solicitud:</strong> #${
                                  infoSolicitud.id_solicitud
                                }</p>
                                <p><strong>Fecha:</strong> ${new Date(
                                  infoSolicitud.fecha_solicitud
                                ).toLocaleDateString("es-ES")}</p>
                                <p><strong>Estado:</strong> ${
                                  infoSolicitud.nombre_estado
                                }</p>
                                <p><strong>Aceptada:</strong> <span style="color: #f59e0b;">Sin Aceptar</span></p>
                            </div>

                            <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
                                <h3 style="color: #003366; margin-top: 0;">👤 Datos del Solicitante</h3>
                                <p><strong>Nombre:</strong> ${
                                  infoSolicitud.solicitante_nombre
                                } ${infoSolicitud.solicitante_apellido1} ${
          infoSolicitud.solicitante_apellido2
        }</p>
                                <p><strong>Cargo:</strong> ${
                                  infoSolicitud.solicitante_cargo
                                }</p>
                                <p><strong>Municipalidad:</strong> ${
                                  infoSolicitud.solicitante_municipalidad
                                }</p>
                                <p><strong>Correo:</strong> <a href="mailto:${
                                  infoSolicitud.solicitante_correo
                                }">${infoSolicitud.solicitante_correo}</a></p>
                                <p><strong>Teléfono:</strong> ${
                                  infoSolicitud.solicitante_telefono
                                }</p>
                            </div>

                            <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
                                <h3 style="color: #003366; margin-top: 0;">📝 Detalles de la Solicitud</h3>
                                <p style="background: #f0f7ff; padding: 10px; border-radius: 4px;">${
                                  infoSolicitud.detalles_solicitud
                                }</p>
                            </div>

                            <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
                                <h3 style="color: #003366; margin-top: 0;">Servicios Solicitados</h3>
                                <p style="background: #e8f5e9; padding: 10px; border-radius: 4px; color: #2e7d32;">
                                    ${infoSolicitud.servicios_solicitados}
                                </p>
                            </div>

                            <div style="text-align: center; margin: 20px 0;">
                                <p style="color: #666;">Por favor, revisa y acepta esta solicitud para comenzar a procesarla.</p>
                            </div>
                        </div>
                        <div style="background: #d32f2f; color: white; padding: 15px; text-align: center; font-size: 12px;">
                            <p style="margin: 0;">Instituto de Fomento y Asesoría Municipal (IFAM)</p>
                            <p style="margin: 5px 0 0 0;">Sistema de Gestión de Servicios</p>
                        </div>
                    </div>
                `;

        try {
          await sendSystemEmail(
            responsable.correo,
            `Nueva Solicitud #${id_solicitud} - Requiere tu atención`,
            htmlResponsable
          );
          console.log(
            `Notificación enviada a responsable: ${responsable.correo}`
          );
        } catch (emailError) {
          console.error(
            `Error enviando correo a ${responsable.correo}:`,
            emailError
          );
        }
      }

      console.log(`Se notificó a ${responsables.length} responsable(s)`);
    }

    res.status(201).json({
      mensaje: "Solicitud creada correctamente",
      id_solicitud,
      servicios_asociados: servicios.length,
      responsables_notificados:
        servicios.length > 0
          ? (await ObtenerResponsablesPorServicios(servicios)).length
          : 0,
    });
  } catch (error) {
    console.error("Error creando solicitud:", error);
    res.status(500).json({ error: "Error creando la solicitud" });
  }
};

/**
 * Aceptar una solicitud
 */
export const AceptarSolicitudController = async (req, res) => {
  const { id_solicitud } = req.params;
  const id_responsable = req.user.id_usuario; 

  try {
    const filasActualizadas = await AceptarSolicitud(
      id_solicitud,
      id_responsable
    );

    if (filasActualizadas === 0) {
      return res.status(404).json({ error: "Solicitud no encontrada" });
    }

    // Enviar notificación al solicitante
    const infoSolicitud = await ObtenerInfoCompletaSolicitud(id_solicitud);

    if (infoSolicitud.solicitante_correo) {
      const htmlNotificacion = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: #10b981; color: white; padding: 20px; text-align: center;">
                        <h2 style="margin: 0;">Solicitud Aceptada</h2>
                    </div>
                    <div style="padding: 20px; background: #f9f9f9;">
                        <p>Hola,</p>
                        <p>Tu solicitud ha sido <strong style="color: #10b981;">aceptada</strong> por el responsable.</p>
                        
                        <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
                            <h3 style="color: #003366; margin-top: 0;">Información de tu Solicitud</h3>
                            <p><strong>Número de solicitud:</strong> #${infoSolicitud.id_solicitud}</p>
                            <p><strong>Estado:</strong> <span style="color: #10b981;">Aceptada</span></p>
                            <p><strong>Servicios:</strong> ${infoSolicitud.servicios_solicitados}</p>
                        </div>

                        <p style="color: #666; font-size: 14px;">
                            El responsable comenzará a trabajar en tu solicitud pronto.
                        </p>
                    </div>
                    <div style="background: #10b981; color: white; padding: 15px; text-align: center; font-size: 12px;">
                        <p style="margin: 0;">Instituto de Fomento y Asesoría Municipal (IFAM)</p>
                    </div>
                </div>
            `;

      await sendSystemEmail(
        infoSolicitud.solicitante_correo,
        `Solicitud #${id_solicitud} Aceptada`,
        htmlNotificacion
      );
    }

    res.status(200).json({
      mensaje: "Solicitud aceptada correctamente",
      aceptada: true,
    });
  } catch (error) {
    console.error("Error aceptando solicitud:", error);
    res.status(500).json({ error: "Error aceptando la solicitud" });
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
 * Obtener solicitudes por usuario
 */
export async function ObtenerSolicitudesPorUsuario(req, res) {
  const { id_usuario } = req.params;

  try {
    console.log("Obteniendo solicitudes para usuario:", id_usuario);

    const solicitudes = await ObtenerSolicitudesPorUsuarioDB(id_usuario);

    //TRANSFORMAR LOS DATOS PARA INCLUIR RESPONSABLE
    const solicitudesTransformadas = solicitudes.map((sol) => ({
      id_solicitud: sol.id_solicitud,
      id_usuario: sol.id_usuario,
      detalles_solicitud: sol.detalles_solicitud,
      fecha_solicitud: sol.fecha_solicitud,
      id_estado: sol.id_estado,
      aceptada: sol.aceptada,
      nombre_estado: sol.nombre_estado,
      nombre_usuario: sol.nombre_usuario,
      apellido_usuario: sol.apellido_usuario,
      apellido2_usuario: sol.apellido2_usuario,
      //AGREGAR INFORMACIÓN DEL RESPONSABLE
      responsable_nombre: sol.responsable_nombre,
      responsable_apellido1: sol.responsable_apellido1,
      responsable_apellido2: sol.responsable_apellido2,
      responsable_correo: sol.responsable_correo,
    }));

    console.log(
      "Solicitudes transformadas:",
      solicitudesTransformadas.length
    );

    res.json(solicitudesTransformadas);
  } catch (error) {
    console.error("Error en ObtenerSolicitudesPorUsuario:", error);
    res.status(500).json({ error: error.message });
  }
}

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
  console.log("Body recibido:", req.body);
  const { id_solicitud } = req.params;
  const { id_usuario, detalles_solicitud, id_estado, aceptada } = req.body;

  try {
    const filasActualizadas = await ActualizarSolicitud(id_solicitud, {
      id_usuario,
      detalles_solicitud,
      id_estado,
      aceptada,
    });
    if (filasActualizadas === 0)
      return res.status(404).json({ error: "Solicitud no encontrada" });
    res.status(200).json({ mensaje: "Solicitud actualizada correctamente" });
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
