'use strict';
const axios = require(`axios`);
const {getData, renderError} = require(`../../utils`);
const {URL} = require(`../../constants`);

const ARTICLES_AMOUNT = 3;


module.exports.getArticles = async (req, res) => {
  try {
    const articles = await getData(`${URL}/articles`);
    return res.render(`articles/my`, {data: articles});
  } catch (err) {
    return renderError(err.response.status, res);
  }
};

module.exports.getComments = async (req, res) => {
  try {
    const articles = await getData(`${URL}/articles`);
    const slicedArticles = articles.slice(0, ARTICLES_AMOUNT);
    const commentsUrls = slicedArticles.map((it) => `${URL}/articles/${it.id}/comments`);
    const commentsData = await axios.all(commentsUrls.map((it) => getData(it)));
    return res.render(`articles/comments`, {articles: slicedArticles, comments: commentsData});
  } catch (err) {
    return renderError(err.response.status, res);
  }
};
