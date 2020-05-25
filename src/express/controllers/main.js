'use strict';
const {getData, renderError} = require(`../../utils`);
const {URL} = require(`../../constants`);

module.exports.getArticles = async (req, res) => {
  try {
    const articles = await getData(`${URL}/articles`);
    return res.render(`main/main`, {data: articles});
  } catch (err) {
    return renderError(err.response.status, res);
  }
};
