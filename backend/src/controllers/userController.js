import express from "express";
import {
  CrearUsuario,
  ObtenerUsuarios,
  ObtenerUsuarioPorId,
  ActualizarUsuario,
  EliminarUsuario,
  LoginUsuario,
} from "../models/userModel.js";

// Crear usuario
export const CreaUsuario = async (req, res) => {
  const {
    nombre,
    apellido1,
    apellido2,
    cargo,
    municipalidad,
    correo,
    contrasena,
    num_tel,
    id_rol,
  } = req.body;

  if (
    !nombre ||
    !apellido1 ||
    !apellido2 ||
    !cargo ||
    !municipalidad ||
    !correo ||
    !contrasena ||
    !num_tel
  ) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const usuario = await CrearUsuario({
      nombre,
      apellido1,
      apellido2,
      cargo,
      municipalidad,
      correo,
      contrasena,
      num_tel,
      id_rol,
    });
    res.status(201).json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando al usuario" });
  }
};

// Login usuario
export const LoginUsuarioController = async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res
      .status(400)
      .json({ error: "Correo y contraseña son obligatorios" });
  }

  try {
    const loginResult = await LoginUsuario({ correo, contrasena });

    if (loginResult === null) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (loginResult === false) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    res.status(200).json(loginResult);
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno al iniciar sesión" });
  }
};

// Listar todos los usuarios
export const ListaUsuarios = async (req, res) => {
  try {
    const usuarios = await ObtenerUsuarios();
    res.status(200).json({ usuarios });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo los usuarios" });
  }
};

// Obtener usuario por id
export const ListaUsuarioPorId = async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const usuario = await ObtenerUsuarioPorId(id_usuario);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo el usuario" });
  }
};

// Actualizar usuario
export const EditarUsuario = async (req, res) => {
  const { id_usuario } = req.params;
  const {
    nombre,
    apellido1,
    apellido2,
    cargo,
    municipalidad,
    correo,
    contrasena,
    num_tel,
    id_rol,
  } = req.body;

  if (
    !nombre ||
    !apellido1 ||
    !apellido2 ||
    !cargo ||
    !municipalidad ||
    !correo ||
    !num_tel
  ) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const filasActualizadas = await ActualizarUsuario(id_usuario, {
      nombre,
      apellido1,
      apellido2,
      cargo,
      municipalidad,
      correo,
      contrasena,
      num_tel,
      id_rol,
    });

    if (filasActualizadas === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json({ mensaje: "Usuario actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando el usuario" });
  }
};

// Eliminar usuario
export const BorrarUsuario = async (req, res) => {
  const { id_usuario } = req.params;

  try {
    const filasEliminadas = await EliminarUsuario(id_usuario);

    if (filasEliminadas === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminando el usuario" });
  }
};
