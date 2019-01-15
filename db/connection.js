const ENV = process.env.NODE_ENV || 'development';
const knex = require('knex');
const config = require('../knexfile')[ENV];

const connection = knex(config);

module.exports = connection;
