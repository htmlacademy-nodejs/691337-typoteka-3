'use strict';
const express = require(`express`);
const controller = require(`../controllers/categories`);

const categoriesRouter = new express.Router();

categoriesRouter.get(`/`, controller.getCategories);

module.exports = categoriesRouter;
