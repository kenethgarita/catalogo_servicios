import express from 'express';
import { solicitarRecuperacion, restablecerContrasena } from '../controllers/passwordController.js';

const router = express.Router();

router.post('/forgot-password', solicitarRecuperacion);
router.post('/reset-password/:token', restablecerContrasena);

export default router;