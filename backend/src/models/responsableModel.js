import { connectDB } from "../config/db.js";
import sql from "mssql";

// Crear responsable
export async function CrearResponsable({ id_usuario, id_servicio }) {
  const pool = await connectDB();
  const result = await pool
    .request()
    .input("id_usuario", sql.Int, id_usuario)
    .input("id_servicio", sql.Int, id_servicio).query(`
            INSERT INTO Responsable (id_usuario, id_servicio)
            VALUES (@id_usuario, @id_servicio);
            SELECT SCOPE_IDENTITY() AS id_responsable;
        `);
  return result.recordset[0];
}

// Obtener todos los responsables
export async function ObtenerResponsables() {
  const pool = await connectDB();
  const result = await pool.request().query(`
            SELECT r.*, u.nombre, u.apellido1, s.nombre_servicio
            FROM Responsable r
            JOIN Usuario u ON r.id_usuario = u.id_usuario
            JOIN Servicio s ON r.id_servicio = s.id_servicio
        `);
  return result.recordset;
}

// Obtener responsable por id
export async function ObtenerResponsablePorId(id_responsable) {
  const pool = await connectDB();
  const result = await pool
    .request()
    .input("id_responsable", sql.Int, id_responsable)
    .query("SELECT * FROM Responsable WHERE id_responsable = @id_responsable");
  return result.recordset[0];
}

// Actualizar responsable
export async function ActualizarResponsable(
  id_responsable,
  { id_usuario, id_servicio }
) {
  const pool = await connectDB();
  const result = await pool
    .request()
    .input("id_responsable", sql.Int, id_responsable)
    .input("id_usuario", sql.Int, id_usuario)
    .input("id_servicio", sql.Int, id_servicio).query(`
            UPDATE Responsable
            SET id_usuario = COALESCE(@id_usuario, id_usuario),
                id_servicio = COALESCE(@id_servicio, id_servicio)
            WHERE id_responsable = @id_responsable
        `);
  return result.rowsAffected[0];
}

// Eliminar responsable
export async function EliminarResponsable(id_responsable) {
  const pool = await connectDB();
  const result = await pool
    .request()
    .input("id_responsable", sql.Int, id_responsable)
    .query("DELETE FROM Responsable WHERE id_responsable = @id_responsable");
  return result.rowsAffected[0];
}
