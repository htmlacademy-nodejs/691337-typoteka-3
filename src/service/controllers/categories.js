'use strict';
const {getLogger} = require(`../../logger`);
const {storage} = require(`../../storage-db`);

const logger = getLogger();

module.exports.getCategories = async (req, res) => {
  const categories = await storage.getCategories();
  logger.info(`End request with status code ${res.statusCode}`);
  return res.json(categories);
};
