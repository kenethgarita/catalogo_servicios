import express from 'express';
import {
  generarQR2FA,
  habilitarYVerificar2FA,
  verificar2FA,
  deshabilitar2FA,
  obtenerEstado2FA
} from '../controllers/twoFactorController.js';
import { authMiddleware } from '../middlewares/authmiddleware.js';

const router = express.Router();

// Rutas protegidas (requieren autenticación)
router.get('/generar-qr', authMiddleware, generarQR2FA);
router.post('/habilitar', authMiddleware, habilitarYVerificar2FA);
router.post('/deshabilitar', authMiddleware, deshabilitar2FA);
router.get('/estado', authMiddleware, obtenerEstado2FA);

// Ruta pública (para verificación durante login)
router.post('/verificar', verificar2FA);

export default router;