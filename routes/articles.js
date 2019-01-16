const articlesRouter = require('express').Router();
const { getArticles, getArticleById, patchVotesByArticle } = require('../controllers/conArticles');

articlesRouter.get('/', getArticles);
articlesRouter.get('/:article_id', getArticleById);
articlesRouter.patch('/:article_id', patchVotesByArticle);

module.exports = articlesRouter;
