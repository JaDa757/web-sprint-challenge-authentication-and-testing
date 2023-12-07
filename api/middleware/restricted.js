const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config'); 

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token required' });
  }

  jwt.verify(token, JWT_SECRET || 'shh', (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: 'Token invalid' });
    }

    req.decodedToken = decodedToken;
    next();
  });
};
