import { CrearSolicitud, ObtenerSolicitudes, ObtenerSolicitudPorId, ActualizarSolicitud, EliminarSolicitud } from "../models/solicitudModel.js";

export const CreaSolicitud = async (req, res) => {
    const { id_usuario, detalles_solicitud, id_estado } = req.body; // id_estado en lugar de estado_solicitud
    if (!id_usuario || !detalles_solicitud) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    try {
        const solicitud = await CrearSolicitud({ id_usuario, detalles_solicitud, id_estado }); // modelo asigna 1 si es undefined
        res.status(201).json(solicitud);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creando la solicitud" });
    }
};

export const ListaSolicitudes = async (req, res) => {
    try {
        const solicitudes = await ObtenerSolicitudes();
        res.status(200).json({ solicitudes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error obteniendo las solicitudes" });
    }
};

export const ListaSolicitudPorId = async (req, res) => {
    const { id_solicitud } = req.params;
    try {
        const solicitud = await ObtenerSolicitudPorId(id_solicitud);
        if (!solicitud) return res.status(404).json({ error: "Solicitud no encontrada" });
        res.status(200).json(solicitud);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error obteniendo la solicitud" });
    }
};

export const EditarSolicitud = async (req, res) => {
    const { id_solicitud } = req.params;
    const { id_usuario, detalles_solicitud, id_estado } = req.body; // actualizar id_estado
    try {
        const filasActualizadas = await ActualizarSolicitud(id_solicitud, { id_usuario, detalles_solicitud, id_estado });
        if (filasActualizadas === 0) return res.status(404).json({ error: "Solicitud no encontrada" });
        res.status(200).json({ mensaje: "Solicitud actualizada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error actualizando la solicitud" });
    }
};

export const BorrarSolicitud = async (req, res) => {
    const { id_solicitud } = req.params;
    try {
        const filasEliminadas = await EliminarSolicitud(id_solicitud);
        if (filasEliminadas === 0) return res.status(404).json({ error: "Solicitud no encontrada" });
        res.status(200).json({ mensaje: "Solicitud eliminada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error eliminando la solicitud" });
    }
};
