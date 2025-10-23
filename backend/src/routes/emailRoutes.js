import express from 'express';
import { sendConfirmationEmail, sendManualResponse } from '../controllers/emailController.js';

const router = express.Router();

router.post('/auto', sendConfirmationEmail);
router.post('/manual', sendManualResponse);

export default router;
