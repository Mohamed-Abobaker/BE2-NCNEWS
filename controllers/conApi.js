const connection = require('../db/connection');

const paths = {
  'GET /api/topics': 'responds with an array of topic objects',
  'POST /api/topics': 'responds with the posted topic object',
  'GET /api/topics/:topic/articles': 'responds with an array of article objects for a given topic',
  'POST /api/topics/:topic/articles': 'posts an article & the responds with the posted article',
  'GET /api/articles': 'responds with an array of article objects',
  'GET /api/articles/:article_id': 'responds with an article object belonging to the ID',
  'PATCH /api/articles/:article_id':
    'accepts an object in the form { inc_votes: newVote }, updates the votes &  responds with the article you have just updated',
  'DELETE /api/articles/:article_id':
    'should delete the given article by article_id & should respond with 204 and no-content',
  'GET /api/articles/:article_id/comments':
    'responds with an array of comments for the given article_id',
  'POST /api/articles/:article_id/comments':
    'accepts an object with a username and body & responds with the posted comment',
  'PATCH /api/articles/:article_id/comments/:comment_id':
    'accepts an object in the form { inc_votes: newVote }, updates the votes &  responds with the comment you have just updated',
  'DELETE /api/articles/:article_id/comments/:comment_id':
    'should delete the given article by comment_id & should respond with 204 and no-content',
  'GET /api/users': 'should respond with an array of user objects',
  'GET /api/users/:username': 'should respond with a user object',
};

const getApi = (req, res, next) => {
  res.status(200).json(paths);
};

module.exports = { getApi };
