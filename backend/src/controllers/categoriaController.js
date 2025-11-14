import {
  CrearCategoria,
  ObtenerCategorias,
  ObtenerCategoriaPorId,
  ActualizarCategoria,
  EliminarCategoria,
} from "../models/categoriaModel.js";

export const CreaCategoria = async (req, res) => {
  const { nombre_categoria } = req.body;
  if (!nombre_categoria)
    return res
      .status(400)
      .json({ error: "El nombre de la categoría es obligatorio" });

  try {
    const categoria = await CrearCategoria({ nombre_categoria });
    res.status(201).json(categoria);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando la categoría" });
  }
};

export const ListaCategorias = async (req, res) => {
  try {
    const categorias = await ObtenerCategorias();
    res.status(200).json({ categorias });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo las categorías" });
  }
};

export const ListaCategoriaPorId = async (req, res) => {
  const { id_categoria } = req.params;
  try {
    const categoria = await ObtenerCategoriaPorId(id_categoria);
    if (!categoria)
      return res.status(404).json({ error: "Categoría no encontrada" });
    res.status(200).json(categoria);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo la categoría" });
  }
};

export const EditarCategoria = async (req, res) => {
  const { id_categoria } = req.params;
  try {
    const filas = await ActualizarCategoria(id_categoria, req.body);
    if (filas === 0)
      return res.status(404).json({ error: "Categoría no encontrada" });
    res.status(200).json({ mensaje: "Categoría actualizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando la categoría" });
  }
};

export const BorrarCategoria = async (req, res) => {
  const { id_categoria } = req.params;
  try {
    const filas = await EliminarCategoria(id_categoria);
    if (filas === 0)
      return res.status(404).json({ error: "Categoría no encontrada" });
    res.status(200).json({ mensaje: "Categoría eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminando la categoría" });
  }
};
