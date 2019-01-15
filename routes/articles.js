const articlesRouter = require('express').Router();
const { getArticles } = require('../controllers/conArticles');

articlesRouter.get('/', getArticles);

module.exports = articlesRouter;
