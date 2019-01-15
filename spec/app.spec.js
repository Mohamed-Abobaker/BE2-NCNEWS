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
  describe('/topics', () => {
    it('GET status: 200 & responds with an array of topics objects', () => request
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).to.be.an('array');
        expect(body.topics).to.have.length(2);
      }));
    it('POST status: 201 & responds newly posted topic', () => request
      .post('/api/topics')
      .send({
        description: 'The game of the year',
        slug: 'RDR2',
      })
      .expect(201)
      .then(({ body }) => {
        expect(body).to.be.an('object');
        expect(body).to.have.all.keys('slug', 'description');
      }));
    it('GET status:200 & responds with an array of article objects of given a topic', () => request
      .get('/api/topics/mitch/articles?sort_by=article_id&&limit=5')
      .expect(200)
      .then(({ body }) => {
        expect(body.length).to.equal(5);
        expect(body[0].article_id).to.eql(12);
      }));
    it('GET status:200 & responds with an array of article objects of given a topic', () => request
      .get('/api/topics/mitch/articles?sort_by=article_id&&limit=3&&p=2&&order=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.length).to.equal(3);
        expect(body[0].article_id).to.eql(4);
        expect();
      }));
    it('POST status:201 & responds with the posted article', () => request
      .post('/api/topics/mitch/articles')
      .send({
        body: 'In this years awards Northcoder of the year went to ......',
        title: 'Northocder awards',
        username: 'butter_bridge',
      })
      .expect(201)
      .then(({ body }) => {
        expect(body).to.be.an('object');
        expect(body).to.have.all.keys(
          'body',
          'title',
          'username',
          'article_id',
          'votes',
          'topic',
          'created_at',
        );
        expect(body.title).to.eql('Northocder awards');
      }));
  });
  describe('GET /api/articles', () => {
    it('GET status:200 & responds with the full array of article objects', () => request
      .get('/api/articles?limit=100')
      .expect(200)
      .then(({ body }) => {
        expect(body.length).to.equal(12);
        expect(body[0]).to.have.all.keys(
          'body',
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
        expect(body.length).to.equal(10);
        expect(body[9].article_id).to.eql(10);
      }));
    it('GET status:200 & responds with the second page of array of article objects limited to 2 a page ', () => request
      .get('/api/articles?p=2&limit=2')
      .expect(200)
      .then(({ body }) => {
        expect(body.length).to.equal(2);
        expect(body[1].article_id).to.eql(4);
      }));
  });
});
