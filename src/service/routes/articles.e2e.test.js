'use strict';
process.argv.push(`--server`);

const request = require(`supertest`);
const app = require(`../cli/app`);
const {HttpCode, ArticleMessage} = require(`../../constants`);

const WRONG_ID = `dZuF7ilQ61Dl`;

const newArticle = {
  valid: {
    title: `Структуры мозга подобны сети галактик`,
    createdDate: `2020-11-14T22:00:00.000Z`,
    announce: `Специалисты установили, что человеческий мозг и Вселенная имеют структуры с одинаковыми уровнями сложности.`,
    picture: `item05.jpg`,
    fullText: `Человеческий мозг функционирует благодаря наличию обширной нейронной сети, насчитывающей около 69 миллиардов нейронов. Наблюдаемая Вселенная, в свою очередь, состоит минимум из 100 миллиардов галактик.`,
    category: [`Деревья`, `Программирование`]
  },
  notValid: {
    title: `Структуры`,
    createdDate: `2020-11-11T17:47:06.555Z`,
    announce: `2345`,
    picture: `item05.jpg`,
    category: []
  }
};

const newComment = {
  valid: {
    text: `Предложенный метод найдет применение как в космологии, так и в нейрохирургии.`
  },
  notValid: {
    text: ``
  }
};

const errorsList = [
  ArticleMessage.MIN_TITLE_LENGTH,
  ArticleMessage.CATEGORY_REQUIRED,
  ArticleMessage.MIN_ANNOUNCE_LENGTH
];

describe(`GET routes /api/articles`, () => {
  test(`When get article status code should be 200, check properties`, async () => {
    const res = await request(app).get(`/api/articles`);
    const id = res.body.articles[0].id;
    const resArticle = await request(app).get(`/api/articles/${id}`);
    expect(res.statusCode).toBe(HttpCode.OK);
    expect(resArticle.statusCode).toBe(HttpCode.OK);
    expect(resArticle.body).toHaveProperty(`id`);
    expect(resArticle.body).toHaveProperty(`title`);
  });
  test(`When get comments status code should be 200`, async () => {
    const res = await request(app).get(`/api/articles`);
    const id = res.body.articles[0].id;
    const resComments = await request(app).get(`/api/articles/${id}/comments`);
    expect(resComments.statusCode).toBe(HttpCode.OK);
  });
  test(`When get article with wrong id`, async () => {
    const resArticle = await request(app).get(`/api/articles/${WRONG_ID}`);
    expect(resArticle.statusCode).toBe(HttpCode.NOT_FOUND);
  });
  test(`When get comments with wrong article id`, async () => {
    const resComments = await request(app).get(`/api/articles/${WRONG_ID}/comments`);
    expect(resComments.statusCode).toBe(HttpCode.NOT_FOUND);
  });
});

describe(`PUT routes /api/articles`, () => {
  test(`When update article status code should be 200, check properties`, async () => {
    const res = await request(app).get(`/api/articles`);
    const article = res.body.articles[0];
    const resArticle = await request(app).put(`/api/articles/${article.id}`).send(newArticle.valid);
    expect(resArticle.statusCode).toBe(HttpCode.OK);
    expect(resArticle.body.id).toEqual(article.id);
    expect(resArticle.body.title).toEqual(newArticle.valid.title);
  });
  test(`When update article with wrong id`, async () => {
    const resArticle = await request(app).put(`/api/articles/${WRONG_ID}`).send(newArticle.valid);
    expect(resArticle.statusCode).toBe(HttpCode.NOT_FOUND);
  });
  test(`When not valid data sent`, async () => {
    const res = await request(app).get(`/api/articles`);
    const article = res.body.articles[0];
    const resArticle = await request(app).put(`/api/articles/${article.id}`)
      .send(newArticle.notValid);
    expect(resArticle.statusCode).toBe(HttpCode.BAD_REQUEST);
    expect(resArticle.body.notValid).toEqual(errorsList);
  });
});

describe(`POST routes /api/articles`, () => {
  test(`When create comment status code should be 201, check properties`, async () => {
    const res = await request(app).get(`/api/articles`);
    const article = res.body.articles[0];
    const resComment = await request(app).post(`/api/articles/${article.id}/comments`)
      .send(newComment.valid);
    expect(resComment.statusCode).toBe(HttpCode.CREATED);
    expect(resComment.body.text).toEqual(newComment.text);
  });
  test(`When create article status code should be 201, check properties`, async () => {
    const resArticle = await request(app).post(`/api/articles`).send(newArticle.valid);
    expect(resArticle.statusCode).toBe(HttpCode.CREATED);
    expect(resArticle.body.title).toEqual(newArticle.valid.title);
  });
  test(`When create comment to offer with wrong id`, async () => {
    const resComment = await request(app).post(`/api/articles/${WRONG_ID}/comments`)
      .send(newComment.valid);
    expect(resComment.statusCode).toBe(HttpCode.NOT_FOUND);
  });
  test(`When not valid article data sent`, async () => {
    const resArticle = await request(app).post(`/api/articles/`)
      .send(newArticle.notValid);
    expect(resArticle.statusCode).toBe(HttpCode.BAD_REQUEST);
    expect(resArticle.body.notValid).toEqual(errorsList);
  });
  test(`When not valid comment data sent`, async () => {
    const res = await request(app).get(`/api/articles`);
    const article = res.body.articles[0];
    const resComment = await request(app).post(`/api/articles/${article.id}/comments`)
      .send(newComment.notValid);
    expect(resComment.statusCode).toBe(HttpCode.BAD_REQUEST);
  });
});

describe(`DELETE routes /api/articles`, () => {
  test(`When delete article status code should be 204`, async () => {
    const res = await request(app).get(`/api/articles`);
    const article = res.body.articles[0];
    const resArticle = await request(app).delete(`/api/articles/${article.id}`);
    expect(resArticle.statusCode).toBe(HttpCode.NO_CONTENT);
  });
  test(`When delete comment status code should be 204`, async () => {
    const res = await request(app).get(`/api/articles`);
    const article = res.body.articles[0];
    const resComments = await request(app).get(`/api/articles/${article.id}/comments`);
    if (resComments.body.length > 0) {
      const comment = resComments.body[0];
      const resDeleteComment = await request(app)
        .delete(`/api/articles/${article.id}/comments/${comment.id}`);
      expect(resDeleteComment.statusCode).toBe(HttpCode.NO_CONTENT);
    }
  });
  test(`When delete article with wrong id`, async () => {
    const resArticle = await request(app).delete(`/api/articles/${WRONG_ID}`);
    expect(resArticle.statusCode).toBe(HttpCode.NOT_FOUND);
  });
  test(`When delete comment with wrong articleId`, async () => {
    const resComments = await request(app).delete(`/api/articles/${WRONG_ID}/comments`);
    expect(resComments.statusCode).toBe(HttpCode.NOT_FOUND);
  });
  test(`When delete comment with wrong commentId`, async () => {
    const res = await request(app).get(`/api/articles`);
    const article = res.body.articles[0];
    const resComment = await request(app).delete(`/api/articles/${article.id}/comments/${WRONG_ID}`);
    expect(resComment.statusCode).toBe(HttpCode.NOT_FOUND);
  });
});
