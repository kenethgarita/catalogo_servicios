import express from "express";
import {
  CreaCategoria,
  ListaCategorias,
  ListaCategoriaPorId,
  EditarCategoria,
  BorrarCategoria
} from "../controllers/categoriaController.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";
import { requireRol } from "../middlewares/requireRol.js";

const Router = express.Router();

Router.post("/CrearCategoria", requireRol("Admin"), CreaCategoria);
Router.get("/ObtenerCategorias", ListaCategorias);
Router.get("/ObtenerCategoria/:id_categoria", ListaCategoriaPorId);
Router.put("/EditarCategoria/:id_categoria",requireRol("Admin"), EditarCategoria);
Router.delete("/EliminarCategoria/:id_categoria",requireRol("Admin"), BorrarCategoria);

export default Router;
