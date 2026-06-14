import express from 'express';
import { shortenUrl, getUrls, deleteUrl, getUrlAnalytics } from '../controllers/urlController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All URL operations are protected routes (require a valid JWT token)
router.post('/shorten', protect, shortenUrl);
router.get('/', protect, getUrls);
router.delete('/:id', protect, deleteUrl);
router.get('/:id/analytics', protect, getUrlAnalytics);

export default router;
