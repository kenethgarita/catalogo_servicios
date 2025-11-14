import express from "express";
import { CreaRol } from "../controllers/rolController.js";
import { ListaRoles } from "../controllers/rolController.js";
import { ListaRolesPorId } from "../controllers/rolController.js";
import { EditarRol } from "../controllers/rolController.js";
import { BorrarRol } from "../controllers/rolController.js";
import { requireRol } from "../middlewares/requireRol.js";

const Router = express.Router()

Router.post("/CrearRol",requireRol("Admin"),CreaRol);
Router.get("/ObtenerRoles",ListaRoles)
Router.get("/ObtenerRoles/:id_rol",ListaRolesPorId)
Router.put("/EditarRoles/:id_rol",requireRol("Admin"),EditarRol)
Router.delete("/EliminarRol/:id_rol",requireRol("Admin"),BorrarRol)


export default Router;