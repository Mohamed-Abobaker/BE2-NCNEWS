const apiRouter = require('express').Router();

const topicRouter = require('./topic');
const articlesRouter = require('./articles');

apiRouter.use('/topics', topicRouter);
apiRouter.use('/articles', articlesRouter);

module.exports = apiRouter;
