'use strict';
const {getLogger} = require(`../../logger`);
const {storage} = require(`../../storage`);
const data = require(`../../../mocks`);

const logger = getLogger();

module.exports.getCategories = async (req, res) => {
  const categories = storage.getCategories(data);
  logger.info(`End request with status code ${res.statusCode}`);
  return res.json(categories);
};
