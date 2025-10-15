import express from "express";
import { CreaUsuario } from "../controllers/userController.js";
import { ListaUsuarios } from "../controllers/userController.js";
import { ListaUsuarioPorId } from "../controllers/userController.js";
import { EditarUsuario } from "../controllers/userController.js";
import { BorrarUsuario } from "../controllers/userController.js";

const Router = express.Router();

Router.post("/CrearUsuario",CreaUsuario)
Router.get("/ObtenerUsuarios",ListaUsuarios)
Router.get("/ObtenerUsuario/:id_usuario",ListaUsuarioPorId)
Router.put("/EditarUsuario/:id_usuario",EditarUsuario)
Router.delete("/EliminarUsuario/:id_usuario",BorrarUsuario)

export default Router;