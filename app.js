const app = require('express')();
const parser = require('body-parser');
const apiRouter = require('./routes/api');

app.use(parser.json());
app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  console.log(err, 'error');
  if (err) throw err;
});

module.exports = app;
