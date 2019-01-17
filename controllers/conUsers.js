const connection = require('../db/connection');

const getUsers = (req, res, next) => {
  connection('users')
    .select('*')
    .then((users) => {
      res.status(200).send({ users });
    });
};

const getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  connection('users')
    .select('*')
    .where('username', username)
    .then(([user]) => {
      if (!user) return Promise.reject({ status: 404, msg: 'Page not found!' });
      res.status(200).send({ user });
    })
    .catch(next);
};

module.exports = { getUsers, getUserByUsername };
