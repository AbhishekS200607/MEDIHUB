const { auth } = require('../models/firebase');

// Verify Firebase ID Token
async function verifyToken(req, res, next) {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(403).json({ error: 'Invalid or expired token' });
  }
}

// Role-based authorization
function requireRole(...roles) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      const { db } = require('../models/firebase');
      const userDoc = await db.collection('users').doc(req.user.uid).get();
      
      if (!userDoc.exists) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const userData = userDoc.data();
      req.userRole = userData.role;
      
      if (!roles.includes(userData.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      
      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({ error: 'Authorization failed' });
    }
  };
}

module.exports = { verifyToken, requireRole };
