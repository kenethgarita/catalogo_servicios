import { CrearServicio, ObtenerServicios, ObtenerServicioPorId, ActualizarServicio, EliminarServicio } from "../models/servicioModel.js";

export const CreaServicio = async (req, res) => {
    const data = req.body;
    if (!data.nombre_servicio || !data.descripcion_servicio || !data.proposito_servicio) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    try {
        const servicio = await CrearServicio(data);
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
        const filasActualizadas = await ActualizarServicio(id_servicio, req.body);
        if (filasActualizadas === 0) return res.status(404).json({ error: "Servicio no encontrado" });
        res.status(200).json({ mensaje: "Servicio actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error actualizando el servicio" });
    }
};

export const BorrarServicio = async (req, res) => {
    const { id_servicio } = req.params;
    try {
        const filasEliminadas = await EliminarServicio(id_servicio);
        if (filasEliminadas === 0) return res.status(404).json({ error: "Servicio no encontrado" });
        res.status(200).json({ mensaje: "Servicio eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error eliminando el servicio" });
    }
};
