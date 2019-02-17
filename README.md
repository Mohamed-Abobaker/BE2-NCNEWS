# BE2-NC-Knews

## Northcoders News API

## Description

Welcome to NC -Knews!

NC-Knews is an API for the back end of a news article aggregator site (in the style of Reddit). It enables writing commenting, deleting and voting articles.

## Getting Started

This is a guide to help you get set up with the API so that you can use it locally.

## Prerequisites

- Node.js v10.9.0
- Postgres v10.5

## Installing

First run your termial and cd into the location that you want to store the folder. Then run the following commands in your terminal.

```http
git clone https://github.com/Mohamed-Abobaker/BE2-NCNEWS.git
cd BE2-NCNEWS
npm install
```

Then open the file in your preferred code editor.

In the package.json file you will find lots of handy ready made scripts to help with the setup process.

In the terminal run the following command

```http
npm run create:config
```

This will create a knexfile.js which you will need to modify.

Change the client to 'pg' and the database name to 'nc_knews'

If you are using Linux then you will also need to add a username and password to the connection object (as can be seen below) and make sure that this file is in git ignore.

A full example can be seen below.

```http
module.exports = {

 development: {
   client: 'pg',
   connection: {
     database: 'nc_knews',
     password: 'your_password',
     user: 'your_username',
   },
   migrations: {
     directory: './db/migrations',
   },
   seeds: {
     directory: './db/seeds',
   },
 },
 test: {
   client: 'pg',
   connection: {
     password: 'your_password',
     user: 'your_username',
     database: 'nc_knews_test',
   },
   migrations: {
     directory: './db/migrations',
   },
   seeds: {
     directory: './db/seeds',
   },
 },
};
```

For more information see [knex documentation](https://knexjs.org/#Installation-node)

---

Create an api using express to host the Northcoders news. Our database will be PSQL, and you will interact with it using [Knex](https://knexjs.org).

## Running the development database from a browser or postman

In your terminal run the following commands

```https
npm run seed:db
npm run dev
```

Then in your browser or using postman use localhost:9090/api and try out some of the endpoints from the displayed page.

---

### Running the tests

To see the available tests navigate to app.spec.js in the spec folder. All endpoints have been tested thorougly.

To run tests type the following into the command line:

```https
npm test
```

---

## Deployment

Hosted on [Heroku](https://nc-knews777.herokuapp.com/api)

## Built With

- Node - JS runtime
- Express - Web application framework
- Knex - SQL query builder
- PostgreSQL - Relational database

## Endpoints

Your server should have the following end-points:

```http
GET /api/topics
```

- responds with an array of topic objects - each object should have a `slug` and `description` property.

```http
POST /api/topics
```

- accepts an object containing `slug` and `description` property, the `slug` must be unique
- responds with the posted topic object

```http
GET /api/topics/:topic/articles
```

- responds with an array of article objects for a given topic
- each article should have:
  - `author` which is the `username` from the users table,
  - `title`
  - `article_id`
  - `votes`
  - `total_count` which is the accumulated count of all the comments with this article_id. You should make use of knex queries in order to achieve this.
  - `created_at`
  - `topic`

Queries

- This route should accept the following queries:

  - `limit`, which limits the number of responses (defaults to 10)
  - `sort_by`, which sorts the articles by any valid column (defaults to date)
  - `p`, stands for page which specifies the page at which to start (calculated using limit)
  - `order`, which can be set to `asc` or `desc` for ascending or descending (defaults to descending)

```http
POST /api/topics/:topic/articles
```

- accepts an object containing a `title` , `body` and a `username` property
- responds with the posted article

```http
GET /api/articles
```

- responds with an array of article objects
- each article should have:
  - `author` which is the `username` from the users table,
  - `title`
  - `article_id`
  - `body`
  - `votes`
  - `total_count` which is the accumulated count of all the comments with this article_id. You should make use of knex queries in order to achieve this.
  - `created_at`
  - `topic`

Queries

- This route should accept the following queries:
  - `limit`, which limits the number of responses (defaults to 10)
  - `sort_by`, which sorts the articles by any valid column (defaults to date)
  - `p`, stands for page which specifies the page at which to start (calculated using limit)
  - `order`, which can be set to `asc` or `desc` for ascending or descending (defaults to descending)

```http
GET /api/articles/:article_id
```

- responds with an article object
- each article should have:
  - `article_id`
  - `author` which is the `username` from the users table,
  - `title`
  - `votes`
  - `body`
  - `total_count` which is the count of all the comments with this article_id. A particular SQL clause is useful for this job!
  - `created_at`
  - `topic`

```http
PATCH /api/articles/:article_id
```

- accepts an object in the form `{ inc_votes: newVote }`

  - `newVote` will indicate how much the `votes` property in the database should be updated by
    E.g `{ inc_votes : 1 }` would increment the current article's vote property by 1
    `{ inc_votes : -100 }` would decrement the current article's vote property by 100

- this end-point should respond with the article you have just updated

```http
DELETE /api/articles/:article_id
```

- should delete the given article by `article_id`
- should respond with 204 and no-content

```http
GET /api/articles/:article_id/comments
```

- responds with an array of comments for the given `article_id`
- each comment should have
  - `comment_id`
  - `votes`
  - `created_at`
  - `author` which is the `username` from the users table
  - `body`

Queries

- This route should accept the following queries:

  - limit, which limits the number of responses (defaults to 10)
  - sort_by, which sorts the articles by any valid column (defaults to date)
  - p, stands for page which specifies the page at which to start (calculated using limit)
  - sort_ascending, when "true" returns the results sorted in ascending order (defaults to descending)

```http
POST /api/articles/:article_id/comments
```

- accepts an object with a `username` and `body`
- responds with the posted comment

```http
PATCH /api/articles/:article_id/comments/:comment_id
```

- accepts an object in the form `{ inc_votes: newVote }`

  - `newVote` will indicate how much the `votes` property in the database should be updated by
    E.g `{ inc_votes : 1 }` would increment the current article's vote property by 1
    `{ inc_votes : -1 }` would decrement the current article's vote property by 1

- this end-point should respond with the comment you have just updated

```http
DELETE /api/articles/:article_id/comments/:comment_id
```

- should delete the given comment by `comment_id`
- should respond with 204 and no-content

```http
GET /api/users
```

- should respond with an array of user objects
- each user object should have
  - `username`
  - `avatar_url`
  - `name`

```http
GET /api/users/:username
```

- should respond with a user object
- each user should have
  - `username`
  - `avatar_url`
  - `name`

```http
GET /api
```

- should respond with an array ob end-point objects
- each end-point should have
  - `path`
  - `description`
  - `method`
