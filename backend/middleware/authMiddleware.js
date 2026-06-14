import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * @desc    Middleware to protect routes by verifying JWT in the Authorization header
 */
export const protect = async (req, res, next) => {
  let token;

  // 1. Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (split "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Get user from the database, excluding the password field
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      next();
    } catch (error) {
      console.error(`Token authorization error: ${error.message}`);
      res.status(401);
      
      // Customize error response if token has expired
      if (error.name === 'TokenExpiredError') {
        next(new Error('Not authorized, token has expired'));
      } else {
        next(new Error('Not authorized, token verification failed'));
      }
    }
  }

  // 4. Handle cases where authorization header or token is missing
  if (!token) {
    res.status(401);
    next(new Error('Not authorized, no token provided'));
  }
};
