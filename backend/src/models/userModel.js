import { connectDB } from "../config/db.js";
import bcrypt from "bcrypt"

//Crear usuarios
export async function CrearUsuario({nombre,apellido1,apellido2,cargo,municipalidad,correo,contrasena,num_tel}) {
    const hasshedPassword = await bcrypt.hash(contrasena,10)
    const pool = await connectDB();

    const result = await pool.request()
        .input("nombre",nombre)
        .input("apellido1",apellido1)
        .input("apellido2",apellido2)
        .input("cargo",cargo)
        .input("municipalidad",municipalidad)
        .input("correo",correo)
        .input("contrasena",hasshedPassword)
        .input("num_tel",num_tel)
        .query(`
        INSERT INTO Usuario (nombre,apellido1,apellido2,cargo,municipalidad,correo,contrasena,num_tel)
        VALUES (@nombre,@apellido1,@apellido2,@cargo,@municipalidad,@correo,@contrasena,@num_tel);
        SELECT SCOPE_IDENTITY() AS id_usuario;
        `);

        return result.recordset[0];
}

//Obtener todos los usuarios
export async function ObtenerUsuarios() {
    const pool = await connectDB();
    const result = await pool.request()
        .query("SELECT id_usuario, nombre, apellido1, apellido2, cargo, municipalidad, correo, num_tel FROM Usuario");
    return result.recordset;
}

//Obtener usuario por id
export async function ObtenerUsuarioPorId(id_usuario) {
    const pool = await connectDB();
    const result = await pool.request()
        .input("id_usuario", id_usuario)
        .query("SELECT id_usuario, nombre, apellido1, apellido2, cargo, municipalidad, correo, num_tel FROM Usuario WHERE id_usuario = @id_usuario");
    return result.recordset[0];
}

//Actualizar usuarios
export async function ActualizarUsuario(id_usuario, {nombre, apellido1, apellido2, cargo, municipalidad, correo, contrasena, num_tel}) {
    const pool = await connectDB();

    let hashedPassword = null;
    if (contrasena) {
        hashedPassword = await bcrypt.hash(contrasena, 10);
    }

    const result = await pool.request()
        .input("id_usuario", id_usuario)
        .input("nombre", nombre)
        .input("apellido1", apellido1)
        .input("apellido2", apellido2)
        .input("cargo", cargo)
        .input("municipalidad", municipalidad)
        .input("correo", correo)
        .input("contrasena", hashedPassword)
        .input("num_tel", num_tel)
        .query(`
            UPDATE Usuario
            SET nombre = @nombre,
                apellido1 = @apellido1,
                apellido2 = @apellido2,
                cargo = @cargo,
                municipalidad = @municipalidad,
                correo = @correo,
                contrasena = COALESCE(@contrasena, contrasena),
                num_tel = @num_tel
            WHERE id_usuario = @id_usuario
        `);

    return result.rowsAffected[0]; // devuelve número de filas afectadas
}


//Eliminar usuario
export async function EliminarUsuario(id_usuario) {
    const pool = await connectDB();
    const result = await pool.request()
        .input("id_usuario", id_usuario)
        .query("DELETE FROM Usuario WHERE id_usuario = @id_usuario");
    return result.rowsAffected[0];
}

