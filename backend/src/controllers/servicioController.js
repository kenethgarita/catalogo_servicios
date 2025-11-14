// backend/src/controllers/servicioController.js
import {
  CrearServicio,
  ObtenerServicios,
  ObtenerServicioPorId,
  ObtenerImagenServicio,
  ObtenerDocumentacionServicio,
  ActualizarServicio,
  EliminarServicio,
} from "../models/servicioModel.js";

// Crear servicio con archivos
export const CrearServicioController = async (req, res) => {
  try {
    const {
      nombre_servicio,
      descripcion_servicio,
      proposito_servicio,
      area_responsable,
      tiempo,
      activo = true,
      id_categoria,
      imagen_base64,
      imagen_tipo,
      imagen_nombre,
      documentacion_base64,
      documentacion_tipo,
      documentacion_nombre
    } = req.body;

    // Convertir base64 a Buffer si existe
    const imagen_blob = imagen_base64 
      ? Buffer.from(imagen_base64, 'base64') 
      : null;
    
    const documentacion_blob = documentacion_base64 
      ? Buffer.from(documentacion_base64, 'base64') 
      : null;

    const servicio = await CrearServicio({
      nombre_servicio,
      descripcion_servicio,
      proposito_servicio,
      area_responsable,
      tiempo,
      activo,
      id_categoria,
      imagen_blob,
      imagen_tipo,
      imagen_nombre,
      documentacion_blob,
      documentacion_tipo,
      documentacion_nombre
    });

    res.status(201).json(servicio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el servicio" });
  }
};

// Listar servicios (sin archivos completos)
export const ListarServicios = async (req, res) => {
  try {
    const { categoria, incluirInactivos } = req.query;

    const servicios = await ObtenerServicios({
      id_categoria: categoria ? parseInt(categoria) : null,
      incluirInactivos: incluirInactivos === "true",
    });

    res.status(200).json(servicios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al listar los servicios" });
  }
};

// Obtener servicio por ID (sin archivos completos)
export const ListarServicioPorId = async (req, res) => {
  const { id_servicio } = req.params;
  try {
    const servicio = await ObtenerServicioPorId(id_servicio);
    if (!servicio)
      return res.status(404).json({ error: "Servicio no encontrado" });
    res.status(200).json(servicio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el servicio" });
  }
};

// Endpoint específico para obtener la imagen como base64
export const ObtenerImagen = async (req, res) => {
  const { id_servicio } = req.params;
  try {
    const resultado = await ObtenerImagenServicio(id_servicio);
    
    if (!resultado || !resultado.imagen_blob) {
      return res.status(404).json({ error: "Imagen no encontrada" });
    }

    // Convertir buffer a base64 y enviar como JSON
    const base64Image = resultado.imagen_blob.toString('base64');
    const dataUrl = `data:${resultado.imagen_tipo || 'image/jpeg'};base64,${base64Image}`;
    
    res.json({
      data: dataUrl,
      tipo: resultado.imagen_tipo,
      nombre: resultado.imagen_nombre
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener la imagen" });
  }
};

// Endpoint específico para obtener la documentación
export const ObtenerDocumentacion = async (req, res) => {
  const { id_servicio } = req.params;
  try {
    const resultado = await ObtenerDocumentacionServicio(id_servicio);
    
    if (!resultado || !resultado.documentacion_blob) {
      return res.status(404).json({ error: "Documentación no encontrada" });
    }

    // Establecer headers apropiados
    res.set('Content-Type', resultado.documentacion_tipo || 'application/pdf');
    res.set('Content-Disposition', `attachment; filename="${resultado.documentacion_nombre || 'documento.pdf'}"`);
    
    // Enviar el buffer directamente
    res.send(resultado.documentacion_blob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener la documentación" });
  }
};

// Actualizar servicio
export const EditarServicio = async (req, res) => {
  const { id_servicio } = req.params;
  try {
    const {
      nombre_servicio,
      descripcion_servicio,
      proposito_servicio,
      area_responsable,
      tiempo,
      activo,
      id_categoria,
      imagen_base64,
      imagen_tipo,
      imagen_nombre,
      documentacion_base64,
      documentacion_tipo,
      documentacion_nombre
    } = req.body;

    // Convertir base64 a Buffer solo si se proporcionaron nuevos archivos
    const imagen_blob = imagen_base64 
      ? Buffer.from(imagen_base64, 'base64') 
      : null;
    
    const documentacion_blob = documentacion_base64 
      ? Buffer.from(documentacion_base64, 'base64') 
      : null;

    const filas = await ActualizarServicio(id_servicio, {
      nombre_servicio,
      descripcion_servicio,
      proposito_servicio,
      area_responsable,
      tiempo,
      activo,
      id_categoria,
      imagen_blob,
      imagen_tipo,
      imagen_nombre,
      documentacion_blob,
      documentacion_tipo,
      documentacion_nombre
    });

    if (filas === 0)
      return res.status(404).json({ error: "Servicio no encontrado" });
    res.status(200).json({ mensaje: "Servicio actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el servicio" });
  }
};

// Eliminar servicio
export const BorrarServicio = async (req, res) => {
  const { id_servicio } = req.params;
  try {
    const filas = await EliminarServicio(id_servicio);
    if (filas === 0)
      return res.status(404).json({ error: "Servicio no encontrado" });
    res.status(200).json({ mensaje: "Servicio eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el servicio" });
  }
};