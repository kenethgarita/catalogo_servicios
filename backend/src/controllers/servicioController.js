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

    // Validar y limpiar base64 antes de convertir
    let imagen_blob = null;
    if (imagen_base64) {
      // Remover prefijo data:image/... si existe
      const base64Clean = imagen_base64.replace(/^data:image\/\w+;base64,/, '');
      imagen_blob = Buffer.from(base64Clean, 'base64');
    }
    
    let documentacion_blob = null;
    if (documentacion_base64) {
      const base64Clean = documentacion_base64.replace(/^data:application\/\w+;base64,/, '');
      documentacion_blob = Buffer.from(base64Clean, 'base64');
    }

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

// Endpoint específico para obtener la imagen con mejor calidad
export const ObtenerImagen = async (req, res) => {
  const { id_servicio } = req.params;
  try {
    const resultado = await ObtenerImagenServicio(id_servicio);
    
    if (!resultado || !resultado.imagen_blob) {
      return res.status(404).json({ error: "Imagen no encontrada" });
    }

    // MEJORA: Enviar la imagen directamente como respuesta binaria
    // en lugar de convertir a base64 (mejor calidad y rendimiento)
    const mimeType = resultado.imagen_tipo || 'image/jpeg';
    
    // Configurar headers para cache y calidad
    res.set({
      'Content-Type': mimeType,
      'Content-Length': resultado.imagen_blob.length,
      'Cache-Control': 'public, max-age=86400', // Cache por 24 horas
      'Content-Disposition': `inline; filename="${resultado.imagen_nombre || 'imagen.jpg'}"`,
      // Headers adicionales para mejor calidad
      'X-Content-Type-Options': 'nosniff',
      'Accept-Ranges': 'bytes'
    });
    
    // Enviar el buffer directamente
    res.send(resultado.imagen_blob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener la imagen" });
  }
};

// Alternativa: Endpoint que devuelve base64 optimizado (si se necesita)
export const ObtenerImagenBase64 = async (req, res) => {
  const { id_servicio } = req.params;
  try {
    const resultado = await ObtenerImagenServicio(id_servicio);
    
    if (!resultado || !resultado.imagen_blob) {
      return res.status(404).json({ error: "Imagen no encontrada" });
    }

    // Convertir a base64 sin el prefijo data:
    const base64Image = resultado.imagen_blob.toString('base64');
    const mimeType = resultado.imagen_tipo || 'image/jpeg';
    
    res.json({
      data: `data:${mimeType};base64,${base64Image}`,
      tipo: resultado.imagen_tipo,
      nombre: resultado.imagen_nombre,
      size: resultado.imagen_blob.length
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
    res.set({
      'Content-Type': resultado.documentacion_tipo || 'application/pdf',
      'Content-Length': resultado.documentacion_blob.length,
      'Content-Disposition': `attachment; filename="${resultado.documentacion_nombre || 'documento.pdf'}"`,
      'Cache-Control': 'private, max-age=3600'
    });
    
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

    // Limpiar y convertir base64 solo si se proporcionaron nuevos archivos
    let imagen_blob = null;
    if (imagen_base64) {
      const base64Clean = imagen_base64.replace(/^data:image\/\w+;base64,/, '');
      imagen_blob = Buffer.from(base64Clean, 'base64');
    }
    
    let documentacion_blob = null;
    if (documentacion_base64) {
      const base64Clean = documentacion_base64.replace(/^data:application\/\w+;base64,/, '');
      documentacion_blob = Buffer.from(base64Clean, 'base64');
    }

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