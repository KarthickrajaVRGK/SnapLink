import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// Route POST request for registering a new user
router.post('/register', registerUser);

// Route POST request for logging in an existing user
router.post('/login', loginUser);

export default router;
