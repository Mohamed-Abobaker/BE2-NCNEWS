const topicRouter = require('express').Router();
const {
  getTopics,
  postTopic,
  getArticlesByTopic,
  postArticleByArticle,
} = require('../controllers/conTopics');

topicRouter.get('/', getTopics);
topicRouter.post('/', postTopic);
topicRouter.get('/:topic/articles', getArticlesByTopic);
topicRouter.post('/:topic/articles', postArticleByArticle);
module.exports = topicRouter;
