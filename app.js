const app = require('express')();
const apiRouter = require('./routes/api');

app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  console.log(err, 'error');
});

module.exports = app;
