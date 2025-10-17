import { connectDB } from "../config/db.js";
import sql from "mssql";

// Crear solicitud
export async function CrearSolicitud({ id_usuario, detalles_solicitud, id_estado }) {
    const pool = await connectDB();

    // Si no se indica el estado, usar el estado con id = 1 ("Pendiente")
    const estadoAsignado = id_estado || 1;

    const result = await pool.request()
        .input("id_usuario", sql.Int, id_usuario)
        .input("detalles_solicitud", sql.NVarChar, detalles_solicitud)
        .input("id_estado", sql.Int, estadoAsignado)
        .query(`
            INSERT INTO Solicitud (id_usuario, detalles_solicitud, id_estado, fecha_solicitud)
            VALUES (@id_usuario, @detalles_solicitud, @id_estado, GETDATE());
            SELECT SCOPE_IDENTITY() AS id_solicitud;
        `);

    return result.recordset[0];
}

// Obtener todas las solicitudes
export async function ObtenerSolicitudes() {
    const pool = await connectDB();
    const result = await pool.request()
        .query(`
            SELECT s.id_solicitud, s.detalles_solicitud, s.fecha_solicitud,
                   u.nombre AS nombre_usuario, u.apellido1 AS apellido_usuario,
                   e.nombre_estado
            FROM Solicitud s
            JOIN Usuario u ON s.id_usuario = u.id_usuario
            JOIN Estado e ON s.id_estado = e.id_estado
        `);
    return result.recordset;
}

// Obtener solicitud por ID
export async function ObtenerSolicitudPorId(id_solicitud) {
    const pool = await connectDB();
    const result = await pool.request()
        .input("id_solicitud", sql.Int, id_solicitud)
        .query(`
            SELECT s.id_solicitud, s.detalles_solicitud, s.fecha_solicitud,
                   u.nombre AS nombre_usuario, u.apellido1 AS apellido_usuario,
                   e.nombre_estado
            FROM Solicitud s
            JOIN Usuario u ON s.id_usuario = u.id_usuario
            JOIN Estado e ON s.id_estado = e.id_estado
            WHERE s.id_solicitud = @id_solicitud
        `);
    return result.recordset[0];
}

// Actualizar solicitud
export async function ActualizarSolicitud(id_solicitud, { id_usuario, detalles_solicitud, id_estado }) {
    const pool = await connectDB();

    const result = await pool.request()
        .input("id_solicitud", sql.Int, id_solicitud)
        .input("id_usuario", sql.Int, id_usuario)
        .input("detalles_solicitud", sql.NVarChar, detalles_solicitud)
        .input("id_estado", sql.Int, id_estado)
        .query(`
            UPDATE Solicitud
            SET 
                id_usuario = COALESCE(@id_usuario, id_usuario),
                detalles_solicitud = COALESCE(@detalles_solicitud, detalles_solicitud),
                id_estado = COALESCE(@id_estado, id_estado)
            WHERE id_solicitud = @id_solicitud;
        `);
    return result.rowsAffected[0];
}

// Eliminar solicitud
export async function EliminarSolicitud(id_solicitud) {
    const pool = await connectDB();
    const result = await pool.request()
        .input("id_solicitud", sql.Int, id_solicitud)
        .query("DELETE FROM Solicitud WHERE id_solicitud = @id_solicitud");
    return result.rowsAffected[0];
}
