import express from "express";
import { CreaSolicitud, ListaSolicitudes, ListaSolicitudPorId, EditarSolicitud, BorrarSolicitud } from "../controllers/solicitudController.js";

const Router = express.Router();

Router.post("/CrearSolicitud", CreaSolicitud);
Router.get("/ObtenerSolicitudes", ListaSolicitudes);
Router.get("/ObtenerSolicitud/:id_solicitud", ListaSolicitudPorId);
Router.put("/EditarSolicitud/:id_solicitud", EditarSolicitud);
Router.delete("/EliminarSolicitud/:id_solicitud", BorrarSolicitud);

export default Router;
