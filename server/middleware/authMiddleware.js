// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to authenticate users using JWT.
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Extract token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: 'No token provided, access denied' });
    }

    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user associated with the token
    const user = await User.findById(decoded.userId);

    // If user does not exist, deny access
    if (!user) {
      return res.status(401).json({ message: 'User not found, access denied' });
    }

    // Attach user information to the request object for later use
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // Handle invalid or expired token errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token, access denied' });
    }
    // Generic server error response
    res.status(500).json({ message: 'Authentication error, please try again' });
  }
};

module.exports = authMiddleware;
