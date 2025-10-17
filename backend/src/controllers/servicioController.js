import {
  CrearServicio,
  ObtenerServicios,
  ObtenerServicioPorId,
  ActualizarServicio,
  EliminarServicio
} from "../models/servicioModel.js";

export const CreaServicio = async (req, res) => {
  const {
    nombre_servicio,
    descripcion_servicio,
    proposito_servicio,
    area_responsable,
    tiempo,
    documentacion_url,
    imagen_servicio,
    id_categoria
  } = req.body;

  if (!nombre_servicio || !id_categoria) {
    return res.status(400).json({ error: "Faltan campos obligatorios (nombre_servicio, id_categoria)" });
  }

  try {
    const servicio = await CrearServicio({
      nombre_servicio,
      descripcion_servicio,
      proposito_servicio,
      area_responsable,
      tiempo,
      documentacion_url,
      imagen_servicio,
      id_categoria
    });
    res.status(201).json(servicio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando el servicio" });
  }
};

export const ListaServicios = async (req, res) => {
  try {
    const servicios = await ObtenerServicios();
    res.status(200).json({ servicios });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo los servicios" });
  }
};

export const ListaServicioPorId = async (req, res) => {
  const { id_servicio } = req.params;
  try {
    const servicio = await ObtenerServicioPorId(id_servicio);
    if (!servicio) return res.status(404).json({ error: "Servicio no encontrado" });
    res.status(200).json(servicio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo el servicio" });
  }
};

export const EditarServicio = async (req, res) => {
  const { id_servicio } = req.params;
  try {
    const filas = await ActualizarServicio(id_servicio, req.body);
    if (filas === 0) return res.status(404).json({ error: "Servicio no encontrado" });
    res.status(200).json({ mensaje: "Servicio actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando el servicio" });
  }
};

export const BorrarServicio = async (req, res) => {
  const { id_servicio } = req.params;
  try {
    const filas = await EliminarServicio(id_servicio);
    if (filas === 0) return res.status(404).json({ error: "Servicio no encontrado" });
    res.status(200).json({ mensaje: "Servicio eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminando el servicio" });
  }
};
