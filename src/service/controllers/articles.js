'use strict';

const {storage} = require(`../../storage`);
const {HttpCode} = require(`../../constants`);
const data = require(`../../../mocks`);

module.exports.getAll = async (req, res) => {
  const articles = storage.getAllArticles(data);
  return res.json(articles);
};

module.exports.getArticle = async (req, res) => {
  const article = storage.getArticleById(data, req.params.articleId);

  if (!article) {
    return res.status(HttpCode.NOT_FOUND).end();
  }

  return res.json(article);
};

module.exports.getComments = async (req, res) => {
  const comments = storage.getComments(data, req.params.articleId);

  if (!comments) {
    return res.status(HttpCode.NOT_FOUND).end();
  }

  return res.json(comments);
};

module.exports.removeArticle = async (req, res) => {
  const article = storage.removeArticleById(data, req.params.articleId);

  if (!article) {
    return res.status(HttpCode.NOT_FOUND).end();
  }

  return res.status(HttpCode.NO_CONTENT).end();
};

module.exports.removeComment = async (req, res) => {
  const comment = storage.removeCommentById(data, req.params.articleId, req.params.commentId);

  if (!comment) {
    return res.status(HttpCode.NOT_FOUND).end();
  }

  return res.status(HttpCode.NO_CONTENT).end();
};

module.exports.updateArticle = async (req, res) => {
  const isValid = storage.isArticleValid(req.body);

  if (!isValid) {
    return res.status(HttpCode.BAD_REQUEST).send(`Bad request. Not all data`);
  }

  const article = storage.updateArticle(data, req.params.articleId, req.body);

  if (!article) {
    return res.status(HttpCode.NOT_FOUND).end();
  }

  return res.status(HttpCode.OK).json(article);
};

module.exports.addComment = async (req, res) => {
  const isCommentValid = storage.isCommentValid(req.body.text);

  if (!isCommentValid) {
    return res.status(HttpCode.BAD_REQUEST).send(`Bad request. No comment text`);
  }

  const comment = storage.addNewComment(data, req.params.articleId, req.body);

  if (!comment) {
    return res.status(HttpCode.NOT_FOUND).end();
  }

  return res.status(HttpCode.CREATED).json(comment);
};

module.exports.addArticle = async (req, res) => {
  const isValid = storage.isArticleValid(req.body);

  if (!isValid) {
    return res.status(HttpCode.BAD_REQUEST).send(`Bad request. Not all data`);
  }

  const article = storage.addNewArticle(data, req.body);

  return res.status(HttpCode.CREATED).json(article);
};
