import express from "express";
import { 
  CreaSolicitud, 
  ListaSolicitudes, 
  ListaSolicitudPorId, 
  EditarSolicitud, 
  BorrarSolicitud,
  AceptarSolicitudController
} from "../controllers/solicitudController.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";
import { ObtenerSolicitudesPorUsuario } from "../controllers/solicitudController.js";

const Router = express.Router();

Router.post("/CrearSolicitud", authMiddleware, CreaSolicitud);
Router.get("/ObtenerSolicitudes", ListaSolicitudes);
Router.get('/ObtenerSolicitudesPorUsuario/:id_usuario', ObtenerSolicitudesPorUsuario);
Router.get("/ObtenerSolicitud/:id_solicitud", ListaSolicitudPorId);
Router.put("/EditarSolicitud/:id_solicitud", EditarSolicitud);
Router.delete("/EliminarSolicitud/:id_solicitud", BorrarSolicitud);

// Nueva ruta para aceptar solicitud
Router.put("/AceptarSolicitud/:id_solicitud", authMiddleware, AceptarSolicitudController);

export default Router;