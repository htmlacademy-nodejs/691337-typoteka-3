'use strict';

const express = require(`express`);
const mainRouter = new express.Router();
const controller = require(`../controllers/main`);

mainRouter.get(`/`, controller.getArticles);
mainRouter.get(`/login`, (req, res) => res.render(`main/login`));
mainRouter.get(`/register`, (req, res) => res.render(`main/sign-up`));
mainRouter.get(`/search`, (req, res) => res.render(`main/search`));

module.exports = mainRouter;
