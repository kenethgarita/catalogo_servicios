import { connectDB } from "../config/db.js";
import sql from "mssql";

// Crear servicio con soporte para archivos BLOB
export async function CrearServicio(servicioData) {
  const pool = await connectDB();
  const {
    nombre_servicio,
    descripcion_servicio,
    proposito_servicio,
    area_responsable,
    tiempo,
    activo = true,
    id_categoria,
    imagen_blob,
    imagen_tipo,
    imagen_nombre,
    documentacion_blob,
    documentacion_tipo,
    documentacion_nombre
  } = servicioData;

  const result = await pool
    .request()
    .input("nombre_servicio", sql.VarChar, nombre_servicio)
    .input("descripcion_servicio", sql.VarChar, descripcion_servicio)
    .input("proposito_servicio", sql.VarChar, proposito_servicio)
    .input("area_responsable", sql.VarChar, area_responsable)
    .input("tiempo", sql.VarChar, tiempo)
    .input("activo", sql.Bit, activo)
    .input("id_categoria", sql.Int, id_categoria)
    .input("imagen_blob", sql.VarBinary, imagen_blob || null)
    .input("imagen_tipo", sql.VarChar, imagen_tipo || null)
    .input("imagen_nombre", sql.VarChar, imagen_nombre || null)
    .input("documentacion_blob", sql.VarBinary, documentacion_blob || null)
    .input("documentacion_tipo", sql.VarChar, documentacion_tipo || null)
    .input("documentacion_nombre", sql.VarChar, documentacion_nombre || null)
    .query(`
      INSERT INTO Servicio (
        nombre_servicio, descripcion_servicio, proposito_servicio,
        area_responsable, tiempo, activo, id_categoria,
        imagen_blob, imagen_tipo, imagen_nombre,
        documentacion_blob, documentacion_tipo, documentacion_nombre
      )
      OUTPUT INSERTED.id_servicio
      VALUES (
        @nombre_servicio, @descripcion_servicio, @proposito_servicio,
        @area_responsable, @tiempo, @activo, @id_categoria,
        @imagen_blob, @imagen_tipo, @imagen_nombre,
        @documentacion_blob, @documentacion_tipo, @documentacion_nombre
      )
    `);

  return { id_servicio: result.recordset[0].id_servicio };
}

// Obtener servicios (sin BLOB, solo metadata)
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
      s.activo,
      s.id_categoria,
      s.imagen_tipo,
      s.imagen_nombre,
      s.documentacion_tipo,
      s.documentacion_nombre,
      c.nombre_categoria,
      CASE WHEN s.imagen_blob IS NOT NULL THEN 1 ELSE 0 END as tiene_imagen,
      CASE WHEN s.documentacion_blob IS NOT NULL THEN 1 ELSE 0 END as tiene_documentacion
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

// Obtener servicio por ID (con metadata pero sin BLOB completo)
export async function ObtenerServicioPorId(id_servicio) {
  const pool = await connectDB();
  const result = await pool.request()
    .input("id_servicio", sql.Int, id_servicio)
    .query(`
      SELECT 
        s.id_servicio,
        s.nombre_servicio,
        s.descripcion_servicio,
        s.proposito_servicio,
        s.area_responsable,
        s.tiempo,
        s.activo,
        s.id_categoria,
        s.imagen_tipo,
        s.imagen_nombre,
        s.documentacion_tipo,
        s.documentacion_nombre,
        c.nombre_categoria,
        CASE WHEN s.imagen_blob IS NOT NULL THEN 1 ELSE 0 END as tiene_imagen,
        CASE WHEN s.documentacion_blob IS NOT NULL THEN 1 ELSE 0 END as tiene_documentacion
      FROM Servicio s
      INNER JOIN Categoria c ON s.id_categoria = c.id_categoria
      WHERE s.id_servicio = @id_servicio
    `);
  return result.recordset[0];
}

// Obtener SOLO la imagen de un servicio
export async function ObtenerImagenServicio(id_servicio) {
  const pool = await connectDB();
  const result = await pool.request()
    .input("id_servicio", sql.Int, id_servicio)
    .query(`
      SELECT imagen_blob, imagen_tipo, imagen_nombre
      FROM Servicio
      WHERE id_servicio = @id_servicio
    `);
  return result.recordset[0];
}

// Obtener SOLO la documentación de un servicio
export async function ObtenerDocumentacionServicio(id_servicio) {
  const pool = await connectDB();
  const result = await pool.request()
    .input("id_servicio", sql.Int, id_servicio)
    .query(`
      SELECT documentacion_blob, documentacion_tipo, documentacion_nombre
      FROM Servicio
      WHERE id_servicio = @id_servicio
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
    activo,
    id_categoria,
    imagen_blob,
    imagen_tipo,
    imagen_nombre,
    documentacion_blob,
    documentacion_tipo,
    documentacion_nombre
  } = data;

  const result = await pool
    .request()
    .input("id_servicio", sql.Int, id_servicio)
    .input("nombre_servicio", sql.VarChar, nombre_servicio)
    .input("descripcion_servicio", sql.VarChar, descripcion_servicio)
    .input("proposito_servicio", sql.VarChar, proposito_servicio)
    .input("area_responsable", sql.VarChar, area_responsable)
    .input("tiempo", sql.VarChar, tiempo)
    .input("activo", sql.Bit, activo)
    .input("id_categoria", sql.Int, id_categoria)
    .input("imagen_blob", sql.VarBinary, imagen_blob || null)
    .input("imagen_tipo", sql.VarChar, imagen_tipo || null)
    .input("imagen_nombre", sql.VarChar, imagen_nombre || null)
    .input("documentacion_blob", sql.VarBinary, documentacion_blob || null)
    .input("documentacion_tipo", sql.VarChar, documentacion_tipo || null)
    .input("documentacion_nombre", sql.VarChar, documentacion_nombre || null)
    .query(`
      UPDATE Servicio SET
        nombre_servicio = @nombre_servicio,
        descripcion_servicio = @descripcion_servicio,
        proposito_servicio = @proposito_servicio,
        area_responsable = @area_responsable,
        tiempo = @tiempo,
        activo = @activo,
        id_categoria = @id_categoria,
        imagen_blob = COALESCE(@imagen_blob, imagen_blob),
        imagen_tipo = COALESCE(@imagen_tipo, imagen_tipo),
        imagen_nombre = COALESCE(@imagen_nombre, imagen_nombre),
        documentacion_blob = COALESCE(@documentacion_blob, documentacion_blob),
        documentacion_tipo = COALESCE(@documentacion_tipo, documentacion_tipo),
        documentacion_nombre = COALESCE(@documentacion_nombre, documentacion_nombre)
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