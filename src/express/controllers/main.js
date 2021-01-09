'use strict';

const axios = require(`axios`);
const {getData, renderError, changeDateView} = require(`../../utils`);
const {URL} = require(`../../constants`);
const {getLogger} = require(`../../logger`);

const logger = getLogger();

module.exports.getArticles = async (req, res) => {
  try {
    const currentPage = req.query.page;
    const categories = await getData(`${URL}/categories`);
    const data = await getData(`${URL}/articles/?page=${currentPage}`);
    data.articles.forEach((it) => {
      it.createdDate = changeDateView(it.createdDate);
    });
    return res.render(`main/main`, {
      articles: data.articles,
      view: data.pagesToView,
      current: data.currentPage,
      categories
    });
  } catch (err) {
    return renderError(err.response.status, res);
  }
};

module.exports.getMatchedArticles = async (req, res) => {
  try {
    const searchString = req.query.search;
    const matchedArticles = await getData(`${URL}/search?query=${encodeURI(searchString)}`);
    matchedArticles.forEach((it) => {
      it.createdDate = changeDateView(it.createdDate);
    });
    return res.render(`main/search`, {data: matchedArticles, query: searchString});
  } catch (err) {
    return renderError(err.response.status, res);
  }
};

module.exports.getRegisterForm = async (req, res) => {
  try {
    return res.render(`main/sign-up`, {
      data: {}
    });
  } catch (err) {
    return renderError(err.response.status, res);
  }
};

module.exports.addNewReader = async (req, res) => {
  const reader = {
    email: req.body.email,
    firstname: req.body.name,
    lastname: req.body.surname,
    pass: req.body.password,
    repeatPass: req.body[`repeat-password`],
    avatar: req.body.upload || `avatar-1.jpg`
  };

  try {
    await axios.post(`${URL}/user`, reader);
    return res.redirect(`/login`);
  } catch (err) {
    logger.error(`Error: ${err}`);
    const errorsList = err.response.data.notValid;
    return res.render(`main/sign-up`, {
      errorsList,
      data: reader
    });
  }
};
