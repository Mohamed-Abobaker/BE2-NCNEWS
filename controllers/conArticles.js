const connection = require('../db/connection');

const getArticles = (req, res, next) => {
  const {
    limit = 10, sort_by = 'created_at', order = 'desc', p = 0,
  } = req.query;
  const page = p ? (p - 1) * limit : 0;
  connection
    .select(
      'articles.username as author',
      'articles.title',
      'articles.article_id',
      'articles.votes',
      'articles.created_at',
      'articles.topic',
    )
    .from('articles')
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .limit(limit)
    .orderBy(sort_by, order)
    .offset(page)
    .count('comments.comment_id as comment_count')
    .groupBy('articles.article_id')
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  connection('articles')
    .select(
      'articles.username as author',
      'articles.title',
      'articles.article_id',
      'articles.body',
      'articles.votes',
      'articles.created_at',
      'articles.topic',
    )
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .count('comments.comment_id as comment_count')
    .groupBy('articles.article_id')
    .where('articles.article_id', article_id)
    .then(([article]) => {
      if (!article) return Promise.reject({ status: 404, msg: 'Page not found!' });
      res.status(200).send({ article });
    })
    .catch(next);
};

const patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes = 0 } = req.body;
  connection('articles')
    .where('articles.article_id', article_id)
    .increment('votes', inc_votes)
    .returning('*')
    .then(([article]) => {
      if (!article) return Promise.reject({ status: 404, msg: 'Page not found!' });
      res.status(200).send({ article });
    })
    .catch(next);
};

const deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;
  connection('articles')
    .where('articles.article_id', article_id)
    .del()
    .returning('*')
    .then(([result]) => {
      if (!result) return Promise.reject({ status: 404, msg: 'Page not found!' });
      res.status(204).send(result);
    })
    .catch(next);
};

const getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params;
  const {
    limit = 10, sort_by = 'created_at', order = 'desc', p = 0,
  } = req.query;
  const page = p ? (p - 1) * limit : 0;
  connection
    .select(
      'comments.comment_id',
      'comments.username as author',
      'comments.body',
      'comments.article_id',
      'comments.votes',
      'comments.created_at',
    )
    .from('comments')
    .where('article_id', article_id)
    .limit(limit)
    .orderBy(sort_by, order)
    .offset(page)
    .then((comments) => {
      if (!comments[0]) return Promise.reject({ status: 404, msg: 'Page not found!' });
      res.status(200).send({ comments });
    })
    .catch(next);
};

const postCommentByArticle_id = (req, res, next) => {
  const { article_id } = req.params;
  req.body.article_id = article_id;
  connection('comments')
    .insert(req.body)
    .returning('*')
    .then(([comment]) => {
      if (!comment) return Promise.reject({ status: 404, msg: 'Page not found!' });
      res.status(201).send({ comment });
    })
    .catch(next);
};

const patchCommentById = (req, res, next) => {
  const { article_id, comment_id } = req.params;
  const { inc_votes = 0 } = req.body;

  connection('comments')
    .where({
      article_id,
      comment_id,
    })
    .increment('votes', inc_votes)
    .returning('*')
    .then(([comment]) => {
      if (!comment) return Promise.reject({ status: 404, msg: 'Page not found!' });
      res.status(200).send({ comment });
    })
    .catch(next);
};

const deleteCommentById = (req, res, next) => {
  const { article_id, comment_id } = req.params;

  connection('comments')
    .where({
      article_id,
      comment_id,
    })
    .del()
    .returning('*')
    .then(([deletedComment]) => {
      if (!deletedComment) return Promise.reject({ status: 404, msg: 'Page not found!' });
      res.status(204).send(deletedComment);
    })
    .catch(next);
};

module.exports = {
  getArticles,
  getArticleById,
  patchArticleVotes,
  deleteArticleById,
  getCommentsByArticle,
  postCommentByArticle_id,
  patchCommentById,
  deleteCommentById,
};
