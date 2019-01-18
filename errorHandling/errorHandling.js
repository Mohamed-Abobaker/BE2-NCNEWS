exports.handle400 = (err, req, res, next) => {
  if (err.constraint == 'comments_article_id_foreign') {
    res.status(404).send({ status: 404, msg: 'Page not found!' });
  }
  const codes400 = ['23502', '22P02', '42703', '23503'];
  if (codes400.includes(err.code)) {
    res.status(400).send({ msg: err.toString() });
  } else next(err);
};

exports.handle404 = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send(err);
  } else next(err);
};

exports.handle405 = (req, res, next) => {
  res.status(405).send({
    msg: 'Invalid method for this endpoint',
  });
};

exports.handle422 = (err, req, res, next) => {
  const codes422 = ['23505'];
  if (codes422.includes(err.code)) {
    res.status(422).send({ msg: err.toString() });
  } else next(err);
};

exports.handle500 = (err, req, res, next) => {
  console.log(err);
  res.status(500).json({ msg: 'You have encountered an error' });
};
