'use strict';
const {getData, renderError} = require(`../../utils`);
const {URL} = require(`../../constants`);

module.exports.getArticleById = async (req, res) => {
  try {
    const article = await getData(`${URL}/articles/${req.params.id}`);
    return res.render(`articles/edit-post`, {data: article});
  } catch (err) {
    return renderError(err.response.status, res);
  }
};
