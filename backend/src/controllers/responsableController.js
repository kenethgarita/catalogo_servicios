import {
  CrearResponsable,
  ObtenerResponsables,
  ObtenerResponsablePorId,
  ActualizarResponsable,
  EliminarResponsable,
} from "../models/responsableModel.js";

export const CreaResponsable = async (req, res) => {
  const { id_usuario, id_servicio } = req.body;
  if (!id_usuario || !id_servicio)
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  try {
    const responsable = await CrearResponsable({ id_usuario, id_servicio });
    res.status(201).json(responsable);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando responsable" });
  }
};

export const ListaResponsables = async (req, res) => {
  try {
    const responsables = await ObtenerResponsables();
    res.status(200).json({ responsables });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo responsables" });
  }
};

export const ListaResponsablePorId = async (req, res) => {
  const { id_responsable } = req.params;
  try {
    const responsable = await ObtenerResponsablePorId(id_responsable);
    if (!responsable)
      return res.status(404).json({ error: "Responsable no encontrado" });
    res.status(200).json(responsable);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo responsable" });
  }
};

export const EditarResponsable = async (req, res) => {
  const { id_responsable } = req.params;
  try {
    const filasActualizadas = await ActualizarResponsable(
      id_responsable,
      req.body
    );
    if (filasActualizadas === 0)
      return res.status(404).json({ error: "Responsable no encontrado" });
    res.status(200).json({ mensaje: "Responsable actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando responsable" });
  }
};

export const BorrarResponsable = async (req, res) => {
  const { id_responsable } = req.params;
  try {
    const filasEliminadas = await EliminarResponsable(id_responsable);
    if (filasEliminadas === 0)
      return res.status(404).json({ error: "Responsable no encontrado" });
    res.status(200).json({ mensaje: "Responsable eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminando responsable" });
  }
};
