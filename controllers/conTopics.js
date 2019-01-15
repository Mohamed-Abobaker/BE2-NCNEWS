const connection = require('../db/connection');

const getTopics = (req, res, next) => {
  connection('topics')
    .select('*')
    .then(topics => res.status(200).send({ topics }))
    .catch(next);
};
const postTopic = (req, res, next) => {
  connection('topics')
    .insert(req.body)
    .returning('*')
    .then(([topic]) => {
      res.status(201).send(topic);
    });
};
const getArticlesByTopic = (req, res, next) => {
  const { topic } = req.params;
  const {
    limit = 10, sort_by = 'created_at', order = 'desc', p = 0, ...restOf
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
    .where('topic', topic)
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .limit(limit)
    .orderBy(sort_by, order)
    .offset(page)
    .count('comments.comment_id as comment_count')
    .groupBy('articles.article_id')
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch();
};

const postArticleByArticle = (req, res, next) => {
  const { topic } = req.params;
  req.body.topic = topic;
  connection('articles')
    .insert(req.body)
    .returning('*')
    .then(([article]) => {
      res.status(201).send(article);
    });
};

module.exports = {
  getTopics,
  postTopic,
  getArticlesByTopic,
  postArticleByArticle,
};
