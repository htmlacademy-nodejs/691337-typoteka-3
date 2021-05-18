'use strict';

const express = require(`express`);
const csrf = require(`csurf`);
const controller = require(`../controllers/main`);
const {upload} = require(`../../utils`);
const {authAdmin} = require(`../jwt-auth`);
const mainRouter = new express.Router();

const csrfProtection = csrf({cookie: true});

mainRouter.get(`/`, controller.getArticles);
mainRouter.get(`/register`, csrfProtection, controller.getRegisterForm);
mainRouter.get(`/login`, csrfProtection, controller.getLoginForm);
mainRouter.post(`/register`, upload.single(`upload`), csrfProtection, controller.addNewReader);
mainRouter.post(`/login`, upload.single(`upload`), csrfProtection, controller.authenticateReader);
mainRouter.get(`/logout`, controller.logout);
mainRouter.get(`/categories`, [csrfProtection, authAdmin], controller.getCategories);
mainRouter.post(`/categories`, upload.any(), [csrfProtection, authAdmin], controller.addCategory);
mainRouter.get(`/search`, controller.getMatchedArticles);

module.exports = mainRouter;
