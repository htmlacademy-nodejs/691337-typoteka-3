'use strict';

const axios = require(`axios`);
const {getData, renderError, changeDateViewOnlyDate, getUserData} = require(`../../utils`);
const {URL} = require(`../../constants`);
const {getLogger} = require(`../../logger`);
const decodeJwt = require(`jwt-decode`);

const logger = getLogger();

const getCategories = async (req, res) => {
  try {
    const categories = await getData(`${URL}/categories`);
    return res.render(`main/all-categories`, {
      data: {},
      categories,
      csrf: req.csrfToken(),
    });
  } catch (err) {
    return renderError(err.response.status, res);
  }
};

const getArticles = async (req, res) => {
  try {
    const currentPage = req.query.page;
    const categories = await getData(`${URL}/categories`);
    const data = await getData(`${URL}/articles/?page=${currentPage}`);
    data.articles.forEach((it) => {
      it.createdDate = changeDateViewOnlyDate(it.createdDate);
    });
    const {accessToken} = req.cookies;
    const userData = accessToken ? await decodeJwt(accessToken) : undefined;
    return res.render(`main/main`, {
      articles: data.articles,
      view: data.pagesToView,
      current: data.currentPage,
      categories: categories.filter((it) => it.articlesAmount > 0),
      discussed: data.mostDiscussedArticles,
      comments: data.lastComments,
      user: getUserData(userData)
    });
  } catch (err) {
    return renderError(err.response.status, res);
  }
};

const getMatchedArticles = async (req, res) => {
  try {
    const searchString = req.query.search;
    const matchedArticles = await getData(`${URL}/search?query=${encodeURI(searchString)}`);
    matchedArticles.forEach((it) => {
      it.createdDate = changeDateViewOnlyDate(it.createdDate);
    });
    const {accessToken} = req.cookies;
    const userData = accessToken ? await decodeJwt(accessToken) : undefined;
    return res.render(`main/search`, {
      data: matchedArticles,
      user: getUserData(userData),
      query: searchString
    });
  } catch (err) {
    return renderError(err.response.status, res);
  }
};

const getRegisterForm = async (req, res) => {
  try {
    return res.render(`main/sign-up`, {
      data: {},
      csrf: req.csrfToken(),
    });
  } catch (err) {
    return renderError(err.response.status, res);
  }
};

const getLoginForm = async (req, res) => {
  try {
    return res.render(`main/login`, {
      data: {},
      csrf: req.csrfToken(),
    });
  } catch (err) {
    return renderError(err.response.status, res);
  }
};

const addCategory = async (req, res) => {
  const category = {
    title: req.body[`add-category`],
  };

  try {
    await axios.post(`${URL}/categories`, category);
    return res.redirect(`/categories`);
  } catch (err) {
    logger.error(`Error: ${err.message}`);
    const errorsList = err.response.data;
    const categories = await getData(`${URL}/categories`);
    return res.render(`main/all-categories`, {
      errorMessage: errorsList[0].message,
      data: category,
      categories,
      csrf: req.csrfToken(),
    });
  }
};

const editOrDeleteCategory = async (req, res) => {

  const action = req.body.action;
  const category = {
    title: req.body.title
  };

  try {
    if (action === `update`) {
      await axios.put(`${URL}/categories/${req.params.id}`, category);
    }
    if (action === `delete`) {
      await axios.delete(`${URL}/categories/${req.params.id}`);
    }
    return res.redirect(`/categories`);
  } catch (err) {
    logger.error(`Error: ${err.message}`);
    const errorsList = err.response.data;
    const categories = await getData(`${URL}/categories`);
    return res.render(`main/all-categories`, {
      errorMessageAction: errorsList[0].message,
      categoryId: req.params.id,
      data: category,
      categories,
      csrf: req.csrfToken(),
    });
  }
};

const addNewReader = async (req, res) => {
  const reader = {
    email: req.body.email,
    firstname: req.body.name,
    lastname: req.body.surname,
    pass: req.body.password,
    repeatPass: req.body[`repeat-password`],
    avatar: req.file ? req.file.filename : ``
  };

  try {
    await axios.post(`${URL}/user`, reader);
    return res.redirect(`/login`);
  } catch (err) {
    logger.error(`Error: ${err}`);
    const errorsList = err.response.data;
    return res.render(`main/sign-up`, {
      errorsList,
      data: reader,
      csrf: req.csrfToken()
    });
  }
};

const authenticateReader = async (req, res) => {
  const reader = {
    email: req.body.email,
    pass: req.body.password
  };

  try {
    const response = await axios.post(`${URL}/user/login`, reader);
    const {accessToken, refreshToken} = response.data;
    await res.cookie(`accessToken`, `${accessToken}`);
    await res.cookie(`refreshToken`, `${refreshToken}`);
    return res.redirect(`/`);
  } catch (err) {
    logger.error(`Error: ${err}`);
    return res.render(`main/login`, {
      loginError: err.response.data,
      data: reader,
      csrf: req.csrfToken()
    });
  }
};

const logout = async (req, res) => {
  const {refreshToken} = req.cookies;

  try {
    await axios.post(`${URL}/user/logout`, {refreshToken});
    await res.clearCookie(`accessToken`);
    await res.clearCookie(`refreshToken`);
    return res.redirect(`/login`);
  } catch (err) {
    return renderError(err.response.status, res);
  }
};

module.exports = {
  getCategories,
  getArticles,
  getMatchedArticles,
  getRegisterForm,
  getLoginForm,
  addCategory,
  editOrDeleteCategory,
  addNewReader,
  authenticateReader,
  logout
};
