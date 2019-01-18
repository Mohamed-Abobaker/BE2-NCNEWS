process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');
const connection = require('../db/connection');

const request = supertest(app);

describe('/api', () => {
  beforeEach(() => connection.migrate
    .rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection.seed.run()));

  after(() => connection.destroy());
  describe('GET api/topics', () => {
    it('GET status: 200 & responds with an array of topics objects', () => request
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).to.be.an('array');
        expect(body.topics).to.have.length(2);
      }));
  });
  describe('POST api/topics', () => {
    it('POST status: 201 & responds newly posted topic', () => request
      .post('/api/topics')
      .send({
        description: 'The game of the year',
        slug: 'RDR2',
      })
      .expect(201)
      .then(({ body }) => {
        const { topic } = body;
        expect(topic).to.be.an('object');
        expect(topic).to.have.all.keys('slug', 'description');
      }));
    it('POST status: 400 when wrong key is inserted', () => request
      .post('/api/topics')
      .send({
        description: 'The game of the year',
        title: 'RDR2',
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).to.eql(
          'error: insert into "topics" ("description", "title") values ($1, $2) returning * - column "title" of relation "topics" does not exist',
        );
      }));
    it('POST status: 422 when duplicate slug is used', () => request
      .post('/api/topics')
      .send({
        description: 'The game of the year',
        slug: 'mitch',
      })
      .expect(422)
      .then(({ body }) => {
        expect(body.msg).to.eql(
          'error: insert into "topics" ("description", "slug") values ($1, $2) returning * - duplicate key value violates unique constraint "topics_pkey"',
        );
      }));
  });
  describe('GET api/topics/:topic/articles', () => {
    it('GET status:200 & responds with an array of article objects of given a topic', () => request
      .get('/api/topics/mitch/articles?sort_by=article_id&&limit=5')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).to.equal(5);
        expect(articles[0].article_id).to.eql(12);
      }));
    it('GET status:404 & responds with an error message', () => request
      .get('/api/topics/mike/articles')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).to.eql('Page not found!');
      }));
    it('GET status:200 & responds with an array of article objects of given a topic', () => request
      .get('/api/topics/mitch/articles?sort_by=article_id&&limit=3&&p=2&&order=asc')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).to.equal(3);
        expect(articles[0].article_id).to.eql(4);
        expect();
      }));
  });
  describe('POST api/topics/:topic/articles', () => {
    it('POST status:201 & responds with the posted article', () => request
      .post('/api/topics/mitch/articles')
      .send({
        body: 'In this years awards Northcoder of the year went to ......',
        title: 'Northocder awards',
        username: 'butter_bridge',
      })
      .expect(201)
      .then(({ body }) => {
        const { article } = body;
        expect(article).to.be.an('object');
        expect(article).to.have.all.keys(
          'body',
          'title',
          'username',
          'article_id',
          'votes',
          'topic',
          'created_at',
        );
        expect(article.title).to.eql('Northocder awards');
      }));
    it('POST status: 400 when wrong key is inserted', () => request
      .post('/api/topics/mitch/articles')
      .send({
        body: 'In this years awards Northcoder of the year went to ......',
        title: 'Northocder awards',
        author: 'butter_bridge',
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).to.eql(
          'error: insert into "articles" ("author", "body", "title", "topic") values ($1, $2, $3, $4) returning * - column "author" of relation "articles" does not exist',
        );
      }));
    it('POST status: 400 when invalid topic used', () => request
      .post('/api/topics/mike/articles')
      .send({
        body: 'In this years awards Northcoder of the year went to ......',
        title: 'Northocder awards',
        username: 'butter_bridge',
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).to.eql(
          'error: insert into "articles" ("body", "title", "topic", "username") values ($1, $2, $3, $4) returning * - insert or update on table "articles" violates foreign key constraint "articles_topic_foreign"',
        );
      }));
  });
  describe('GET /api/articles', () => {
    it('GET status:200 & responds with the full array of article objects', () => request
      .get('/api/articles?limit=100')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).to.equal(12);
        expect(articles[0]).to.have.all.keys(
          'title',
          'author',
          'article_id',
          'votes',
          'topic',
          'created_at',
          'comment_count',
        );
      }));
    it('GET status:200 & responds with the array of article objects sorted by article_id asc', () => request
      .get('/api/articles?sort_by=article_id&order=asc')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).to.equal(10);
        expect(articles[9].article_id).to.eql(10);
      }));
    it('GET status:200 & responds with the second page of array of article objects limited to 2 a page ', () => request
      .get('/api/articles?p=2&limit=2')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).to.equal(2);
        expect(articles[1].article_id).to.eql(4);
      }));
  });
  describe('GET /api/articles/:article_id', () => {
    it('GET status:200 & responds with an article object', () => request
      .get('/api/articles/1')
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).to.haveOwnProperty('article_id');
      }));
    it('GET status: 400 when invalid article_id used', () => request
      .get('/api/articles/mike')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).to.eql(
          'error: select "articles"."username" as "author", "articles"."title", "articles"."article_id", "articles"."body", "articles"."votes", "articles"."created_at", "articles"."topic", count("comments"."comment_id") as "comment_count" from "articles" left join "comments" on "articles"."article_id" = "comments"."article_id" where "articles"."article_id" = $1 group by "articles"."article_id" - invalid input syntax for integer: "mike"',
        );
      }));
    it('GET status: 404 when articles_id does not exist ', () => request
      .get('/api/articles/700')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.eql('Page not found!');
      }));
  });
  describe('PATCH /api/articles/:article_id', () => {
    it('PATCH status:200 & updates the articles.votes ', () => request
      .patch('/api/articles/1')
      .send({ inc_votes: 77 })
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.votes).to.eql(177);
      }));
    it('PATCH status: 404 when articles_id does not exist ', () => request
      .patch('/api/articles/700')
      .send({ inc_votes: 77 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.eql('Page not found!');
      }));
    it('PATCH status: 400 when invalid article_id used', () => request
      .patch('/api/articles/mike')
      .send({ inc_votes: 77 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).to.eql(
          'error: update "articles" set "votes" = "votes" + 77 where "articles"."article_id" = $1 returning * - invalid input syntax for integer: "mike"',
        );
      }));
  });
  describe('DELETE /api/articles/:article_id', () => {
    it('DELETE status: 204 & responds with no-content', () => request
      .delete('/api/articles/1')
      .expect(204)
      .then(() => request.get('/api/articles?limit=100').expect(200))
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).to.have.length(11);
      }));
    it('DELETE status: 404 when non-existent id used', () => request
      .delete('/api/articles/704')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.eql('Page not found!');
      }));
  });
  describe('GET /api/articles/:article_id/comments', () => {
    it('GET status:200 & responds with an array of comment objects', () => request
      .get('/api/articles/1/comments?limit=100')
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).to.equal(13);
        expect(comments[0].article_id).to.eql(1);
        expect(comments[0]).to.have.all.keys(
          'body',
          'author',
          'article_id',
          'votes',
          'created_at',
        );
      }));
    it('GET status:200 & responds with an array of comment objects using limit, page, sort_by & order', () => request
      .get('/api/articles/1/comments?limit=2&p=6&order=asc&sort_by=votes')
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).to.equal(2);
        expect(comments[0].votes).to.eql(14);
      }));
    it('GET Status:400 when invlaid ID used', () => request
      .get('/api/articles/abc/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).to.eql(
          'error: select "comments"."username" as "author", "comments"."body", "comments"."article_id", "comments"."votes", "comments"."created_at" from "comments" where "article_id" = $1 order by "created_at" desc limit $2 - invalid input syntax for integer: "abc"',
        );
      }));
    it('GET Status:404 when article id does not exist', () => request
      .get('/api/articles/700/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.eql('Page not found!');
      }));
  });
  describe('POST /api/articles/:article_id/comments', () => {
    it('POST status:201 & responds with the posted comment', () => request
      .post('/api/articles/3/comments')
      .send({
        body: 'This is a short comment.',
        username: 'butter_bridge',
      })
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).to.be.an('object');
        expect(comment).to.have.all.keys(
          'body',
          'username',
          'article_id',
          'comment_id',
          'votes',
          'created_at',
        );
        expect(comment.username).to.eql('butter_bridge');
      }));
    it('POST status: 400 when wrong key is posted', () => request
      .post('/api/articles/3/comments')
      .send({
        body: 'This is a short comment.',
        commentee: 'butter_bridge',
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).to.eql(
          'error: insert into "comments" ("article_id", "body", "commentee") values ($1, $2, $3) returning * - column "commentee" of relation "comments" does not exist',
        );
      }));
    it('POST status: 404 when un-used article_id used', () => request
      .post('/api/articles/700/comments')
      .send({
        body: 'This is a short comment.',
        username: 'butter_bridge',
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.eql('Page not found!');
      }));
    it('POST status: 400 when invalid article_id used', () => request
      .post('/api/articles/abc/comments')
      .send({
        body: 'This is a short comment.',
        username: 'butter_bridge',
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).to.eql(
          'error: insert into "comments" ("article_id", "body", "username") values ($1, $2, $3) returning * - invalid input syntax for integer: "abc"',
        );
      }));
  });
  describe('PATCH /api/articles/:article_id/comments/:comment_id', () => {
    it('PATCH status:200 & updates the comment.votes for particular comment_id ', () => request
      .patch('/api/articles/9/comments/1')
      .send({ inc_votes: 77 })
      .expect(200)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment.votes).to.eql(93);
      }));
    it('PATCH status: 404 when articles_id does not exist ', () => request
      .patch('/api/articles/700/comments/1')
      .send({ inc_votes: 77 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.eql('Page not found!');
      }));
    it('PATCH status: 400 when invalid article_id used', () => request
      .patch('/api/articles/mike/comments/1')
      .send({ inc_votes: 77 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).to.eql(
          'error: update "comments" set "votes" = "votes" + 77 where "article_id" = $1 and "comment_id" = $2 returning * - invalid input syntax for integer: "mike"',
        );
      }));
    it('PATCH status: 404 when comment_id does not exist ', () => request
      .patch('/api/articles/1/comments/700')
      .send({ inc_votes: 77 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.eql('Page not found!');
      }));
    it('PATCH status: 400 when invalid comments_id used', () => request
      .patch('/api/articles/1/comments/abc')
      .send({ inc_votes: 77 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).to.eql(
          'error: update "comments" set "votes" = "votes" + 77 where "article_id" = $1 and "comment_id" = $2 returning * - invalid input syntax for integer: "abc"',
        );
      }));
    it('PATCH status:200 with no body & responds with an unmodified comment ', () => request
      .patch('/api/articles/9/comments/1')
      .send({})
      .expect(200)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment.votes).to.eql(16);
      }));
  });
  describe('DELETE /api/articles/:article_id/comments/:comment_id', () => {
    it('DELETE status: 204 & responds with no-content', () => request
      .delete('/api/articles/9/comments/1')
      .expect(204)
      .then(() => request.get('/api/articles/9/comments').expect(200))
      .then(({ body }) => {
        expect(body.comments).to.have.length(1);
      }));
    it('DELETE status: 400 when comment_id is invalid', () => request
      .delete('/api/articles/9/comments/abc')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).to.eql(
          'error: delete from "comments" where "article_id" = $1 and "comment_id" = $2 returning * - invalid input syntax for integer: "abc"',
        );
      }));
    it('DELETE status: 404 when comment_id is not used', () => request
      .delete('/api/articles/9/comments/700')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.eql('Page not found!');
      }));
    it('DELETE status: 404 when article_id is not used', () => request
      .delete('/api/articles/700/comments/1')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.eql('Page not found!');
      }));
    it('DELETE status: 400 when article_id is invalid', () => request
      .delete('/api/articles/abc/comments/1')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).to.eql(
          'error: delete from "comments" where "article_id" = $1 and "comment_id" = $2 returning * - invalid input syntax for integer: "abc"',
        );
      }));
  });
  describe('GET /api/users', () => {
    it('GET status: 200 & responds with an array of user objects', () => request
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        expect(body.users).to.be.an('array');
        expect(body.users).to.have.length(3);
      }));
  });
  describe('GET /api/users/:username', () => {
    it('GET Status: 200 & responds with a user object', () => request
      .get('/api/users/butter_bridge')
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user.name).to.eql('jonny');
        expect(user).to.have.all.keys('name', 'avatar_url', 'username');
      }));
    it('GET Status:404 when unused username used', () => request
      .get('/api/users/michael')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.eql('Page not found!');
      }));
  });
  describe('GET /api', () => {
    it('GET status:200 responds with an object containing the endpoints info', () => request
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        expect(body).to.have.all.keys(
          'DELETE /api/articles/:article_id',
          'DELETE /api/articles/:article_id/comments/:comment_id',
          'GET /api/articles',
          'GET /api/articles/:article_id',
          'GET /api/articles/:article_id/comments',
          'GET /api/topics',
          'GET /api/topics/:topic/articles',
          'GET /api/users',
          'GET /api/users/:username',
          'PATCH /api/articles/:article_id',
          'PATCH /api/articles/:article_id/comments/:comment_id',
          'POST /api/articles/:article_id/comments',
          'POST /api/topics',
          'POST /api/topics/:topic/articles',
        );
      }));
    it('DELETE status:405 and responds with Invalid method for this endpoint', () => request
      .delete('/api')
      .expect(405)
      .then(({ body }) => {
        expect(body.msg).to.eql('Invalid method for this endpoint');
      }));
    it('PATCH status:405 and responds with Invalid method for this endpoint', () => request
      .patch('/api')
      .expect(405)
      .then(({ body }) => {
        expect(body.msg).to.eql('Invalid method for this endpoint');
      }));
    it('POST status:405 and responds with Invalid method for this endpoint', () => request
      .post('/api')
      .expect(405)
      .then(({ body }) => {
        expect(body.msg).to.eql('Invalid method for this endpoint');
      }));
  });
});
