'use strict';
const express = require(`express`);
const controller = require(`../controllers/articles`);
const checkValidity = require(`../validation/validator`);
const paramsValidator = require(`../validation/validator-params`);
const articleSchema = require(`../validation/schemes/article-schema`);
const commentSchema = require(`../validation/schemes/comment-schema`);

const articlesRouter = new express.Router();
articlesRouter.use(express.json());

articlesRouter.get(`/`, controller.getArticles);
articlesRouter.get(`/all`, controller.getAllArticles);
articlesRouter.get(`/:articleId`, paramsValidator(`articleId`), controller.getArticleById);
articlesRouter.get(`/category/:categoryId`, paramsValidator(`categoryId`), controller.getArticlesByCategory);
articlesRouter.get(`/:articleId/comments`, paramsValidator(`articleId`), controller.getComments);
articlesRouter.delete(`/:articleId`, paramsValidator(`articleId`), controller.removeArticle);
articlesRouter.delete(`/:articleId/comments/:commentId`, paramsValidator(`articleId`),
    paramsValidator(`commentId`), controller.removeComment);
articlesRouter.put(`/:articleId`, paramsValidator(`articleId`), checkValidity(articleSchema), controller.updateArticle);
articlesRouter.post(`/`, checkValidity(articleSchema), controller.addArticle);
articlesRouter.post(`/:articleId/comments`, paramsValidator(`articleId`), checkValidity(commentSchema), controller.addComment);

module.exports = articlesRouter;
