'use strict';
process.argv.push(`--server`);

const request = require(`supertest`);
const app = require(`../cli/app`);
const {HttpCode} = require(`../../constants`);

test(`When get categories status code should be 200`, async () => {
  const res = await request(app).get(`/api/categories`);
  expect(res.statusCode).toBe(HttpCode.OK);
});
