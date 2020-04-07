'use strict';

const {storage} = require(`../../storage`);

module.exports.getSearch = async (req, res) => {
  const matchedArticles = storage.getMatchedArticles(req.query.query);
  return res.json(matchedArticles);
};
