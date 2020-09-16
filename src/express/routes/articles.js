'use strict';

const express = require(`express`);
const multer = require(`multer`);
const controller = require(`../controllers/articles`);
const articlesRouter = new express.Router();
const upload = multer();


articlesRouter.get(`/category/:id`, controller.getArticlesByCategory);
articlesRouter.get(`/add`, controller.getNewArticleForm);
articlesRouter.get(`/edit/:id`, controller.getArticleById);
articlesRouter.get(`/:id`, (req, res) => res.render(`articles/post`));
articlesRouter.post(`/add`, upload.any(), controller.addArticle);

module.exports = articlesRouter;
