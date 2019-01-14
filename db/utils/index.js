const timeStampFormatter = stamp => new Date(stamp);

const articleFormatter = function (articles) {
  const newArticle = [...articles];
  return newArticle.map(({ created_by, created_at, ...article }) => ({
    username: created_by,
    created_at: timeStampFormatter(created_at),
    ...article,
  }));
};
const commentFormatter = (comments, articles) => {
  const newComments = [...comments];
  return newComments.map(({
    created_by, created_at, belongs_to, body, votes,
  }) => {
    const belong = articles.find(element => element.title === belongs_to);
    return {
      username: created_by,
      created_at: timeStampFormatter(created_at),
      article_id: belong.article_id,
      votes,
      body,
    };
  });
};

module.exports = {
  articleFormatter,
  commentFormatter,
};
