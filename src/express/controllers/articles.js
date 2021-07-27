'use strict';
const axios = require(`axios`);
const decodeJwt = require(`jwt-decode`);
const {getData, normalizeDateFormat, changeDateViewOnlyDate, changeDateViewForCalendar, changeDateView, renderError, getUserData} = require(`../../utils`);
const {URL} = require(`../../constants`);
const {getLogger} = require(`../../logger`);

const logger = getLogger();

const currentArticle = {
  article: {},
  articleCategories: [],
  commentsData: []
};

const getArticleByIdToEdit = async (req, res) => {
  try {
    const categories = await getData(`${URL}/categories`);
    const categoriesTitles = categories.map((it) => it.title);
    const article = await getData(`${URL}/articles/${req.params.id}`);
    article.createdDate = changeDateViewForCalendar(article.createdDate);
    return res.render(`articles/edit-post`, {
      data: article,
      categoriesTitles,
      csrf: req.csrfToken(),
    });
  } catch (err) {
    return renderError(err.response.status, res);
  }
};

const getArticleById = async (req, res) => {
  try {
    const article = await getData(`${URL}/articles/${req.params.id}`);
    const categories = await getData(`${URL}/categories`);
    const articleCategories = categories.filter((it) => article.category.includes(it.title));
    const {accessToken} = req.cookies;
    const userData = accessToken ? await decodeJwt(accessToken) : undefined;
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
      user: getUserData(userData),
      csrf: req.csrfToken(),
    });
  } catch (err) {
    return renderError(err.response.status, res);
  }
};

const getArticlesByCategory = async (req, res) => {
  try {
    const currentPage = req.query.page;
    const categories = await getData(`${URL}/categories`);
    const data = await getData(`${URL}/articles/category/${req.params.id}/?page=${currentPage}`);
    data.articles.forEach((it) => {
      it.createdDate = changeDateViewOnlyDate(it.createdDate);
    });
    const {accessToken} = req.cookies;
    const userData = accessToken ? await decodeJwt(accessToken) : undefined;
    return res.render(`articles/articles-by-category`, {
      articles: data.articles,
      view: data.pagesToView,
      current: data.currentPage,
      category: data.categoryData,
      categories: categories.filter((it) => it.articlesAmount > 0),
      user: getUserData(userData),
    });
  } catch (err) {
    return renderError(err.response.status, res);
  }
};

const getNewArticleForm = async (req, res) => {
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

const addArticle = async (req, res) => {
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
    const errorFieldsList = errorsList.map((it) => it.path).flat();

    return res.render(`articles/new-post`, {
      errorsList,
      errorFieldsList,
      data: article,
      categoriesTitles,
      csrf: req.csrfToken(),
    });
  }
};

const updateArticle = async (req, res) => {
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
    const errorFieldsList = errorsList.map((it) => it.path).flat();
    article.createdDate = changeDateViewOnlyDate(article.createdDate);

    return res.render(`articles/edit-post`, {
      errorsList,
      errorFieldsList,
      data: article,
      categoriesTitles,
      csrf: req.csrfToken()
    });
  }
};

const deleteArticle = async (req, res) => {
  try {
    await axios.delete(`${URL}/articles/${req.params.id}`);
    return res.redirect(`/my`);
  } catch (err) {
    return renderError(err.response.status, res);
  }
};

const addComment = async (req, res) => {
  const io = req.app.get(`io`);
  const {accessToken} = req.cookies;
  const userData = accessToken ? await decodeJwt(accessToken) : undefined;
  const readerId = getUserData(userData).id.toString();
  const comment = {
    readerId,
    text: req.body.text
  };

  try {
    await axios.post(`${URL}/articles/${req.params.id}/comments`, comment);

    const articlesData = await getData(`${URL}/articles`);
    const lastComments = articlesData.lastComments;
    const mostDiscussedArticles = articlesData.mostDiscussedArticles;
    io.emit(`last_comments`, lastComments);
    io.emit(`discussed_articles`, mostDiscussedArticles);

    return res.redirect(`/articles/${req.params.id}`);
  } catch (err) {
    logger.error(`Error: ${err.message}`);
    const errorsList = err.response.data;
    return res.render(`articles/post`, {
      errorsList,
      data: currentArticle.article,
      categories: currentArticle.articleCategories,
      comments: currentArticle.commentsData,
      user: getUserData(userData),
      csrf: req.csrfToken(),
    });
  }
};

module.exports = {
  getArticleByIdToEdit,
  getArticleById,
  getArticlesByCategory,
  getNewArticleForm,
  addArticle,
  updateArticle,
  deleteArticle,
  addComment
};
