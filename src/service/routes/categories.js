'use strict';
const express = require(`express`);
const controller = require(`../controllers/categories`);
const checkValidity = require(`../validation/validator`);
const categorySchema = require(`../validation/schemes/category-schema`);

const categoriesRouter = new express.Router();

categoriesRouter.get(`/`, controller.getCategories);
categoriesRouter.post(`/`, checkValidity(categorySchema), controller.addCategory);

module.exports = categoriesRouter;
