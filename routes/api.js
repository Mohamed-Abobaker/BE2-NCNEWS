const apiRouter = require('express').Router();

const topicRouter = require('./topic');
const articlesRouter = require('./articles');
const usersRouter = require('./users');
const { getApi } = require('../controllers/conApi');

apiRouter.use('/', getApi);
apiRouter.use('/topics', topicRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/users', usersRouter);
module.exports = apiRouter;
