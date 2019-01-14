const {
  articleData, userData, topicData, commentData,
} = require('../data');

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('topics')
    .insert(topicData)
    .returning('*')
    .then((topicRows) => {
      console.log(topicRows);
      knex('users')
        .insert(userData)
        .returning('*');
    })
    .then((userRows) => {
      knex('articles')
        .insert(articleData)
        .returning('*');
    })
    .then((articleRows) => {
      knex('comments')
        .insert(commentData)
        .returning('*');
    });
};
