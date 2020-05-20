'use strict';

const express = require(`express`);
const mainRouter = new express.Router();
const controller = require(`../controllers/main`);

//mainRouter.get(`/`, (req, res) => res.render(`main`));
mainRouter.get(`/`, controller.getArticles);
mainRouter.get(`/login`, (req, res) => res.render(`auth/login`));
mainRouter.get(`/register`, (req, res) => res.render(`auth/sign-up`));
mainRouter.get(`/search`, (req, res) => res.render(`search`));

module.exports = mainRouter;
