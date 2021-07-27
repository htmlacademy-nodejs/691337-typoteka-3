'use strict';
process.argv.push(`--server`);

const request = require(`supertest`);
const app = require(`../cli/app`);
const {HttpCode, CategoryMessage} = require(`../../constants`);

const newCategory = {
  valid: {
    title: `Для тестирования`
  },
  notValid: {
    title: `Для`
  }
};

test(`When get categories status code should be 200`, async () => {
  const res = await request(app).get(`/api/categories`);
  expect(res.statusCode).toBe(HttpCode.OK);
});
test(`When create category status code should be 201, check properties`, async () => {
  const resCategory = await request(app).post(`/api/categories`).send(newCategory.valid);
  expect(resCategory.statusCode).toBe(HttpCode.CREATED);
  expect(resCategory.body.title).toEqual(newCategory.valid.title);
});
test(`When not valid category data sent`, async () => {
  const resCategory = await request(app).post(`/api/categories`)
    .send(newCategory.notValid);
  const errorMessage = resCategory.body.map((it) => it.message)[0];
  expect(resCategory.statusCode).toBe(HttpCode.BAD_REQUEST);
  expect(errorMessage).toEqual(CategoryMessage.MIN_TITLE_LENGTH);
});
test(`When delete category status code should be 204`, async () => {
  const res = await request(app).get(`/api/categories`);
  const category = res.body.find((it) => it.articlesAmount === 0);
  const resCategory = await request(app).delete(`/api/categories/${category.id}`);
  expect(resCategory.statusCode).toBe(HttpCode.NO_CONTENT);
});
test(`When delete category status code should be 400, check properties`, async () => {
  const res = await request(app).get(`/api/categories`);
  const category = res.body.find((it) => it.articlesAmount > 0);
  const resCategory = await request(app).delete(`/api/categories/${category.id}`);
  expect(resCategory.statusCode).toBe(HttpCode.BAD_REQUEST);
});


