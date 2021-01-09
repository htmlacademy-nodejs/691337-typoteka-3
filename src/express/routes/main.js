'use strict';

const express = require(`express`);
const mainRouter = new express.Router();
const multer = require(`multer`);
const controller = require(`../controllers/main`);
const upload = multer();

mainRouter.get(`/`, controller.getArticles);
mainRouter.get(`/login`, (req, res) => res.render(`main/login`));
mainRouter.get(`/register`, controller.getRegisterForm);
mainRouter.post(`/register`, upload.any(), controller.addNewReader);
mainRouter.get(`/categories`, (req, res) => res.render(`main/all-categories`));
mainRouter.get(`/search`, controller.getMatchedArticles);

module.exports = mainRouter;
