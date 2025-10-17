import { connectDB } from "../config/db.js";
import sql from "mssql";

// Crear servicio
export async function CrearServicio({
  nombre_servicio,
  descripcion_servicio,
  proposito_servicio,
  area_responsable,
  tiempo,
  documentacion_url,
  imagen_servicio,
  id_categoria
}) {
  const pool = await connectDB();
  const result = await pool.request()
    .input("nombre_servicio", sql.VarChar, nombre_servicio)
    .input("descripcion_servicio", sql.VarChar, descripcion_servicio)
    .input("proposito_servicio", sql.VarChar, proposito_servicio)
    .input("area_responsable", sql.VarChar, area_responsable)
    .input("tiempo", sql.VarChar, tiempo)
    .input("documentacion_url", sql.NVarChar, documentacion_url)
    .input("imagen_servicio", sql.NVarChar, imagen_servicio)
    .input("id_categoria", sql.Int, id_categoria)
    .query(`
      INSERT INTO Servicio (
        nombre_servicio, descripcion_servicio, proposito_servicio, 
        area_responsable, tiempo, documentacion_url, imagen_servicio, id_categoria
      ) 
      VALUES (
        @nombre_servicio, @descripcion_servicio, @proposito_servicio,
        @area_responsable, @tiempo, @documentacion_url, @imagen_servicio, @id_categoria
      );
      SELECT SCOPE_IDENTITY() AS id_servicio;
    `);
  return result.recordset[0];
}

// Obtener todos los servicios (con nombre de categoría)
export async function ObtenerServicios() {
  const pool = await connectDB();
  const result = await pool.request()
    .query(`
      SELECT s.*, c.nombre_categoria 
      FROM Servicio s
      LEFT JOIN Categoria c ON s.id_categoria = c.id_categoria
    `);
  return result.recordset;
}

// Obtener servicio por ID
export async function ObtenerServicioPorId(id_servicio) {
  const pool = await connectDB();
  const result = await pool.request()
    .input("id_servicio", sql.Int, id_servicio)
    .query(`
      SELECT s.*, c.nombre_categoria 
      FROM Servicio s
      LEFT JOIN Categoria c ON s.id_categoria = c.id_categoria
      WHERE s.id_servicio = @id_servicio
    `);
  return result.recordset[0];
}

// Actualizar servicio
export async function ActualizarServicio(id_servicio, data) {
  const {
    nombre_servicio,
    descripcion_servicio,
    proposito_servicio,
    area_responsable,
    tiempo,
    documentacion_url,
    imagen_servicio,
    id_categoria
  } = data;

  const pool = await connectDB();
  const result = await pool.request()
    .input("id_servicio", sql.Int, id_servicio)
    .input("nombre_servicio", sql.VarChar, nombre_servicio)
    .input("descripcion_servicio", sql.VarChar, descripcion_servicio)
    .input("proposito_servicio", sql.VarChar, proposito_servicio)
    .input("area_responsable", sql.VarChar, area_responsable)
    .input("tiempo", sql.VarChar, tiempo)
    .input("documentacion_url", sql.NVarChar, documentacion_url)
    .input("imagen_servicio", sql.NVarChar, imagen_servicio)
    .input("id_categoria", sql.Int, id_categoria)
    .query(`
      UPDATE Servicio
      SET 
        nombre_servicio = COALESCE(@nombre_servicio, nombre_servicio),
        descripcion_servicio = COALESCE(@descripcion_servicio, descripcion_servicio),
        proposito_servicio = COALESCE(@proposito_servicio, proposito_servicio),
        area_responsable = COALESCE(@area_responsable, area_responsable),
        tiempo = COALESCE(@tiempo, tiempo),
        documentacion_url = COALESCE(@documentacion_url, documentacion_url),
        imagen_servicio = COALESCE(@imagen_servicio, imagen_servicio),
        id_categoria = COALESCE(@id_categoria, id_categoria)
      WHERE id_servicio = @id_servicio
    `);
  return result.rowsAffected[0];
}

// Eliminar servicio
export async function EliminarServicio(id_servicio) {
  const pool = await connectDB();
  const result = await pool.request()
    .input("id_servicio", sql.Int, id_servicio)
    .query("DELETE FROM Servicio WHERE id_servicio = @id_servicio");
  return result.rowsAffected[0];
}
