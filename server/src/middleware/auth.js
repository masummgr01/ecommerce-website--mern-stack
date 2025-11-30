const jwt = require('jsonwebtoken');

function auth(required = true) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      if (!required) return next();
      return res.status(401).json({ message: 'Authorization token missing' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id, role: decoded.role };
      next();
    } catch (err) {
      console.error('JWT verification failed', err.message);
      if (!required) return next();
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
}

module.exports = auth;
