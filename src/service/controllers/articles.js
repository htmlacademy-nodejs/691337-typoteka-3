'use strict';
const {getLogger} = require(`../../logger`);
const {storage} = require(`../../db-service/storage-db`);
const {HttpCode} = require(`../../constants`);

const logger = getLogger();

const getArticles = async (req, res) => {
  const articles = await storage.getArticles(req.query.page);
  logger.info(`End request with status code ${res.statusCode}`);
  return res.json(articles);
};

const getAllArticles = async (req, res) => {
  const articles = await storage.getAllArticles();
  logger.info(`End request with status code ${res.statusCode}`);
  return res.json(articles);
};

const getArticleById = async (req, res) => {
  const article = await storage.getArticleById(req.params.articleId);

  if (!article) {
    logger.error(`End request with error ${HttpCode.NOT_FOUND}`);
    return res.status(HttpCode.NOT_FOUND).end();
  }

  logger.info(`End request with status code ${res.statusCode}`);
  return res.json(article);
};

const getArticlesByCategory = async (req, res) => {
  const articles = await storage.getArticlesByCategoryId(req.params.categoryId, req.query.page);

  if (!articles) {
    logger.error(`End request with error ${HttpCode.NOT_FOUND}`);
    return res.status(HttpCode.NOT_FOUND).end();
  }

  logger.info(`End request with status code ${res.statusCode}`);
  return res.json(articles);
};

const getComments = async (req, res) => {
  const comments = await storage.getComments(req.params.articleId);

  if (!comments) {
    logger.error(`End request with error ${HttpCode.NOT_FOUND}`);
    return res.status(HttpCode.NOT_FOUND).end();
  }

  logger.info(`End request with status code ${res.statusCode}`);
  return res.json(comments);
};

const removeArticle = async (req, res) => {
  const article = await storage.removeArticleById(req.params.articleId);

  if (!article) {
    logger.error(`End request with error ${HttpCode.NOT_FOUND}`);
    return res.status(HttpCode.NOT_FOUND).end();
  }

  logger.info(`End request with status code ${HttpCode.NO_CONTENT}`);
  return res.status(HttpCode.NO_CONTENT).end();
};

const removeComment = async (req, res) => {
  const comment = await storage.removeCommentById(req.params.articleId, req.params.commentId);

  if (!comment) {
    logger.error(`End request with error ${HttpCode.NOT_FOUND}`);
    return res.status(HttpCode.NOT_FOUND).end();
  }

  logger.info(`End request with status code ${HttpCode.NO_CONTENT}`);
  return res.status(HttpCode.NO_CONTENT).end();
};

const updateArticle = async (req, res) => {
  const article = await storage.updateArticle(req.params.articleId, req.body);

  if (!article) {
    logger.error(`End request with error ${HttpCode.NOT_FOUND}`);
    return res.status(HttpCode.NOT_FOUND).end();
  }

  logger.info(`End request with status code ${HttpCode.OK}`);
  return res.status(HttpCode.OK).json(article);
};

const addComment = async (req, res) => {
  const comment = await storage.addNewComment(req.params.articleId, req.body);

  if (!comment) {
    logger.error(`End request with error ${HttpCode.NOT_FOUND}`);
    return res.status(HttpCode.NOT_FOUND).end();
  }

  logger.info(`End request with status code ${HttpCode.CREATED}`);
  return res.status(HttpCode.CREATED).json(comment);
};

const addArticle = async (req, res) => {
  const article = await storage.addNewArticle(req.body);

  logger.info(`End request with status code ${HttpCode.CREATED}`);
  return res.status(HttpCode.CREATED).json(article);
};

module.exports = {
  getArticles,
  getAllArticles,
  getArticleById,
  getArticlesByCategory,
  getComments,
  removeArticle,
  removeComment,
  updateArticle,
  addComment,
  addArticle
};
