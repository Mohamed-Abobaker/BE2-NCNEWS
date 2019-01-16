const topicRouter = require('express').Router();
const {
  getTopics,
  postTopic,
  getArticlesByTopic,
  postArticleByTopic,
} = require('../controllers/conTopics');

topicRouter.get('/', getTopics);
topicRouter.post('/', postTopic);
topicRouter.get('/:topic/articles', getArticlesByTopic);
topicRouter.post('/:topic/articles', postArticleByTopic);
module.exports = topicRouter;
