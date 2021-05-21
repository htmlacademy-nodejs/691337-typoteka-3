'use strict';
const {getLogger} = require(`../../logger`);
const {storage} = require(`../../db-service/storage-db`);
const {HttpCode} = require(`../../constants`);

const logger = getLogger();

module.exports.getCategories = async (req, res) => {
  const categories = await storage.getCategories();
  logger.info(`End request with status code ${res.statusCode}`);
  return res.json(categories);
};

module.exports.addCategory = async (req, res) => {
  const category = await storage.addNewCategory(req.body);

  logger.info(`End request with status code ${HttpCode.CREATED}`);
  return res.status(HttpCode.CREATED).json(category);
};

module.exports.updateCategory = async (req, res) => {
  const category = await storage.updateCategory(req.params.categoryId, req.body);

  if (!category) {
    logger.error(`End request with error ${HttpCode.NOT_FOUND}`);
    return res.status(HttpCode.NOT_FOUND).end();
  }

  logger.info(`End request with status code ${HttpCode.OK}`);
  return res.status(HttpCode.OK).json(category);
};

module.exports.removeCategory = async (req, res) => {
  const category = await storage.removeCategoryById(req.params.categoryId);

  if (!category) {
    logger.error(`End request with error ${HttpCode.NOT_FOUND}`);
    return res.status(HttpCode.NOT_FOUND).end();
  }

  logger.info(`End request with status code ${HttpCode.NO_CONTENT}`);
  return res.status(HttpCode.NO_CONTENT).end();
};

