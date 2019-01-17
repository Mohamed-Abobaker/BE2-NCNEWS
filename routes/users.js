const usersRouter = require('express').Router();
const { getUsers, getUserByUsername } = require('../controllers/conUsers');
const { handle405 } = require('../errorHandling/errorHandling');

usersRouter
  .route('/')
  .get(getUsers)
  .all(handle405);
// usersRouter.get('/', getUsers);

usersRouter
  .route('/:username')
  .get(getUserByUsername)
  .all(handle405);
// usersRouter.get('/:username', getUserByUsername);

module.exports = usersRouter;
