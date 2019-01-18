const test = require('./test-data');
const development = require('./development-data');
const production = require('./development-data');

const env = process.env.NODE_ENV || 'development';

const data = { test, development, production };

module.exports = data[env];
