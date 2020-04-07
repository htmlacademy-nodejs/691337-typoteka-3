'use strict';
const express = require(`express`);
const controller = require(`../controllers/categories`);

const categoriesRouter = new express.Router();
//postsRouter.use(express.json());

categoriesRouter.get(`/`, controller.getCategories);

module.exports = categoriesRouter;
