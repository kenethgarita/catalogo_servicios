import { connectDB } from "../config/db.js";
import sql from "mssql";

// Crear solicitud
export async function CrearSolicitud({
  id_usuario,
  detalles_solicitud,
  id_estado,
}) {
  const pool = await connectDB();

  // Si no se indica el estado, usar el estado con id = 1 ("Pendiente")
  const estadoAsignado = id_estado || 1;

  const result = await pool
    .request()
    .input("id_usuario", sql.Int, id_usuario)
    .input("detalles_solicitud", sql.NVarChar, detalles_solicitud)
    .input("id_estado", sql.Int, estadoAsignado).query(`
            INSERT INTO Solicitud (id_usuario, detalles_solicitud, id_estado, fecha_solicitud, aceptada)
            VALUES (@id_usuario, @detalles_solicitud, @id_estado, GETDATE(), 0);
            SELECT SCOPE_IDENTITY() AS id_solicitud;
        `);

  return result.recordset[0];
}

//Obtener responsables de servicios específicos
export async function ObtenerResponsablesPorServicios(serviciosIds) {
  const pool = await connectDB();

  // Convertir array a string para SQL IN
  const idsString = serviciosIds.join(",");

  const result = await pool.request().query(`
            SELECT DISTINCT 
                u.id_usuario,
                u.nombre,
                u.apellido1,
                u.apellido2,
                u.correo,
                u.cargo
            FROM Usuario u
            INNER JOIN Responsable r ON u.id_usuario = r.id_usuario
            WHERE r.id_servicio IN (${idsString})
                AND u.correo IS NOT NULL
                AND u.correo != ''
        `);

  return result.recordset;
}

//Obtener información completa de la solicitud con servicios
export async function ObtenerInfoCompletaSolicitud(id_solicitud) {
  const pool = await connectDB();

  const result = await pool
    .request()
    .input("id_solicitud", sql.Int, id_solicitud).query(`
            SELECT 
                s.id_solicitud,
                s.detalles_solicitud,
                s.fecha_solicitud,
                s.aceptada,
                u.nombre AS solicitante_nombre,
                u.apellido1 AS solicitante_apellido1,
                u.apellido2 AS solicitante_apellido2,
                u.correo AS solicitante_correo,
                u.municipalidad AS solicitante_municipalidad,
                u.cargo AS solicitante_cargo,
                u.num_tel AS solicitante_telefono,
                e.nombre_estado,
                STRING_AGG(serv.nombre_servicio, ', ') AS servicios_solicitados
            FROM Solicitud s
            INNER JOIN Usuario u ON s.id_usuario = u.id_usuario
            INNER JOIN Estado e ON s.id_estado = e.id_estado
            LEFT JOIN Solicitud_servicio ss ON s.id_solicitud = ss.id_solicitud
            LEFT JOIN Servicio serv ON ss.id_servicio = serv.id_servicio
            WHERE s.id_solicitud = @id_solicitud
            GROUP BY 
                s.id_solicitud, s.detalles_solicitud, s.fecha_solicitud, s.aceptada,
                u.nombre, u.apellido1, u.apellido2, u.correo, 
                u.municipalidad, u.cargo, u.num_tel, e.nombre_estado
        `);

  return result.recordset[0];
}

// Obtener todas las solicitudes
export async function ObtenerSolicitudes() {
  const pool = await connectDB();
  const result = await pool.request().query(`
            SELECT s.id_solicitud, s.detalles_solicitud, s.fecha_solicitud, s.aceptada,
                   s.id_estado, s.id_usuario,
                   u.nombre AS nombre_usuario, u.apellido1 AS apellido_usuario,
                   e.nombre_estado
            FROM Solicitud s
            JOIN Usuario u ON s.id_usuario = u.id_usuario
            JOIN Estado e ON s.id_estado = e.id_estado
        `);
  return result.recordset;
}

//Listar por usuario
export async function ObtenerSolicitudesPorUsuarioDB(id_usuario) {
  const pool = await connectDB();
  const result = await pool.request().input("id_usuario", sql.Int, id_usuario)
    .query(`
            SELECT 
                s.id_solicitud,
                s.id_usuario,
                s.detalles_solicitud,
                s.fecha_solicitud,
                s.id_estado,
                s.aceptada,
                e.nombre_estado,
                u.nombre AS nombre_usuario,
                u.apellido1 AS apellido_usuario,
                u.apellido2 AS apellido2_usuario,
                --  AGREGAR APELLIDO2 DEL RESPONSABLE
                resp_usuario.nombre AS responsable_nombre,
                resp_usuario.apellido1 AS responsable_apellido1,
                resp_usuario.apellido2 AS responsable_apellido2,
                resp_usuario.correo AS responsable_correo
            FROM Solicitud s
            INNER JOIN Estado e ON s.id_estado = e.id_estado
            INNER JOIN Usuario u ON s.id_usuario = u.id_usuario
            LEFT JOIN Usuario resp_usuario ON s.id_responsable_acepta = resp_usuario.id_usuario
            WHERE s.id_usuario = @id_usuario
            ORDER BY s.fecha_solicitud DESC
        `);
  return result.recordset;
}

// Obtener solicitud por ID
export async function ObtenerSolicitudPorId(id_solicitud) {
  const pool = await connectDB();
  const result = await pool
    .request()
    .input("id_solicitud", sql.Int, id_solicitud).query(`
            SELECT s.id_solicitud, s.detalles_solicitud, s.fecha_solicitud, s.aceptada,
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
export async function ActualizarSolicitud(
  id_solicitud,
  { id_usuario, detalles_solicitud, id_estado, aceptada }
) {
  const pool = await connectDB();

  const result = await pool
    .request()
    .input("id_solicitud", sql.Int, id_solicitud)
    .input("id_usuario", sql.Int, id_usuario ?? null)
    .input("detalles_solicitud", sql.NVarChar, detalles_solicitud ?? null)
    .input("id_estado", sql.Int, id_estado ?? null)
    .input("aceptada", sql.Bit, aceptada ?? null).query(`
            UPDATE Solicitud
            SET 
                id_usuario = COALESCE(@id_usuario, id_usuario),
                detalles_solicitud = COALESCE(@detalles_solicitud, detalles_solicitud),
                id_estado = COALESCE(@id_estado, id_estado),
                aceptada = COALESCE(@aceptada, aceptada)
            WHERE id_solicitud = @id_solicitud;
        `);

  return result.rowsAffected[0];
}

//Aceptar solicitud
export async function AceptarSolicitud(id_solicitud, id_responsable) {
  const pool = await connectDB();

  const result = await pool
    .request()
    .input("id_solicitud", sql.Int, id_solicitud)
    .input("id_responsable", sql.Int, id_responsable).query(`
            UPDATE Solicitud
            SET aceptada = 1,
                id_responsable_acepta = @id_responsable
            WHERE id_solicitud = @id_solicitud;
        `);

  return result.rowsAffected[0];
}

// Eliminar solicitud
export async function EliminarSolicitud(id_solicitud) {
  const pool = await connectDB();

  // Primero eliminar dependencias
  await pool.request()
    .input("id_solicitud", sql.Int, id_solicitud)
    .query("DELETE FROM Solicitud_servicio WHERE id_solicitud = @id_solicitud");

  // Luego la solicitud
  const result = await pool.request()
    .input("id_solicitud", sql.Int, id_solicitud)
    .query("DELETE FROM Solicitud WHERE id_solicitud = @id_solicitud");

  return result.rowsAffected[0];
}