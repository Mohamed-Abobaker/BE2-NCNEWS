exports.handle400 = (err, req, res, next) => {
  if (err.constraint == 'comments_article_id_foreign') {
    res.status(404).send({ status: 404, msg: 'Page not found!' });
  }
  console.log('reached 400 handler', err);
  const codes400 = ['23502', '22P02', '42703', '23503'];
  if (codes400.includes(err.code)) {
    res.status(400).send({ msg: err.toString() });
  } else next(err);
};

exports.handle404 = (err, req, res, next) => {
  console.log('reached 404 handler', err);
  if (err.status === 404) {
    res.status(404).send(err);
  }
};

exports.handle405 = (req, res, next) => {
  res.status(405).send({
    msg: 'Invalid method for this endpoint',
  });
};
