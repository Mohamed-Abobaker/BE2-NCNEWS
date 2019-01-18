const {
  articleData, userData, topicData, commentData,
} = require('../data');
const { articleFormatter, commentFormatter } = require('../utils');

exports.seed = function (knex, Promise) {
  return knex('topics')
    .insert(topicData)
    .returning('*')
    .then(() => knex('users')
      .insert(userData)
      .returning('*'))
    .then(() => {
      const formatedArts = articleFormatter(articleData);
      return knex('articles')
        .insert(formatedArts)
        .returning('*');
    })
    .then((articleRows) => {
      const formattedComms = commentFormatter(commentData, articleRows);
      return knex('comments')
        .insert(formattedComms)
        .returning('*');
    });
};
