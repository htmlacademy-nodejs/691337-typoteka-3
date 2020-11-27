'use strict';
const axios = require(`axios`);
const {getData, renderError, changeDateView} = require(`../../utils`);
const {URL} = require(`../../constants`);

const ARTICLES_AMOUNT = 3;


module.exports.getArticles = async (req, res) => {
  try {
    const data = await getData(`${URL}/articles`);
    data.articles.forEach((it) => {
      it.createdDate = changeDateView(it.createdDate);
    });
    return res.render(`articles/my`, {articles: data.articles});
  } catch (err) {
    return renderError(err.response.status, res);
  }
};

module.exports.getComments = async (req, res) => {
  try {
    const data = await getData(`${URL}/articles`);
    const slicedArticles = data.articles.slice(0, ARTICLES_AMOUNT);
    const commentsUrls = slicedArticles.map((it) => `${URL}/articles/${it.id}/comments`);
    const commentsData = await axios.all(commentsUrls.map((it) => getData(it)));
    commentsData.forEach((it) => {
      it.forEach((el) => {
        el.createdDate = changeDateView(el.createdDate);
      });
    });
    return res.render(`articles/comments`, {articles: slicedArticles, comments: commentsData});
  } catch (err) {
    return renderError(err.response.status, res);
  }
};
