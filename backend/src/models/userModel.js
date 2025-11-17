import { connectDB } from "../config/db.js";
import bcrypt from "bcrypt";
import sql from "mssql";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middlewares/authmiddleware.js";

// Crear usuarios
export async function CrearUsuario({
  nombre,
  apellido1,
  apellido2,
  cargo,
  municipalidad,
  correo,
  contrasena,
  num_tel,
  id_rol,
}) {
  const hashedPassword = await bcrypt.hash(contrasena, 10);
  const pool = await connectDB();

  // Si no se pasa id_rol, por defecto es 1
  const rol = id_rol || 1;

  const result = await pool
    .request()
    .input("nombre", sql.VarChar, nombre)
    .input("apellido1", sql.VarChar, apellido1)
    .input("apellido2", sql.VarChar, apellido2)
    .input("cargo", sql.VarChar, cargo)
    .input("municipalidad", sql.VarChar, municipalidad)
    .input("correo", sql.VarChar, correo)
    .input("contrasena", sql.NVarChar, hashedPassword)
    .input("num_tel", sql.VarChar, num_tel)
    .input("id_rol", sql.Int, rol).query(`
            INSERT INTO Usuario (nombre, apellido1, apellido2, cargo, municipalidad, correo, contrasena, num_tel, id_rol)
            VALUES (@nombre, @apellido1, @apellido2, @cargo, @municipalidad, @correo, @contrasena, @num_tel, @id_rol);
            SELECT SCOPE_IDENTITY() AS id_usuario;
        `);

  return result.recordset[0];
}

// Login
export async function LoginUsuario({ correo, contrasena }) {
  const pool = await connectDB();

  // Trae usuario + rol + si es responsable
  const result = await pool.request().input("correo", sql.VarChar, correo)
    .query(`
      SELECT 
        u.id_usuario,
        u.nombre,
        u.apellido1,
        u.contrasena,
        u.correo,
        r.nombre_rol,
        u.twofa_enabled,
        CASE 
          WHEN EXISTS (
            SELECT 1 
            FROM Responsable resp 
            WHERE resp.id_usuario = u.id_usuario
          ) THEN 1 
          ELSE 0 
        END AS es_responsable
      FROM Usuario u
      JOIN Rol r ON u.id_rol = r.id_rol
      WHERE u.correo = @correo
    `);

  const user = result.recordset[0];
  if (!user) return null; // usuario no encontrado

  // Validar contraseña
  const passwordIsValid = await bcrypt.compare(contrasena, user.contrasena);
  if (!passwordIsValid) return false; // contraseña incorrecta

  // ✅ CORREGIDO: Si tiene 2FA, devolver info SIN token
  if (user.twofa_enabled === 1 || user.twofa_enabled === true) {
    return {
      requiere2FA: true,
      id_usuario: user.id_usuario,
      nombre: user.nombre
    };
  }

  // ✅ Si NO tiene 2FA, generar token normalmente
  const payload = {
    id_usuario: user.id_usuario,
    rol: user.nombre_rol,
    es_responsable: user.es_responsable === 1,
    correo: user.correo,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });

  return {
    token,
    usuario: {
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      apellido1: user.apellido1,
      rol: user.nombre_rol,
      es_responsable: user.es_responsable === 1,
      correo: user.correo,
    },
  };
}


// Obtener todos los usuarios
export async function ObtenerUsuarios() {
  const pool = await connectDB();
  const result = await pool
    .request()
    .query(
      "SELECT id_usuario, nombre, apellido1, apellido2, cargo, municipalidad, correo, num_tel, id_rol FROM Usuario"
    );
  return result.recordset;
}

// Obtener usuario por id
export async function ObtenerUsuarioPorId(id_usuario) {
  const pool = await connectDB();
  const result = await pool
    .request()
    .input("id_usuario", sql.Int, id_usuario)
    .query(
      "SELECT id_usuario, nombre, apellido1, apellido2, cargo, municipalidad, correo, num_tel, id_rol FROM Usuario WHERE id_usuario = @id_usuario"
    );
  return result.recordset[0];
}

// Actualizar usuarios
export async function ActualizarUsuario(
  id_usuario,
  {
    nombre,
    apellido1,
    apellido2,
    cargo,
    municipalidad,
    correo,
    contrasena,
    num_tel,
    id_rol,
  }
) {
  const pool = await connectDB();

  let hashedPassword = null;
  if (contrasena) {
    hashedPassword = await bcrypt.hash(contrasena, 10);
  }

  const result = await pool
    .request()
    .input("id_usuario", sql.Int, id_usuario)
    .input("nombre", sql.VarChar, nombre)
    .input("apellido1", sql.VarChar, apellido1)
    .input("apellido2", sql.VarChar, apellido2)
    .input("cargo", sql.VarChar, cargo)
    .input("municipalidad", sql.VarChar, municipalidad)
    .input("correo", sql.VarChar, correo)
    .input("contrasena", sql.NVarChar, hashedPassword)
    .input("num_tel", sql.VarChar, num_tel)
    .input("id_rol", sql.Int, id_rol).query(`
            UPDATE Usuario
            SET nombre = @nombre,
                apellido1 = @apellido1,
                apellido2 = @apellido2,
                cargo = @cargo,
                municipalidad = @municipalidad,
                correo = @correo,
                contrasena = COALESCE(@contrasena, contrasena),
                num_tel = @num_tel,
                id_rol = COALESCE(@id_rol, id_rol)
            WHERE id_usuario = @id_usuario
        `);

  return result.rowsAffected[0];
}

// Eliminar usuario
export async function EliminarUsuario(id_usuario) {
  const pool = await connectDB();
  const result = await pool
    .request()
    .input("id_usuario", sql.Int, id_usuario)
    .query("DELETE FROM Usuario WHERE id_usuario = @id_usuario");
  return result.rowsAffected[0];
}
