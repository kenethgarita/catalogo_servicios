import { connectDB } from "../config/db.js";
import sql from "mssql";

// Crear solicitud
export async function CrearSolicitud({ id_usuario, detalles_solicitud, estado_solicitud }) {
    const pool = await connectDB();
    const result = await pool.request()
        .input("id_usuario", sql.Int, id_usuario)
        .input("detalles_solicitud", sql.NVarChar, detalles_solicitud)
        .input("estado_solicitud", sql.VarChar, estado_solicitud)
        .query(`
            INSERT INTO Solicitud (id_usuario, detalles_solicitud, estado_solicitud)
            VALUES (@id_usuario, @detalles_solicitud, @estado_solicitud);
            SELECT SCOPE_IDENTITY() AS id_solicitud;
        `);
    return result.recordset[0];
}

// Obtener todas las solicitudes
export async function ObtenerSolicitudes() {
    const pool = await connectDB();
    const result = await pool.request()
        .query(`
            SELECT s.*, u.nombre, u.apellido1
            FROM Solicitud s
            JOIN Usuario u ON s.id_usuario = u.id_usuario
        `);
    return result.recordset;
}

// Obtener solicitud por id
export async function ObtenerSolicitudPorId(id_solicitud) {
    const pool = await connectDB();
    const result = await pool.request()
        .input("id_solicitud", sql.Int, id_solicitud)
        .query("SELECT * FROM Solicitud WHERE id_solicitud = @id_solicitud");
    return result.recordset[0];
}

// Actualizar solicitud
export async function ActualizarSolicitud(id_solicitud, { id_usuario, detalles_solicitud, estado_solicitud }) {
    const pool = await connectDB();
    const result = await pool.request()
        .input("id_solicitud", sql.Int, id_solicitud)
        .input("id_usuario", sql.Int, id_usuario)
        .input("detalles_solicitud", sql.NVarChar, detalles_solicitud)
        .input("estado_solicitud", sql.VarChar, estado_solicitud)
        .query(`
            UPDATE Solicitud
            SET id_usuario = COALESCE(@id_usuario, id_usuario),
                detalles_solicitud = COALESCE(@detalles_solicitud, detalles_solicitud),
                estado_solicitud = COALESCE(@estado_solicitud, estado_solicitud)
            WHERE id_solicitud = @id_solicitud
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
