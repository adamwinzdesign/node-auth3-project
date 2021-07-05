const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../config/secrets.js');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization) {
    jwt.verify(authorization, jwtSecret, (error, decodedToken) => {
      if (error) {
        res.status(401).json({ message: 'Invalid Credentials!' })
      } else {
        req.decodedToken = decodedToken;
        next();
      }
    })
  } else {
    res.status(400).json({ message: 'No credentials!' })
  }
};
