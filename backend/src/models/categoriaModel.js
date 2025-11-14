import { connectDB } from "../config/db.js";
import sql from "mssql";

// Crear categoría
export async function CrearCategoria({ nombre_categoria }) {
  const pool = await connectDB();
  const result = await pool
    .request()
    .input("nombre_categoria", sql.VarChar, nombre_categoria).query(`
      INSERT INTO Categoria (nombre_categoria)
      VALUES (@nombre_categoria);
      SELECT SCOPE_IDENTITY() AS id_categoria;
    `);
  return result.recordset[0];
}

// Obtener todas las categorías
export async function ObtenerCategorias() {
  const pool = await connectDB();
  const result = await pool.request().query("SELECT * FROM Categoria");
  return result.recordset;
}

// Obtener categoría por ID
export async function ObtenerCategoriaPorId(id_categoria) {
  const pool = await connectDB();
  const result = await pool
    .request()
    .input("id_categoria", sql.Int, id_categoria)
    .query("SELECT * FROM Categoria WHERE id_categoria = @id_categoria");
  return result.recordset[0];
}

// Actualizar categoría
export async function ActualizarCategoria(id_categoria, { nombre_categoria }) {
  const pool = await connectDB();
  const result = await pool
    .request()
    .input("id_categoria", sql.Int, id_categoria)
    .input("nombre_categoria", sql.VarChar, nombre_categoria).query(`
      UPDATE Categoria
      SET nombre_categoria = COALESCE(@nombre_categoria, nombre_categoria)
      WHERE id_categoria = @id_categoria
    `);
  return result.rowsAffected[0];
}

// Eliminar categoría
export async function EliminarCategoria(id_categoria) {
  const pool = await connectDB();
  const result = await pool
    .request()
    .input("id_categoria", sql.Int, id_categoria)
    .query("DELETE FROM Categoria WHERE id_categoria = @id_categoria");
  return result.rowsAffected[0];
}
