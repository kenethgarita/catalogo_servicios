import express from "express";
import { CreaResponsable, ListaResponsables, ListaResponsablePorId, EditarResponsable, BorrarResponsable } from "../controllers/responsableController.js";

const Router = express.Router();

Router.post("/CrearResponsable", CreaResponsable);
Router.get("/ObtenerResponsables", ListaResponsables);
Router.get("/ObtenerResponsable/:id_responsable", ListaResponsablePorId);
Router.put("/EditarResponsable/:id_responsable", EditarResponsable);
Router.delete("/EliminarResponsable/:id_responsable", BorrarResponsable);

export default Router;
