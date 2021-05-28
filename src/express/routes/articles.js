'use strict';

const express = require(`express`);
const csrf = require(`csurf`);
const controller = require(`../controllers/articles`);
const {authAdmin} = require(`../jwt-auth`);
const {upload} = require(`../../utils`);

const articlesRouter = new express.Router();
const csrfProtection = csrf({cookie: true});

articlesRouter.get(`/category/:id`, controller.getArticlesByCategory);
articlesRouter.get(`/add`, [csrfProtection, authAdmin], controller.getNewArticleForm);
articlesRouter.post(`/add`, upload.single(`upload`), [csrfProtection, authAdmin], controller.addArticle);
articlesRouter.post(`/add`, upload.any(), [csrfProtection, authAdmin], controller.addArticle);
articlesRouter.get(`/edit/:id`, [csrfProtection, authAdmin], controller.getArticleByIdToEdit);
articlesRouter.post(`/edit/:id`, upload.single(`upload`), [csrfProtection, authAdmin], controller.updateArticle);
articlesRouter.get(`/:id`, csrfProtection, controller.getArticleById);
articlesRouter.post(`/:id`, upload.any(), csrfProtection, controller.addComment);
articlesRouter.post(`/:id/delete`, upload.any(), [csrfProtection, authAdmin], controller.deleteArticle);

module.exports = articlesRouter;
