const express = require('express');
const cors = require('cors');

const app = express();
const bodyParser = require('body-parser');

app.use(cors());

const apiRouter = require('./routes/api');
const {
  handle400, handle404, handle422, handle500,
} = require('./errorHandling/errorHandling');

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use(handle400);
app.use(handle404);
app.use(handle422);
app.use(handle500);

module.exports = app;
