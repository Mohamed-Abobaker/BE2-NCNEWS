const articlesRouter = require('express').Router();
const {
  getArticles,
  getArticleById,
  patchVotesByArticle,
  deleteArticleById,
} = require('../controllers/conArticles');

articlesRouter.get('/', getArticles);
articlesRouter.get('/:article_id', getArticleById);
articlesRouter.patch('/:article_id', patchVotesByArticle);
articlesRouter.delete('/:article_id', deleteArticleById);

module.exports = articlesRouter;
