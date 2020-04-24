'use strict';

const {storage} = require(`./storage`);

const mocks = require(`../__fixtures__/test-mocks`);
const categoriesExpected = require(`../__fixtures__/categories`);
const articlesExpected = require(`../__fixtures__/articles`);
const articleExpected = require(`../__fixtures__/article-id`);
const commentExpected = require(`../__fixtures__/comment`);

const WRONG_ID = `DDDDDDDDDDD`;
const ART_ID_1 = `gXo5S-`;
const ART_ID_2 = `JmGMEU`;
const COMMENT_ID = `8oPKHG`;
const SEARCH_STR = `золото`;

const negativeCases = [
  [storage.getArticleById, mocks],
  [storage.getComments, mocks],
  [storage.getArticleById, mocks, WRONG_ID],
  [storage.getComments, mocks, WRONG_ID],
  [storage.removeArticleById, mocks, WRONG_ID],
  [storage.removeCommentById, mocks],
  [storage.removeCommentById, mocks, WRONG_ID],
  [storage.removeCommentById, mocks, ART_ID_1],
  [storage.updateArticle, mocks],
  [storage.updateArticle, mocks, WRONG_ID],
  [storage.addNewComment, mocks],
  [storage.addNewArticle, mocks]
];

const positiveCases = [
  [storage.getCategories, categoriesExpected, mocks],
  [storage.getAllArticles, articlesExpected, mocks],
  [storage.getArticleById, articleExpected, mocks, ART_ID_1],
  [storage.getMatchedArticles, [articleExpected], mocks, SEARCH_STR],
  [storage.removeArticleById, [articleExpected], mocks, ART_ID_1],
  [storage.removeCommentById, [commentExpected], mocks, ART_ID_2, COMMENT_ID],
];

describe(`negative cases`, () => {
  test.each(negativeCases)(`%p`, (fn, ...rest) => {
    expect(fn(...rest)).toBeUndefined();
  });
});

describe(`positive cases`, () => {
  test(`[Function getComments]`, () => {
    expect(storage.getComments(mocks, ART_ID_1)).toContainEqual(commentExpected);
  });
  test.each(positiveCases)(`%p`, (fn, expected, ...rest) => {
    expect(fn(...rest)).toEqual(expected);
  });
  test(`validation of article data`, () => {
    expect(storage.isArticleValid(articleExpected)).toBe(true);
    expect(storage.isArticleValid(commentExpected)).toBe(false);
  });
  test(`validation of comment data`, () => {
    expect(storage.isCommentValid(commentExpected)).toBe(true);
  });
  test(`[Function updateArticle]`, () => {
    expect(storage.updateArticle(mocks, ART_ID_2, articleExpected).title).toEqual(articleExpected.title);
  });
  test(`[Function addNewComment]`, () => {
    expect(storage.addNewComment(mocks, ART_ID_2, commentExpected).text).toEqual(commentExpected.text);
  });
  test(`[Function addNewArticle]`, () => {
    expect(storage.addNewArticle(mocks, articleExpected).title).toEqual(articleExpected.title);
  });
});
