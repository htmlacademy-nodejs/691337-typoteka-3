'use strict';

const express = require(`express`);
const controller = require(`../controllers/articles`);
const articlesRouter = new express.Router();

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles/articles-by-category`));
articlesRouter.get(`/add`, (req, res) => res.render(`articles/new-post`));
articlesRouter.get(`/edit/:id`, controller.getArticleById);
articlesRouter.get(`/:id`, (req, res) => res.render(`articles/post`));

module.exports = articlesRouter;
