import {
  CrearServicio,
  ObtenerServicios,
  ObtenerServicioPorId,
  ActualizarServicio,
  EliminarServicio,
} from "../models/servicioModel.js";

export const CrearServicioController = async (req, res) => {
  try {
    const servicio = await CrearServicio(req.body);
    res.status(201).json(servicio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el servicio" });
  }
};

export const ListarServicios = async (req, res) => {
  try {
    const { categoria, incluirInactivos } = req.query;

    const servicios = await ObtenerServicios({
      id_categoria: categoria ? parseInt(categoria) : null,
      incluirInactivos: incluirInactivos === "true",
    });

    res.status(200).json(servicios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al listar los servicios" });
  }
};

export const ListarServicioPorId = async (req, res) => {
  const { id_servicio } = req.params;
  try {
    const servicio = await ObtenerServicioPorId(id_servicio);
    if (!servicio)
      return res.status(404).json({ error: "Servicio no encontrado" });
    res.status(200).json(servicio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el servicio" });
  }
};

export const EditarServicio = async (req, res) => {
  const { id_servicio } = req.params;
  try {
    const filas = await ActualizarServicio(id_servicio, req.body);
    if (filas === 0)
      return res.status(404).json({ error: "Servicio no encontrado" });
    res.status(200).json({ mensaje: "Servicio actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el servicio" });
  }
};

export const BorrarServicio = async (req, res) => {
  const { id_servicio } = req.params;
  try {
    const filas = await EliminarServicio(id_servicio);
    if (filas === 0)
      return res.status(404).json({ error: "Servicio no encontrado" });
    res.status(200).json({ mensaje: "Servicio eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el servicio" });
  }
};
