const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const authRouter = require('../auth/authRouter.js');
const usersRouter = require('../users/usersRouter.js');
const restricted = require('../auth/restrictedMiddleware.js')

const server = express();

server.use(helmet());
server.use(express.json());
server.use(morgan('common'));
server.use(cors());

server.use('/api/auth', authRouter);
server.use('/api/users', restricted, checkRole('user'), usersRouter);

server.get('/', (req, res) => {
  res.send('Server is up! Let\'s make some tokens!')
});

module.exports = server;

function checkRole(role) {
  return (req, res, next) => {
    if(
      req.decodedToken && 
      req.decodedToken.role &&
      req.decodedToken.role.toLowerCase() === role
    ) {
      next();
    } else {
      res.status(403).json({ message: 'No, man.  Just no.' })
    }
  }
}

// registering provides a hashed password, which is returned to the user
// user logs in with their password as they originally provided, which then returns a token
// user then needs to include the token in an authorization header to access restricted routes
