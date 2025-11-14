import express from "express";
import {
  CrearServicioController,
  ListarServicios,
  ListarServicioPorId,
  EditarServicio,
  BorrarServicio
} from "../controllers/servicioController.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";
import { requireRol } from "../middlewares/requireRol.js";

const router = express.Router();

router.post("/CrearServicio", authMiddleware,requireRol("Admin"), CrearServicioController);
router.get("/ListarServicios", ListarServicios);
router.get("/ListarServicioPorId/:id_servicio", ListarServicioPorId);
router.put("/EditarServicio/:id_servicio",authMiddleware,requireRol("Admin"), EditarServicio);
router.delete("/BorrarServicio/:id_servicio",authMiddleware,requireRol("Admin"), BorrarServicio);

export default router;
