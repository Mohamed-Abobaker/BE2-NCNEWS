const connection = require('../db/connection');

const getTopics = (req, res, next) => {
  connection('topics')
    .select('*')
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};
const postTopic = (req, res, next) => {
  console.log('controller');
  connection('topics')
    .insert(req.body)
    .returning('*')
    .then(([topic]) => {
      res.status(201).send(topic);
    })
    .catch(next);
};
const getArticlesByTopic = (req, res, next) => {
  const { topic } = req.params;
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
    .where('topic', topic)
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .limit(limit)
    .orderBy(sort_by, order)
    .offset(page)
    .count('comments.comment_id as comment_count')
    .groupBy('articles.article_id')
    .then((articles) => {
      if (articles.length < 1) return Promise.reject({ status: 404, message: 'Page not found!' });
      res.status(200).send(articles);
    })
    .catch(next);
};

const postArticleByTopic = (req, res, next) => {
  const { topic } = req.params;
  req.body.topic = topic;
  connection('articles')
    .insert(req.body)
    .returning('*')
    .then(([article]) => {
      if (!article) return Promise.reject({ status: 404, msg: 'Page not found!' });
      res.status(201).send(article);
    })
    .catch(next);
};

module.exports = {
  getTopics,
  postTopic,
  getArticlesByTopic,
  postArticleByTopic,
};
