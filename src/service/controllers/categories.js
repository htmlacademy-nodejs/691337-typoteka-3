'use strict';
const {getLogger} = require(`../../logger`);
const {storage} = require(`../../db-service/storage-db`);
const {HttpCode, CategoryMessage} = require(`../../constants`);

const logger = getLogger();

const getCategories = async (req, res) => {
  const categories = await storage.getCategories();
  logger.info(`End request with status code ${res.statusCode}`);
  return res.json(categories);
};

const addCategory = async (req, res) => {
  const category = await storage.addNewCategory(req.body);

  logger.info(`End request with status code ${HttpCode.CREATED}`);
  return res.status(HttpCode.CREATED).json(category);
};

const updateCategory = async (req, res) => {
  const category = await storage.updateCategory(req.params.categoryId, req.body);

  if (!category) {
    logger.error(`End request with error ${HttpCode.NOT_FOUND}`);
    return res.status(HttpCode.NOT_FOUND).end();
  }

  logger.info(`End request with status code ${HttpCode.OK}`);
  return res.status(HttpCode.OK).json(category);
};

const checkArticlesExist = async (req, res, next) => {
  const existArticles = await storage.checkArticlesExist(req.params.categoryId);

  if (existArticles) {
    logger.error(`End request with error ${HttpCode.BAD_REQUEST}`);
    return res.status(HttpCode.BAD_REQUEST).json([CategoryMessage.ARTICLES_EXIST]);
  }

  return next();
};

const removeCategory = async (req, res) => {
  const category = await storage.removeCategoryById(req.params.categoryId);

  if (!category) {
    logger.error(`End request with error ${HttpCode.NOT_FOUND}`);
    return res.status(HttpCode.NOT_FOUND).end();
  }

  logger.info(`End request with status code ${HttpCode.NO_CONTENT}`);
  return res.status(HttpCode.NO_CONTENT).end();
};

module.exports = {
  getCategories,
  addCategory,
  updateCategory,
  checkArticlesExist,
  removeCategory
};
