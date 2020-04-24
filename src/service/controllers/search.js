'use strict';

const {storage} = require(`../../storage`);
const data = require(`../../../mocks`);

module.exports.getSearch = async (req, res) => {
  const matchedArticles = storage.getMatchedArticles(data, req.query.query);
  return res.json(matchedArticles);
};
