import express from "express";
import {
  CreaCategoria,
  ListaCategorias,
  ListaCategoriaPorId,
  EditarCategoria,
  BorrarCategoria
} from "../controllers/categoriaController.js";

const Router = express.Router();

Router.post("/CrearCategoria", CreaCategoria);
Router.get("/ObtenerCategorias", ListaCategorias);
Router.get("/ObtenerCategoria/:id_categoria", ListaCategoriaPorId);
Router.put("/EditarCategoria/:id_categoria", EditarCategoria);
Router.delete("/EliminarCategoria/:id_categoria", BorrarCategoria);

export default Router;
