import {
  CrearEstado,
  ObtenerEstados,
  ObtenerEstadoPorId,
  EditarEstado,
  EliminarEstado,
} from "../models/estadoModel.js";

export async function CrearEstadoController(req, res) {
  try {
    const data = await CrearEstado(req.body);
    res.status(201).json(data);
  } catch (error) {
    console.error("Error creando estado:", error);
    res.status(500).json({ error: "Error al crear el estado" });
  }
}

export async function ObtenerEstadosController(req, res) {
  try {
    const estados = await ObtenerEstados();
    res.json(estados);
  } catch (error) {
    console.error("Error obteniendo estados:", error);
    res.status(500).json({ error: "Error al obtener estados" });
  }
}

export async function ObtenerEstadoPorIdController(req, res) {
  try {
    const { id_estado } = req.params;
    const estado = await ObtenerEstadoPorId(id_estado);
    if (!estado) return res.status(404).json({ error: "Estado no encontrado" });
    res.json(estado);
  } catch (error) {
    console.error("Error obteniendo estado:", error);
    res.status(500).json({ error: "Error al obtener el estado" });
  }
}

export async function EditarEstadoController(req, res) {
  try {
    const { id_estado } = req.params;
    const data = await EditarEstado(id_estado, req.body);
    res.json(data);
  } catch (error) {
    console.error("Error editando estado:", error);
    res.status(500).json({ error: "Error al editar el estado" });
  }
}

export async function EliminarEstadoController(req, res) {
  try {
    const { id_estado } = req.params;
    const data = await EliminarEstado(id_estado);
    res.json(data);
  } catch (error) {
    console.error("Error eliminando estado:", error);
    res.status(500).json({ error: "Error al eliminar el estado" });
  }
}
