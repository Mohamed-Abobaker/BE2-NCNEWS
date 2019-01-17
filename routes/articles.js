const articlesRouter = require('express').Router();
const {
  getArticles,
  getArticleById,
  patchVotesByArticle,
  deleteArticleById,
  getCommentsByArticle,
  postCommentByArticle_id,
  patchCommentById,
  deleteCommentById,
} = require('../controllers/conArticles');

articlesRouter.get('/', getArticles);
articlesRouter.get('/:article_id', getArticleById);
articlesRouter.patch('/:article_id', patchVotesByArticle);
articlesRouter.delete('/:article_id', deleteArticleById);
articlesRouter.get('/:article_id/comments', getCommentsByArticle);
articlesRouter.post('/:article_id/comments', postCommentByArticle_id);
articlesRouter.patch('/:article_id/comments/:comment_id', patchCommentById);
articlesRouter.delete('/:article_id/comments/:comment_id', deleteCommentById);
module.exports = articlesRouter;
