'use strict';
const {getLogger} = require(`../../logger`);
const {storage} = require(`../../db-service/storage-db`);
const {HttpCode} = require(`../../constants`);

const logger = getLogger();

module.exports.getArticles = async (req, res) => {
  const articles = await storage.getArticles(req.query.page);
  logger.info(`End request with status code ${res.statusCode}`);
  return res.json(articles);
};

module.exports.getAllArticles = async (req, res) => {
  const articles = await storage.getAllArticles();
  logger.info(`End request with status code ${res.statusCode}`);
  return res.json(articles);
};

module.exports.getArticleById = async (req, res) => {
  const article = await storage.getArticleById(req.params.articleId);

  if (!article) {
    logger.error(`End request with error ${HttpCode.NOT_FOUND}`);
    return res.status(HttpCode.NOT_FOUND).end();
  }

  logger.info(`End request with status code ${res.statusCode}`);
  return res.json(article);
};

module.exports.getArticlesByCategory = async (req, res) => {
  const articles = await storage.getArticlesByCategoryId(req.params.categoryId, req.query.page);

  if (!articles) {
    logger.error(`End request with error ${HttpCode.NOT_FOUND}`);
    return res.status(HttpCode.NOT_FOUND).end();
  }

  logger.info(`End request with status code ${res.statusCode}`);
  return res.json(articles);
};

module.exports.getComments = async (req, res) => {
  const comments = await storage.getComments(req.params.articleId);

  if (!comments) {
    logger.error(`End request with error ${HttpCode.NOT_FOUND}`);
    return res.status(HttpCode.NOT_FOUND).end();
  }

  logger.info(`End request with status code ${res.statusCode}`);
  return res.json(comments);
};

module.exports.removeArticle = async (req, res) => {
  const article = await storage.removeArticleById(req.params.articleId);

  if (!article) {
    logger.error(`End request with error ${HttpCode.NOT_FOUND}`);
    return res.status(HttpCode.NOT_FOUND).end();
  }

  logger.info(`End request with status code ${HttpCode.NO_CONTENT}`);
  return res.status(HttpCode.NO_CONTENT).end();
};

module.exports.removeComment = async (req, res) => {
  const comment = await storage.removeCommentById(req.params.articleId, req.params.commentId);

  if (!comment) {
    logger.error(`End request with error ${HttpCode.NOT_FOUND}`);
    return res.status(HttpCode.NOT_FOUND).end();
  }

  logger.info(`End request with status code ${HttpCode.NO_CONTENT}`);
  return res.status(HttpCode.NO_CONTENT).end();
};

module.exports.updateArticle = async (req, res) => {
  const article = await storage.updateArticle(req.params.articleId, req.body);

  if (!article) {
    logger.error(`End request with error ${HttpCode.NOT_FOUND}`);
    return res.status(HttpCode.NOT_FOUND).end();
  }

  logger.info(`End request with status code ${HttpCode.OK}`);
  return res.status(HttpCode.OK).json(article);
};

module.exports.addComment = async (req, res) => {
  const comment = await storage.addNewComment(req.params.articleId, req.body);

  if (!comment) {
    logger.error(`End request with error ${HttpCode.NOT_FOUND}`);
    return res.status(HttpCode.NOT_FOUND).end();
  }

  logger.info(`End request with status code ${HttpCode.CREATED}`);
  return res.status(HttpCode.CREATED).json(comment);
};

module.exports.addArticle = async (req, res) => {
  const article = await storage.addNewArticle(req.body);

  logger.info(`End request with status code ${HttpCode.CREATED}`);
  return res.status(HttpCode.CREATED).json(article);
};
