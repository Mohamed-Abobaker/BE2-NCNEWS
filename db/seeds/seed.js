const {
  articleData, userData, topicData, commentData,
} = require('../data');
const { articleFormatter, commentFormatter } = require('../utils');

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('topics')
    .insert(topicData)
    .returning('*')
    .then(topicRows => knex('users')
      .insert(userData)
      .returning('*'))
    .then((userRows) => {
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
