// backend/src/routes/ServicioRoutes.js
import express from "express";
import {
  CrearServicioController,
  ListarServicios,
  ListarServicioPorId,
  ObtenerImagen,
  ObtenerImagenBase64,
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

// Rutas para obtener archivos con mejor calidad
router.get("/Imagen/:id_servicio", ObtenerImagen); // Formato binario (mejor calidad)
router.get("/ImagenBase64/:id_servicio", ObtenerImagenBase64); // Formato base64 (si se necesita)
router.get("/Documentacion/:id_servicio", ObtenerDocumentacion);

export default router;