const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../users/usersModel');
const { jwtSecret } = require('../config/secrets.js');

// register
router.post('/register', (req, res) => {
  const user = req.body;
  const hash = bncrypt.hashSync(user.password, 10);
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    })
});

// login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);

        res.status(200).json({
          message: `Welcome, ${user.username}!`,
          token
        })
      } else {
        res.status(401).json({ message: 'Invalid credentials!' })
      }
    })
    .catch(error => {
      console.log('Error: ', error);
      res.status(500).json({ error: 'Error loggin in!' })
    })
})

function generateToken(user) {
  const payload = {
    username: user.username,
    role: user.role || 'user'
  }

  const options = {
    expiresIn: '1h'
  }

  return jwt.sign(payload, jwtSecret, options);
}

module.exports = router;
