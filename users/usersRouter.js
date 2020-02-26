const router = require('express').Router();

const Users = require('./usersModel.js');

router.get('/', (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(error => res.send(error));
})

module.exports = router;
