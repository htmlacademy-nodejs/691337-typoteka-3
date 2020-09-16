'use strict';
const express = require(`express`);
const controller = require(`../controllers/articles`);

const articlesRouter = new express.Router();
articlesRouter.use(express.json());

articlesRouter.get(`/`, controller.getArticles);
articlesRouter.get(`/:articleId`, controller.getArticleById);
articlesRouter.get(`/category/:categoryId`, controller.getArticlesByCategory);
articlesRouter.get(`/:articleId/comments`, controller.getComments);
articlesRouter.delete(`/:articleId`, controller.removeArticle);
articlesRouter.delete(`/:articleId/comments/:commentId`, controller.removeComment);
articlesRouter.put(`/:articleId`, controller.updateArticle);
articlesRouter.post(`/`, controller.addArticle);
articlesRouter.post(`/:articleId/comments`, controller.addComment);

module.exports = articlesRouter;
