import { Router } from "express";
import {
  CrearEstadoController,
  ObtenerEstadosController,
  ObtenerEstadoPorIdController,
  EditarEstadoController,
  EliminarEstadoController
} from "../controllers/estadoController.js";
import { requireRol } from "../middlewares/requireRol.js";

const router = Router();

router.post("/CrearEstado",requireRol("Admin"), CrearEstadoController);
router.get("/ObtenerEstados", ObtenerEstadosController);
router.get("/ObtenerEstado/:id_estado", ObtenerEstadoPorIdController);
router.put("/EditarEstado/:id_estado",requireRol("Admin"), EditarEstadoController);
router.delete("/EliminarEstado/:id_estado",requireRol("Admin"), EliminarEstadoController);

export default router;
