'use strict';
const {getLogger} = require(`../../logger`);
const {storage} = require(`../../storage`);
const data = require(`../../../mocks`);

const logger = getLogger();

module.exports.getSearch = async (req, res) => {
  const matchedArticles = storage.getMatchedArticles(data, req.query.query);
  logger.info(`End request with status code ${res.statusCode}`);
  return res.json(matchedArticles);
};
