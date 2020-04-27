'use strict';
process.argv.push(`--server`);

const request = require(`supertest`);
const app = require(`../cli/app`);
const {HttpCode} = require(`../../constants`);

const SEARCH_START = 1;
const SEARCH_LENGTH = 4;

test(`When get search status code should be 200`, async () => {
  const res = await request(app).get(`/api/articles`);
  const articleTitle = res.body[0].title;
  const queryString = articleTitle.slice(SEARCH_START, SEARCH_LENGTH);
  const resSearch = await request(app).get(`/api/search?query=${encodeURI(queryString)}`);
  expect(resSearch.statusCode).toBe(HttpCode.OK);
  expect(resSearch.body[0].title).toEqual(articleTitle);
});
