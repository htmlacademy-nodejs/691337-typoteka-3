'use strict';

const {storage} = require(`../../storage`);
const data = require(`../../../mocks`);

module.exports.getCategories = async (req, res) => {
  const categories = storage.getCategories(data);
  return res.json(categories);
};
