const articlesRouter = require('express').Router();
const {
  getArticles,
  getArticleById,
  patchArticleVotes,
  deleteArticleById,
  getCommentsByArticle,
  postCommentByArticle_id,
  patchCommentById,
  deleteCommentById,
} = require('../controllers/conArticles');
const { handle405 } = require('../errorHandling/errorHandling');

articlesRouter
  .route('/')
  .get(getArticles)
  .all(handle405);

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleVotes)
  .delete(deleteArticleById)
  .all(handle405);

articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticle)
  .post(postCommentByArticle_id)
  .all(handle405);

articlesRouter
  .route('/:article_id/comments/:comment_id')
  .patch(patchCommentById)
  .delete(deleteCommentById)
  .all(handle405);
module.exports = articlesRouter;
