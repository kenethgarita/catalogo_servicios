import express from "express";
import { CreaUsuario } from "../controllers/userController.js";
import { ListaUsuarios } from "../controllers/userController.js";
import { ListaUsuarioPorId } from "../controllers/userController.js";
import { EditarUsuario } from "../controllers/userController.js";
import { BorrarUsuario } from "../controllers/userController.js";
import { LoginUsuarioController } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";

const Router = express.Router();

Router.post("/CrearUsuario",CreaUsuario)
Router.get("/ObtenerUsuarios",authMiddleware, ListaUsuarios)
Router.get("/ObtenerUsuario/:id_usuario",authMiddleware, ListaUsuarioPorId)
Router.put("/EditarUsuario/:id_usuario",authMiddleware,EditarUsuario)
Router.delete("/EliminarUsuario/:id_usuario",authMiddleware, BorrarUsuario)
Router.post("/Login",LoginUsuarioController)

export default Router;