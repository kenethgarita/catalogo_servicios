import { connectDB } from "../config/db.js";
import sql from "mssql";

// Crear servicio
export async function CrearServicio({ nombre_servicio, descripcion_servicio, proposito_servicio, area_responsable, tiempo, documentacion_url, imagen_servicio, categoria }) {
    const pool = await connectDB();
    const result = await pool.request()
        .input("nombre_servicio", sql.VarChar, nombre_servicio)
        .input("descripcion_servicio", sql.VarChar, descripcion_servicio)
        .input("proposito_servicio", sql.VarChar, proposito_servicio)
        .input("area_responsable", sql.VarChar, area_responsable)
        .input("tiempo", sql.VarChar, tiempo)
        .input("documentacion_url", sql.NVarChar, documentacion_url)
        .input("imagen_servicio", sql.NVarChar, imagen_servicio)
        .input("categoria", sql.VarChar, categoria)
        .query(`
            INSERT INTO Servicio (nombre_servicio, descripcion_servicio, proposito_servicio, area_responsable, tiempo, documentacion_url, imagen_servicio, categoria)
            VALUES (@nombre_servicio, @descripcion_servicio, @proposito_servicio, @area_responsable, @tiempo, @documentacion_url, @imagen_servicio, @categoria);
            SELECT SCOPE_IDENTITY() AS id_servicio;
        `);
    return result.recordset[0];
}

// Obtener todos los servicios
export async function ObtenerServicios() {
    const pool = await connectDB();
    const result = await pool.request()
        .query("SELECT * FROM Servicio");
    return result.recordset;
}

// Obtener servicio por id
export async function ObtenerServicioPorId(id_servicio) {
    const pool = await connectDB();
    const result = await pool.request()
        .input("id_servicio", sql.Int, id_servicio)
        .query("SELECT * FROM Servicio WHERE id_servicio = @id_servicio");
    return result.recordset[0];
}

// Actualizar servicio
export async function ActualizarServicio(id_servicio, data) {
    const pool = await connectDB();
    const result = await pool.request()
        .input("id_servicio", sql.Int, id_servicio)
        .input("nombre_servicio", sql.VarChar, data.nombre_servicio)
        .input("descripcion_servicio", sql.VarChar, data.descripcion_servicio)
        .input("proposito_servicio", sql.VarChar, data.proposito_servicio)
        .input("area_responsable", sql.VarChar, data.area_responsable)
        .input("tiempo", sql.VarChar, data.tiempo)
        .input("documentacion_url", sql.NVarChar, data.documentacion_url)
        .input("imagen_servicio", sql.NVarChar, data.imagen_servicio)
        .input("categoria", sql.VarChar, data.categoria)
        .query(`
            UPDATE Servicio
            SET nombre_servicio = @nombre_servicio,
                descripcion_servicio = @descripcion_servicio,
                proposito_servicio = @proposito_servicio,
                area_responsable = @area_responsable,
                tiempo = @tiempo,
                documentacion_url = @documentacion_url,
                imagen_servicio = @imagen_servicio,
                categoria = @categoria
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
