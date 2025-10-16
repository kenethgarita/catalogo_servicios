import express from "express";
import { CreaServicio, ListaServicios, ListaServicioPorId, EditarServicio, BorrarServicio } from "../controllers/servicioController.js";

const Router = express.Router();

Router.post("/CrearServicio", CreaServicio);
Router.get("/ObtenerServicios", ListaServicios);
Router.get("/ObtenerServicio/:id_servicio", ListaServicioPorId);
Router.put("/EditarServicio/:id_servicio", EditarServicio);
Router.delete("/EliminarServicio/:id_servicio", BorrarServicio);

export default Router;
