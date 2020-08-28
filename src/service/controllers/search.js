'use strict';
const {getLogger} = require(`../../logger`);
const {storage} = require(`../../storage-db`);

const logger = getLogger();

module.exports.getSearch = async (req, res) => {
  const matchedArticles = await storage.getMatchedArticles(req.query.query);
  logger.info(`End request with status code ${res.statusCode}`);
  return res.json(matchedArticles);
};
