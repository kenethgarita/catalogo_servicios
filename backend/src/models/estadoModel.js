import { connectDB } from "../config/db.js";
import sql from "mssql";

// Crear Estado
export async function CrearEstado({ nombre_estado }) {
  const pool = await connectDB();
  await pool
    .request()
    .input("nombre_estado", sql.VarChar, nombre_estado)
    .query("INSERT INTO Estado (nombre_estado) VALUES (@nombre_estado)");
  return { mensaje: "Estado creado correctamente" };
}

// Obtener todos los Estados
export async function ObtenerEstados() {
  const pool = await connectDB();
  const result = await pool.request().query("SELECT * FROM Estado");
  return result.recordset;
}

// Obtener Estado por ID
export async function ObtenerEstadoPorId(id_estado) {
  const pool = await connectDB();
  const result = await pool
    .request()
    .input("id_estado", sql.Int, id_estado)
    .query("SELECT * FROM Estado WHERE id_estado = @id_estado");
  return result.recordset[0];
}

// Editar Estado
export async function EditarEstado(id_estado, { nombre_estado }) {
  const pool = await connectDB();
  await pool
    .request()
    .input("id_estado", sql.Int, id_estado)
    .input("nombre_estado", sql.VarChar, nombre_estado).query(`
      UPDATE Estado
      SET nombre_estado = @nombre_estado
      WHERE id_estado = @id_estado
    `);
  return { mensaje: "Estado actualizado correctamente" };
}

// Eliminar Estado
export async function EliminarEstado(id_estado) {
  const pool = await connectDB();
  await pool
    .request()
    .input("id_estado", sql.Int, id_estado)
    .query("DELETE FROM Estado WHERE id_estado = @id_estado");
  return { mensaje: "Estado eliminado correctamente" };
}
