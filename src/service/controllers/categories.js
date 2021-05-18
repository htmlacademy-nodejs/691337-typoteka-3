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
