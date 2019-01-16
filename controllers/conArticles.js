const connection = require('../db/connection');

const getArticles = (req, res, next) => {
  const {
    limit = 10, sort_by = 'created_at', order = 'desc', p = 0, ...restOf
  } = req.query;
  const page = p ? (p - 1) * limit : 0;
  connection
    .select(
      'articles.username as author',
      'articles.title',
      'articles.article_id',
      'articles.body',
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
      res.status(200).send(articles);
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
    .then((article) => {
      if (article.length < 1) return Promise.reject({ status: 404, msg: 'Page not found!' });
      res.status(200).send([article]);
    })
    .catch(next);
};

module.exports = { getArticles, getArticleById };
