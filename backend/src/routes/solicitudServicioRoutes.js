import express from "express";
import { CreaSolicitudServicio, ListaSolicitudServicios, ListaSolicitudServicioPorId, EditarSolicitudServicio, BorrarSolicitudServicio } from "../controllers/solicitudServicioController.js";

const Router = express.Router();

Router.post("/CrearSolicitudServicio", CreaSolicitudServicio);
Router.get("/ObtenerSolicitudServicios", ListaSolicitudServicios);
Router.get("/ObtenerSolicitudServicio/:id_solicitud_servicio", ListaSolicitudServicioPorId);
Router.put("/EditarSolicitudServicio/:id_solicitud_servicio", EditarSolicitudServicio);
Router.delete("/EliminarSolicitudServicio/:id_solicitud_servicio", BorrarSolicitudServicio);

export default Router;
