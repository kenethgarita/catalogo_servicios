import express from "express";
import { CreaRol } from "../controllers/rolController.js";
import { ListaRoles } from "../controllers/rolController.js";
import { ListaRolesPorId } from "../controllers/rolController.js";
import { EditarRol } from "../controllers/rolController.js";
import { BorrarRol } from "../controllers/rolController.js";

const Router = express.Router()

Router.post("/CrearRol",CreaRol);
Router.get("/ObtenerRoles",ListaRoles)
Router.get("/ObtenerRoles/:id_rol",ListaRolesPorId)
Router.put("/EditarRoles/:id_rol",EditarRol)
Router.delete("/EliminarRol/:id_rol",BorrarRol)


export default Router;