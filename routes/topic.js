const topicRouter = require('express').Router();
const {
  getTopics,
  postTopic,
  getArticlesByTopic,
  postArticleByTopic,
} = require('../controllers/conTopics');
const { handle405 } = require('../errorHandling/errorHandling');

topicRouter
  .route('/')
  .get(getTopics)
  .post(postTopic)
  .all(handle405);
// topicRouter.get('/', getTopics);
// topicRouter.post('/', postTopic);
topicRouter
  .route('/:topic/articles')
  .get(getArticlesByTopic)
  .post(postArticleByTopic)
  .all(handle405);
// topicRouter.get('/:topic/articles', getArticlesByTopic);
// topicRouter.post('/:topic/articles', postArticleByTopic);
module.exports = topicRouter;
