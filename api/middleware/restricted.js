const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token required' });
  }

  jwt.verify(token, process.env.SECRET || 'shh', (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: 'Token invalid' });
    }

    req.decodedToken = decodedToken;
    next();
  });
};
