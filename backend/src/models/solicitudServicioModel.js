import { connectDB } from "../config/db.js";
import sql from "mssql";

// Crear relación solicitud-servicio
export async function CrearSolicitudServicio({ id_solicitud, id_servicio }) {
  const pool = await connectDB();
  const result = await pool
    .request()
    .input("id_solicitud", sql.Int, id_solicitud)
    .input("id_servicio", sql.Int, id_servicio).query(`
            INSERT INTO Solicitud_servicio (id_solicitud, id_servicio)
            VALUES (@id_solicitud, @id_servicio);
            SELECT SCOPE_IDENTITY() AS id_solicitud_servicio;
        `);
  return result.recordset[0];
}

// Obtener todas las relaciones
export async function ObtenerSolicitudServicios() {
  const pool = await connectDB();
  const result = await pool.request().query(`
            SELECT ss.*, s.nombre_servicio, sol.detalles_solicitud
            FROM Solicitud_servicio ss
            JOIN Servicio s ON ss.id_servicio = s.id_servicio
            JOIN Solicitud sol ON ss.id_solicitud = sol.id_solicitud
        `);
  return result.recordset;
}

// Obtener por id
export async function ObtenerSolicitudServicioPorId(id_solicitud_servicio) {
  const pool = await connectDB();
  const result = await pool
    .request()
    .input("id_solicitud_servicio", sql.Int, id_solicitud_servicio)
    .query(
      "SELECT * FROM Solicitud_servicio WHERE id_solicitud_servicio = @id_solicitud_servicio"
    );
  return result.recordset[0];
}

// Actualizar relación
export async function ActualizarSolicitudServicio(
  id_solicitud_servicio,
  { id_solicitud, id_servicio }
) {
  const pool = await connectDB();
  const result = await pool
    .request()
    .input("id_solicitud_servicio", sql.Int, id_solicitud_servicio)
    .input("id_solicitud", sql.Int, id_solicitud)
    .input("id_servicio", sql.Int, id_servicio).query(`
            UPDATE Solicitud_servicio
            SET id_solicitud = COALESCE(@id_solicitud, id_solicitud),
                id_servicio = COALESCE(@id_servicio, id_servicio)
            WHERE id_solicitud_servicio = @id_solicitud_servicio
        `);
  return result.rowsAffected[0];
}

// Eliminar relación
export async function EliminarSolicitudServicio(id_solicitud_servicio) {
  const pool = await connectDB();
  const result = await pool
    .request()
    .input("id_solicitud_servicio", sql.Int, id_solicitud_servicio)
    .query(
      "DELETE FROM Solicitud_servicio WHERE id_solicitud_servicio = @id_solicitud_servicio"
    );
  return result.rowsAffected[0];
}
