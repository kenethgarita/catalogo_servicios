import express from "express";
import {
  CrearServicioController,
  ListarServicios,
  ListarServicioPorId,
  EditarServicio,
  BorrarServicio
} from "../controllers/servicioController.js";

const router = express.Router();

router.post("/CrearServicio", CrearServicioController);
router.get("/ListarServicios", ListarServicios);
router.get("/ListarServicioPorId/:id_servicio", ListarServicioPorId);
router.put("/EditarServicio/:id_servicio", EditarServicio);
router.delete("/BorrarServicio/:id_servicio", BorrarServicio);

export default router;
