import { connectDB } from "../config/db.js";
import sql from "mssql";

// Crear servicio
export async function CrearServicio(servicioData) {
  const pool = await connectDB();
  const {
    nombre_servicio,
    descripcion_servicio,
    proposito_servicio,
    area_responsable,
    tiempo,
    documentacion_url,
    imagen_servicio,
    activo = true,
    id_categoria,
  } = servicioData;

  const result = await pool
    .request()
    .input("nombre_servicio", sql.VarChar, nombre_servicio)
    .input("descripcion_servicio", sql.VarChar, descripcion_servicio)
    .input("proposito_servicio", sql.VarChar, proposito_servicio)
    .input("area_responsable", sql.VarChar, area_responsable)
    .input("tiempo", sql.VarChar, tiempo)
    .input("documentacion_url", sql.NVarChar, documentacion_url)
    .input("imagen_servicio", sql.NVarChar, imagen_servicio)
    .input("activo", sql.Bit, activo)
    .input("id_categoria", sql.Int, id_categoria).query(`
      INSERT INTO Servicio (
        nombre_servicio, descripcion_servicio, proposito_servicio,
        area_responsable, tiempo, documentacion_url, imagen_servicio, activo, id_categoria
      )
      OUTPUT INSERTED.*
      VALUES (
        @nombre_servicio, @descripcion_servicio, @proposito_servicio,
        @area_responsable, @tiempo, @documentacion_url, @imagen_servicio, @activo, @id_categoria
      )
    `);

  return result.recordset[0];
}

// Obtener servicios (JOIN con Categoría)
export async function ObtenerServicios({
  id_categoria = null,
  incluirInactivos = false,
} = {}) {
  const pool = await connectDB();

  let query = `
    SELECT 
      s.id_servicio,
      s.nombre_servicio,
      s.descripcion_servicio,
      s.proposito_servicio,
      s.area_responsable,
      s.tiempo,
      s.documentacion_url,
      s.imagen_servicio,
      s.activo,
      s.id_categoria,
      c.nombre_categoria
    FROM Servicio s
    INNER JOIN Categoria c ON s.id_categoria = c.id_categoria
    WHERE 1=1
  `;

  if (!incluirInactivos) query += ` AND s.activo = 1`;
  if (id_categoria) query += ` AND s.id_categoria = @id_categoria`;

  const request = pool.request();
  if (id_categoria) request.input("id_categoria", sql.Int, id_categoria);

  const result = await request.query(query);
  return result.recordset;
}

// Obtener un servicio por ID (JOIN con Categoría)
export async function ObtenerServicioPorId(id_servicio) {
  const pool = await connectDB();
  const result = await pool.request().input("id_servicio", sql.Int, id_servicio)
    .query(`
      SELECT 
        s.id_servicio,
        s.nombre_servicio,
        s.descripcion_servicio,
        s.proposito_servicio,
        s.area_responsable,
        s.tiempo,
        s.documentacion_url,
        s.imagen_servicio,
        s.activo,
        s.id_categoria,
        c.nombre_categoria
      FROM Servicio s
      INNER JOIN Categoria c ON s.id_categoria = c.id_categoria
      WHERE s.id_servicio = @id_servicio
    `);
  return result.recordset[0];
}

// Actualizar servicio
export async function ActualizarServicio(id_servicio, data) {
  const pool = await connectDB();
  const {
    nombre_servicio,
    descripcion_servicio,
    proposito_servicio,
    area_responsable,
    tiempo,
    documentacion_url,
    imagen_servicio,
    activo,
    id_categoria,
  } = data;

  const result = await pool
    .request()
    .input("id_servicio", sql.Int, id_servicio)
    .input("nombre_servicio", sql.VarChar, nombre_servicio)
    .input("descripcion_servicio", sql.VarChar, descripcion_servicio)
    .input("proposito_servicio", sql.VarChar, proposito_servicio)
    .input("area_responsable", sql.VarChar, area_responsable)
    .input("tiempo", sql.VarChar, tiempo)
    .input("documentacion_url", sql.NVarChar, documentacion_url)
    .input("imagen_servicio", sql.NVarChar, imagen_servicio)
    .input("activo", sql.Bit, activo)
    .input("id_categoria", sql.Int, id_categoria).query(`
      UPDATE Servicio SET
        nombre_servicio = @nombre_servicio,
        descripcion_servicio = @descripcion_servicio,
        proposito_servicio = @proposito_servicio,
        area_responsable = @area_responsable,
        tiempo = @tiempo,
        documentacion_url = @documentacion_url,
        imagen_servicio = @imagen_servicio,
        activo = @activo,
        id_categoria = @id_categoria
      WHERE id_servicio = @id_servicio
    `);

  return result.rowsAffected[0];
}

// Eliminar servicio
export async function EliminarServicio(id_servicio) {
  const pool = await connectDB();
  const result = await pool
    .request()
    .input("id_servicio", sql.Int, id_servicio)
    .query(`DELETE FROM Servicio WHERE id_servicio = @id_servicio`);
  return result.rowsAffected[0];
}
