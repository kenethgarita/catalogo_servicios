import express from "express";
import {
  ActualizarRol,
  CrearRol,
  EliminarRol,
  ObtenerRoles,
  ObtenerRolPorId,
} from "../models/rolModel.js";

export const CreaRol = async (req, res) => {
  const { nombre_rol } = req.body;

  if (!nombre_rol) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }
  try {
    const usuario = await CrearRol({ nombre_rol });
    res.status(201).json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando el rol" });
  }
};

export const ListaRoles = async (req, res) => {
  try {
    const roles = await ObtenerRoles();
    res.status(200).json({ roles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo los roles" });
  }
};

export const ListaRolesPorId = async (req, res) => {
  const { id_rol } = req.params;
  try {
    const rol = await ObtenerRolPorId(id_rol);
    if (!rol) {
      return res.status(404).json({ error: "Rol no encontrado" });
    }
    res.status(200).json(rol);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo el Rol" });
  }
};

// Actualizar usuario
export const EditarRol = async (req, res) => {
  const { id_rol } = req.params;
  const { nombre_rol } = req.body;

  if (!nombre_rol) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const filasActualizadas = await ActualizarRol(id_rol, {
      nombre_rol,
    });

    if (filasActualizadas === 0) {
      return res.status(404).json({ error: "Rol no encontrado" });
    }

    res.status(200).json({ mensaje: "Rol actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando el Rol" });
  }
};

// Eliminar rol
export const BorrarRol = async (req, res) => {
  const { id_rol } = req.params;

  try {
    const filasEliminadas = await EliminarRol(id_rol);

    if (filasEliminadas === 0) {
      return res.status(404).json({ error: "Rol no encontrado" });
    }

    res.status(200).json({ mensaje: "Rol eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminando el rol" });
  }
};
