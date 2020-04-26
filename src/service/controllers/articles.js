'use strict';
const {getLogger} = require(`../../logger`);
const {storage} = require(`../../storage`);
const {HttpCode} = require(`../../constants`);
const data = require(`../../../mocks`);

const logger = getLogger();

module.exports.getAll = async (req, res) => {
  const articles = storage.getAllArticles(data);
  logger.info(`End request with status code ${res.statusCode}`);
  return res.json(articles);
};

module.exports.getArticle = async (req, res) => {
  const article = storage.getArticleById(data, req.params.articleId);

  if (!article) {
    logger.error(`End request with error ${HttpCode.NOT_FOUND}`);
    return res.status(HttpCode.NOT_FOUND).end();
  }

  logger.info(`End request with status code ${res.statusCode}`);
  return res.json(article);
};

module.exports.getComments = async (req, res) => {
  const comments = storage.getComments(data, req.params.articleId);

  if (!comments) {
    logger.error(`End request with error ${HttpCode.NOT_FOUND}`);
    return res.status(HttpCode.NOT_FOUND).end();
  }

  logger.info(`End request with status code ${res.statusCode}`);
  return res.json(comments);
};

module.exports.removeArticle = async (req, res) => {
  const article = storage.removeArticleById(data, req.params.articleId);

  if (!article) {
    logger.error(`End request with error ${HttpCode.NOT_FOUND}`);
    return res.status(HttpCode.NOT_FOUND).end();
  }

  logger.info(`End request with status code ${HttpCode.NO_CONTENT}`);
  return res.status(HttpCode.NO_CONTENT).end();
};

module.exports.removeComment = async (req, res) => {
  const comment = storage.removeCommentById(data, req.params.articleId, req.params.commentId);

  if (!comment) {
    logger.error(`End request with error ${HttpCode.NOT_FOUND}`);
    return res.status(HttpCode.NOT_FOUND).end();
  }

  logger.info(`End request with status code ${HttpCode.NO_CONTENT}`);
  return res.status(HttpCode.NO_CONTENT).end();
};

module.exports.updateArticle = async (req, res) => {
  const isValid = storage.isArticleValid(req.body);

  if (!isValid) {
    logger.error(`End request with error ${HttpCode.BAD_REQUEST}`);
    return res.status(HttpCode.BAD_REQUEST).send(`Bad request. Not all data`);
  }

  const article = storage.updateArticle(data, req.params.articleId, req.body);

  if (!article) {
    logger.error(`End request with error ${HttpCode.NOT_FOUND}`);
    return res.status(HttpCode.NOT_FOUND).end();
  }

  logger.info(`End request with status code ${HttpCode.OK}`);
  return res.status(HttpCode.OK).json(article);
};

module.exports.addComment = async (req, res) => {
  const isCommentValid = storage.isCommentValid(req.body.text);

  if (!isCommentValid) {
    logger.error(`End request with error ${HttpCode.BAD_REQUEST}`);
    return res.status(HttpCode.BAD_REQUEST).send(`Bad request. No comment text`);
  }

  const comment = storage.addNewComment(data, req.params.articleId, req.body);

  if (!comment) {
    logger.error(`End request with error ${HttpCode.NOT_FOUND}`);
    return res.status(HttpCode.NOT_FOUND).end();
  }

  logger.info(`End request with status code ${HttpCode.CREATED}`);
  return res.status(HttpCode.CREATED).json(comment);
};

module.exports.addArticle = async (req, res) => {
  const isValid = storage.isArticleValid(req.body);

  if (!isValid) {
    logger.error(`End request with error ${HttpCode.BAD_REQUEST}`);
    return res.status(HttpCode.BAD_REQUEST).send(`Bad request. Not all data`);
  }

  const article = storage.addNewArticle(data, req.body);

  logger.info(`End request with status code ${HttpCode.CREATED}`);
  return res.status(HttpCode.CREATED).json(article);
};
