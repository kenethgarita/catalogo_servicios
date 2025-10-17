import { Router } from "express";
import {
  CrearEstadoController,
  ObtenerEstadosController,
  ObtenerEstadoPorIdController,
  EditarEstadoController,
  EliminarEstadoController
} from "../controllers/estadoController.js";

const router = Router();

router.post("/CrearEstado", CrearEstadoController);
router.get("/ObtenerEstados", ObtenerEstadosController);
router.get("/ObtenerEstado/:id_estado", ObtenerEstadoPorIdController);
router.put("/EditarEstado/:id_estado", EditarEstadoController);
router.delete("/EliminarEstado/:id_estado", EliminarEstadoController);

export default router;
