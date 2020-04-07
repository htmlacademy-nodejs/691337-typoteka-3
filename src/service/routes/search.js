'use strict';
const express = require(`express`);
const controller = require(`../controllers/search`);

const searchRouter = new express.Router();
searchRouter.use(express.json());

searchRouter.get(`/`, controller.getSearch);

module.exports = searchRouter;
