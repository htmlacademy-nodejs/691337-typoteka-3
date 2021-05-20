'use strict';
const axios = require(`axios`);
const {getData, normalizeDateFormat, changeDateViewOnlyDate, changeDateView, renderError} = require(`../../utils`);
const {URL} = require(`../../constants`);
const {getLogger} = require(`../../logger`);

const logger = getLogger();

const currentArticle = {
  article: {},
  articleCategories: [],
  commentsData: []
};

module.exports.getArticleByIdToEdit = async (req, res) => {
  try {
    const categories = await getData(`${URL}/categories`);
    const categoriesTitles = categories.map((it) => it.title);
    const article = await getData(`${URL}/articles/${req.params.id}`);
    article.createdDate = changeDateViewOnlyDate(article.createdDate);
    return res.render(`articles/edit-post`, {
      data: article,
      categoriesTitles,
      csrf: req.csrfToken(),
    });
  } catch (err) {
    return renderError(err.response.status, res);
  }
};

module.exports.getArticleById = async (req, res) => {
  try {
    const article = await getData(`${URL}/articles/${req.params.id}`);
    const categories = await getData(`${URL}/categories`);
    const articleCategories = categories.filter((it) => article.category.includes(it.title));
    const {avatar, userName, role} = req.cookies;
    article.createdDate = changeDateViewOnlyDate(article.createdDate);
    const commentsData = article.comments;
    commentsData.forEach((it) => {
      it.createdDate = changeDateView(it.createdDate);
    });

    currentArticle.article = article;
    currentArticle.articleCategories = articleCategories;
    currentArticle.commentsData = commentsData;
    return res.render(`articles/post`, {
      data: article,
      categories: articleCategories,
      comments: commentsData,
      user: {
        avatar,
        userName,
        role
      },
      csrf: req.csrfToken(),
    });
  } catch (err) {
    return renderError(err.response.status, res);
  }
};

module.exports.getArticlesByCategory = async (req, res) => {
  try {
    const currentPage = req.query.page;
    const categories = await getData(`${URL}/categories`);
    const data = await getData(`${URL}/articles/category/${req.params.id}/?page=${currentPage}`);
    data.articles.forEach((it) => {
      it.createdDate = changeDateViewOnlyDate(it.createdDate);
    });
    const {avatar, userName, role} = req.cookies;
    return res.render(`articles/articles-by-category`, {
      articles: data.articles,
      view: data.pagesToView,
      current: data.currentPage,
      category: data.categoryData,
      categories: categories.filter((it) => it.articlesAmount > 0),
      user: {
        avatar,
        userName,
        role
      },
    });
  } catch (err) {
    return renderError(err.response.status, res);
  }
};

module.exports.getNewArticleForm = async (req, res) => {
  try {
    const categories = await getData(`${URL}/categories`);
    const categoriesTitles = categories.map((it) => it.title);
    const date = changeDateViewOnlyDate(Date.now());

    return res.render(`articles/new-post`, {
      data: {
        createdDate: date
      },
      categoriesTitles,
      csrf: req.csrfToken(),
    });
  } catch (err) {
    return renderError(err.response.status, res);
  }
};

module.exports.addArticle = async (req, res) => {
  const categories = await getData(`${URL}/categories`);
  const categoriesTitles = categories.map((it) => it.title);
  const article = {
    title: req.body.title,
    createdDate: normalizeDateFormat(req.body.date),
    category: req.body.category || [],
    announce: req.body.announce,
    fullText: req.body.fullText,
    picture: req.file ? req.file.filename : ``
  };

  try {
    await axios.post(`${URL}/articles`, article);
    return res.redirect(`/my`);
  } catch (err) {
    logger.error(`Error: ${err.message}`);
    const errorsList = err.response.data;
    return res.render(`articles/new-post`, {
      errorsList,
      data: article,
      categoriesTitles,
      csrf: req.csrfToken(),
    });
  }
};

module.exports.updateArticle = async (req, res) => {
  const categories = await getData(`${URL}/categories`);
  const categoriesTitles = categories.map((it) => it.title);
  const article = {
    title: req.body.title,
    createdDate: normalizeDateFormat(req.body.date),
    category: req.body.category || [],
    announce: req.body.announce,
    fullText: req.body.fullText,
    picture: req.file ? req.file.filename : ``
  };

  try {
    await axios.put(`${URL}/articles/${req.params.id}`, article);
    return res.redirect(`/my`);
  } catch (err) {
    logger.error(`Error: ${err.message}`);
    const errorsList = err.response.data;
    article.createdDate = changeDateViewOnlyDate(article.createdDate);
    return res.render(`articles/edit-post`, {
      errorsList,
      data: article,
      categoriesTitles,
      csrf: req.csrfToken()
    });
  }
};

module.exports.deleteArticle = async (req, res) => {
  try {
    await axios.delete(`${URL}/articles/${req.params.id}`);
    return res.redirect(`/my`);
  } catch (err) {
    return renderError(err.response.status, res);
  }
};

module.exports.addComment = async (req, res) => {
  const {readerId, avatar, userName, role} = req.cookies;
  const comment = {
    readerId,
    text: req.body.text
  };

  try {
    await axios.post(`${URL}/articles/${req.params.id}/comments`, comment);
    return res.redirect(`/articles/${req.params.id}`);
  } catch (err) {
    logger.error(`Error: ${err.message}`);
    const errorsList = err.response.data;
    return res.render(`articles/post`, {
      errorsList,
      data: currentArticle.article,
      categories: currentArticle.articleCategories,
      comments: currentArticle.commentsData,
      user: {
        avatar,
        userName,
        role
      },
      csrf: req.csrfToken(),
    });
  }
};
