import express from 'express';
import { redirectUrl } from '../controllers/redirectController.js';

const router = express.Router();

// Root level redirection (maps '/:shortCode' to redirect logic)
router.get('/:shortCode', redirectUrl);

export default router;
