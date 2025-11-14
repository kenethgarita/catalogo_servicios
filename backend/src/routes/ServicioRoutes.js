// backend/src/routes/ServicioRoutes.js
import express from "express";
import {
  CrearServicioController,
  ListarServicios,
  ListarServicioPorId,
  ObtenerImagen,
  ObtenerDocumentacion,
  EditarServicio,
  BorrarServicio
} from "../controllers/servicioController.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";
import { requireRol } from "../middlewares/requireRol.js";

const router = express.Router();

// Rutas existentes
router.post("/CrearServicio", authMiddleware, requireRol("Admin"), CrearServicioController);
router.get("/ListarServicios", ListarServicios);
router.get("/ListarServicioPorId/:id_servicio", ListarServicioPorId);
router.put("/EditarServicio/:id_servicio", authMiddleware, requireRol("Admin"), EditarServicio);
router.delete("/BorrarServicio/:id_servicio", authMiddleware, requireRol("Admin"), BorrarServicio);

// Nuevas rutas para obtener archivos
router.get("/Imagen/:id_servicio", ObtenerImagen);
router.get("/Documentacion/:id_servicio", ObtenerDocumentacion);

export default router;