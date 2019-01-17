const apiRouter = require('express').Router();

const topicRouter = require('./topic');
const articlesRouter = require('./articles');
const usersRouter = require('./users');
const { getApi } = require('../controllers/conApi');
const { handle405 } = require('../errorHandling/errorHandling');

apiRouter
  .route('/')
  .get(getApi)
  .all(handle405);
apiRouter.use('/topics', topicRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/users', usersRouter);
module.exports = apiRouter;
