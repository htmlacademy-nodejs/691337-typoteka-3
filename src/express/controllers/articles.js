'use strict';
const axios = require(`axios`);
const {getData, changeDateFormat, renderError} = require(`../../utils`);
const {URL} = require(`../../constants`);
const {getLogger} = require(`../../logger`);

const logger = getLogger();

module.exports.getArticleById = async (req, res) => {
  try {
    const article = await getData(`${URL}/articles/${req.params.id}`);
    return res.render(`articles/edit-post`, {data: article});
  } catch (err) {
    return renderError(err.response.status, res);
  }
};

module.exports.getArticlesByCategory = async (req, res) => {
  try {
    const currentPage = req.query.page;
    const data = await getData(`${URL}/articles/category/${req.params.id}/?page=${currentPage}`);
    return res.render(`articles/articles-by-category`);
  } catch (err) {
    return renderError(err.response.status, res);
  }
};

module.exports.getNewArticleForm = (req, res) => {
  try {
    return res.render(`articles/new-post`, {data: {}});
  } catch (err) {
    return renderError(err.response.status, res);
  }
};

module.exports.addArticle = async (req, res) => {
  const article = {
    title: req.body.title,
    createdDate: changeDateFormat(req.body.createdDate),
    category: req.body.category || [],
    announce: req.body.announce,
    fullText: req.body.fullText,
  };

  try {
    await axios.post(`${URL}/articles`, article);
    return res.redirect(`/my`);
  } catch (err) {
    logger.error(`Error: ${err.message}`);
    return res.render(`articles/new-post`, {data: article});
  }
};

