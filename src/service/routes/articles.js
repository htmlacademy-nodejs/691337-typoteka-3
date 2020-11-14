'use strict';
const express = require(`express`);
const controller = require(`../controllers/articles`);
const checkValidity = require(`../validation/validator`);
const articleSchema = require(`../validation/schemes/article-schema`);
const commentSchema = require(`../validation/schemes/comment-schema`);

const articlesRouter = new express.Router();
articlesRouter.use(express.json());

articlesRouter.get(`/`, controller.getArticles);
articlesRouter.get(`/:articleId`, controller.getArticleById);
articlesRouter.get(`/category/:categoryId`, controller.getArticlesByCategory);
articlesRouter.get(`/:articleId/comments`, controller.getComments);
articlesRouter.delete(`/:articleId`, controller.removeArticle);
articlesRouter.delete(`/:articleId/comments/:commentId`, controller.removeComment);
articlesRouter.put(`/:articleId`, checkValidity(articleSchema), controller.updateArticle);
articlesRouter.post(`/`, checkValidity(articleSchema), controller.addArticle);
articlesRouter.post(`/:articleId/comments`, checkValidity(commentSchema), controller.addComment);

module.exports = articlesRouter;
