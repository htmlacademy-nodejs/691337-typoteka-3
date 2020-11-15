'use strict';
const axios = require(`axios`);
const {getData, normalizeDateFormat, changeDateViewOnlyDate, renderError} = require(`../../utils`);
const {URL} = require(`../../constants`);
const {getLogger} = require(`../../logger`);

const logger = getLogger();

module.exports.getArticleById = async (req, res) => {
  try {
    const article = await getData(`${URL}/articles/${req.params.id}`);
    article.createdDate = changeDateViewOnlyDate(article.createdDate);
    return res.render(`articles/edit-post`, {data: article});
  } catch (err) {
    return renderError(err.response.status, res);
  }
};

module.exports.getArticlesByCategory = async (req, res) => {
  try {
    const currentPage = req.query.page;
    const categories = await getData(`${URL}/categories`);
    const data = await getData(`${URL}/articles/category/${req.params.id}/?page=${currentPage}`);
    return res.render(`articles/articles-by-category`, {
      articles: data.articles,
      view: data.pagesToView,
      current: data.currentPage,
      category: data.categoryData,
      categories
    });
  } catch (err) {
    return renderError(err.response.status, res);
  }
};

module.exports.getNewArticleForm = async (req, res) => {
  try {
    const categories = await getData(`${URL}/categories`);
    const categoriesTitles = categories.map((it) => it.title);
    return res.render(`articles/new-post`, {
      data: {},
      categoriesTitles
    });
  } catch (err) {
    return renderError(err.response.status, res);
  }
};

module.exports.addArticle = async (req, res) => {
  const categories = await getData(`${URL}/categories`);
  console.log(req.body.createdDate);
  const categoriesTitles = categories.map((it) => it.title);
  const article = {
    title: req.body.title,
    createdDate: normalizeDateFormat(req.body.createdDate),
    category: categoriesTitles.filter((it) => Object.keys(req.body).includes(it)),
    announce: req.body.announce,
    fullText: req.body.fullText,
  };
  console.log(article.createdDate);

  try {
    await axios.post(`${URL}/articles`, article);
    return res.redirect(`/my`);
  } catch (err) {
    logger.error(`Error: ${err.message}`);
    return res.render(`articles/new-post`, {
      data: article,
      categoriesTitles});
  }
};

