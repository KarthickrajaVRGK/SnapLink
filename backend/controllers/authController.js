import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * @desc    Generate JWT Token
 * @param   {string} id - User ID
 * @returns {string} Signed JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // 1. Validate inputs exist
    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide both an email and password');
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists with this email');
    }

    // 3. Create user (Mongoose pre-save hook in User.js handles hashing password)
    const user = await User.create({
      email: email.toLowerCase(),
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data provided');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // 1. Validate inputs exist
    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide both email and password');
    }

    // 2. Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    // 3. Verify user exists and credentials match
    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};
