import { connectDB } from "../config/db.js";

//Crear rol
export async function CrearRol({ nombre_rol }) {
  const pool = await connectDB();

  const result = await pool.request().input("nombre_rol", nombre_rol).query(`
        INSERT INTO Rol (nombre_rol)
        VALUES (@nombre_rol);
        SELECT SCOPE_IDENTITY() AS id_rol;
        `);
}

//Obtener todos los roles
export async function ObtenerRoles() {
  const pool = await connectDB();
  const result = await pool
    .request()
    .query("SELECT id_rol, nombre_rol FROM Rol");
  return result.recordset;
}

//Obtener rol por id
export async function ObtenerRolPorId(id_rol) {
  const pool = await connectDB();
  const result = await pool
    .request()
    .input("id_rol", id_rol)
    .query("SELECT id_rol, nombre_rol FROM Rol WHERE id_rol = @id_rol");
  return result.recordset[0];
}

//Actualizar rol
export async function ActualizarRol(id_rol, { nombre_rol }) {
  const pool = await connectDB();

  const result = await pool
    .request()
    .input("id_rol", id_rol)
    .input("nombre_rol", nombre_rol).query(`
            UPDATE Rol
            SET nombre_rol = @nombre_rol
            WHERE id_rol = @id_rol
        `);

  return result.rowsAffected[0]; // devuelve número de filas afectadas
}

//Eliminar rol
export async function EliminarRol(id_rol) {
  const pool = await connectDB();
  const result = await pool
    .request()
    .input("id_rol", id_rol)
    .query("DELETE FROM Rol WHERE id_rol = @id_rol");
  return result.rowsAffected[0];
}
