'use strict';
const {getLogger} = require(`../../logger`);
const {storage} = require(`../../db-service/storage-db`);

const logger = getLogger();

const getSearch = async (req, res) => {
  const matchedArticles = await storage.getMatchedArticles(req.query.query);
  logger.info(`End request with status code ${res.statusCode}`);
  return res.json(matchedArticles);
};

module.exports = {
  getSearch
};
