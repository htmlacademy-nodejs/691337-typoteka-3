'use strict';

const {storage} = require(`../../storage`);

module.exports.getCategories = async (req, res) => {
  const categories = storage.getCategories();
  return res.json(categories);
};
