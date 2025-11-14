import {
  CrearSolicitudServicio,
  ObtenerSolicitudServicios,
  ObtenerSolicitudServicioPorId,
  ActualizarSolicitudServicio,
  EliminarSolicitudServicio,
} from "../models/solicitudServicioModel.js";

export const CreaSolicitudServicio = async (req, res) => {
  const { id_solicitud, id_servicio } = req.body;
  if (!id_solicitud || !id_servicio)
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  try {
    const relacion = await CrearSolicitudServicio({
      id_solicitud,
      id_servicio,
    });
    res.status(201).json(relacion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando la relación" });
  }
};

export const ListaSolicitudServicios = async (req, res) => {
  try {
    const relaciones = await ObtenerSolicitudServicios();
    res.status(200).json({ relaciones });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo relaciones" });
  }
};

export const ListaSolicitudServicioPorId = async (req, res) => {
  const { id_solicitud_servicio } = req.params;
  try {
    const relacion = await ObtenerSolicitudServicioPorId(id_solicitud_servicio);
    if (!relacion)
      return res.status(404).json({ error: "Relación no encontrada" });
    res.status(200).json(relacion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo relación" });
  }
};

export const EditarSolicitudServicio = async (req, res) => {
  const { id_solicitud_servicio } = req.params;
  try {
    const filasActualizadas = await ActualizarSolicitudServicio(
      id_solicitud_servicio,
      req.body
    );
    if (filasActualizadas === 0)
      return res.status(404).json({ error: "Relación no encontrada" });
    res.status(200).json({ mensaje: "Relación actualizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando relación" });
  }
};

export const BorrarSolicitudServicio = async (req, res) => {
  const { id_solicitud_servicio } = req.params;
  try {
    const filasEliminadas = await EliminarSolicitudServicio(
      id_solicitud_servicio
    );
    if (filasEliminadas === 0)
      return res.status(404).json({ error: "Relación no encontrada" });
    res.status(200).json({ mensaje: "Relación eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminando relación" });
  }
};
